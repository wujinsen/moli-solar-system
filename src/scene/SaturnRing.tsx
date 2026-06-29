import { useMemo } from "react";
import * as THREE from "three";
import { makeRingTexture } from "../utils/textures";

interface Props {
  inner: number;
  outer: number;
  color: string;
}

export function PlanetRing({ inner, outer, color }: Props) {
  const tex = useMemo(() => makeRingTexture(color), [color]);

  const geometry = useMemo(() => {
    const geo = new THREE.RingGeometry(inner, outer, 128, 1);
    // Remap UVs so the ring texture runs radially (inner -> outer = u 0 -> 1).
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      const r = v3.length();
      const u = (r - inner) / (outer - inner);
      uv.setXY(i, u, 0.5);
    }
    uv.needsUpdate = true;
    return geo;
  }, [inner, outer]);

  return (
    <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial
        map={tex}
        side={THREE.DoubleSide}
        transparent
        roughness={1}
        metalness={0}
        depthWrite={false}
      />
    </mesh>
  );
}
