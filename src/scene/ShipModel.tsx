import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

const MODEL_URL = "/models/spaceship.glb";
const TARGET_LENGTH = 2.1;
const _v = new THREE.Vector3();

export type ShipLayout = {
  engineZ: number;
  engineY: number;
  engineSpread: number;
  pickRadius: number;
  labelY: number;
};

/** Rotate so the longest dimension becomes local +Z. */
function alignLongestAxisToZ(root: THREE.Object3D): void {
  root.updateMatrixWorld(true);
  const size = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3());
  if (size.x >= size.y && size.x >= size.z) {
    root.rotateY(-Math.PI / 2);
  } else if (size.y > size.x && size.y > size.z) {
    root.rotateX(-Math.PI / 2);
  }
}

/** Stern is wider than the tapered nose — keep engines at -Z. */
function ensureNoseAtPositiveZ(root: THREE.Object3D): void {
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const band = Math.max(size.z * 0.06, 0.02);

  const sternAtMax =
    endCrossSection(root, box.max.z - band, band * 1.5) >
    endCrossSection(root, box.min.z + band, band * 1.5);
  if (sternAtMax) root.rotateY(Math.PI);
}

function endCrossSection(
  root: THREE.Object3D,
  z: number,
  halfBand: number
): number {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let count = 0;

  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry?.attributes?.position) return;
    const pos = mesh.geometry.attributes.position;
    const step = Math.max(1, Math.floor(pos.count / 6000));
    for (let i = 0; i < pos.count; i += step) {
      _v.fromBufferAttribute(pos, i);
      mesh.localToWorld(_v);
      if (Math.abs(_v.z - z) <= halfBand) {
        minX = Math.min(minX, _v.x);
        maxX = Math.max(maxX, _v.x);
        minY = Math.min(minY, _v.y);
        maxY = Math.max(maxY, _v.y);
        count++;
      }
    }
  });

  if (count === 0) return 0;
  return (maxX - minX) * (maxY - minY);
}

function prepareShipScene(scene: THREE.Object3D): {
  root: THREE.Object3D;
  layout: ShipLayout;
} {
  const root = scene.clone(true);

  alignLongestAxisToZ(root);
  ensureNoseAtPositiveZ(root);

  root.traverse((child) => {
    if (!(child as THREE.Mesh).isMesh) return;
    const mesh = child as THREE.Mesh;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      if (mat) mat.side = THREE.FrontSide;
    }
  });

  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  const center = box.getCenter(new THREE.Vector3());
  root.position.sub(center);

  root.updateMatrixWorld(true);
  const sized = new THREE.Box3().setFromObject(root);
  const size = sized.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  root.scale.setScalar(TARGET_LENGTH / maxDim);

  root.updateMatrixWorld(true);
  const finalBox = new THREE.Box3().setFromObject(root);
  const finalSize = finalBox.getSize(new THREE.Vector3());

  return {
    root,
    layout: {
      engineZ: finalBox.min.z - 0.04,
      engineY: finalBox.min.y + finalSize.y * 0.22,
      engineSpread: Math.min(finalSize.x * 0.22, 0.28),
      pickRadius: Math.max(finalSize.x, finalSize.y) * 0.52 + 0.15,
      labelY: finalBox.max.y + 0.12,
    },
  };
}

useGLTF.preload(MODEL_URL);

export function ShipModel({
  onLayout,
}: {
  onLayout?: (layout: ShipLayout) => void;
}) {
  const { scene } = useGLTF(MODEL_URL);

  const { root, layout } = useMemo(() => prepareShipScene(scene), [scene]);

  useEffect(() => {
    onLayout?.(layout);
  }, [layout, onLayout]);

  return <primitive object={root} />;
}
