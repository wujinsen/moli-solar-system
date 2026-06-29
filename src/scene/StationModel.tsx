import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

const MODEL_URL = "/models/space-station.glb";
const TARGET_SIZE = 0.58;

export type StationLayout = {
  pickRadius: number;
  labelY: number;
  ringRadius: number;
};

function prepareStationScene(scene: THREE.Object3D): {
  root: THREE.Object3D;
  layout: StationLayout;
  pulseMats: THREE.MeshStandardMaterial[];
} {
  const root = scene.clone(true);
  const pulseMats: THREE.MeshStandardMaterial[] = [];

  root.traverse((child) => {
    if (!(child as THREE.Mesh).isMesh) return;
    const mesh = child as THREE.Mesh;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const mat of mats) {
      if (!(mat instanceof THREE.MeshStandardMaterial)) continue;
      mat.side = THREE.FrontSide;
      mat.emissive = mat.emissive?.clone() ?? new THREE.Color("#0a1828");
      if (mat.emissive.getHex() === 0x000000) mat.emissive.set("#142838");
      mat.emissiveIntensity = Math.max(mat.emissiveIntensity, 0.35);
      pulseMats.push(mat);
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
  root.scale.setScalar(TARGET_SIZE / maxDim);

  root.updateMatrixWorld(true);
  const finalBox = new THREE.Box3().setFromObject(root);
  const finalSize = finalBox.getSize(new THREE.Vector3());

  return {
    root,
    pulseMats,
    layout: {
      pickRadius: Math.max(finalSize.x, finalSize.y, finalSize.z) * 0.55 + 0.12,
      labelY: finalBox.max.y + 0.14,
      ringRadius: Math.max(finalSize.x, finalSize.z) * 0.62 + 0.06,
    },
  };
}

useGLTF.preload(MODEL_URL);

export function StationModel({
  onReady,
}: {
  onReady?: (data: {
    layout: StationLayout;
    pulseMats: THREE.MeshStandardMaterial[];
  }) => void;
}) {
  const { scene } = useGLTF(MODEL_URL);

  const prepared = useMemo(() => prepareStationScene(scene), [scene]);

  useEffect(() => {
    onReady?.({
      layout: prepared.layout,
      pulseMats: prepared.pulseMats,
    });
  }, [prepared, onReady]);

  return <primitive object={prepared.root} />;
}
