import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useStore } from "../store/useStore";

interface Props {
  inner: number;
  outer: number;
  count?: number;
  color?: string;
  thickness?: number;
}

export function AsteroidBelt({
  inner,
  outer,
  count = 1400,
  color = "#8a7d6b",
  thickness = 1.6,
}: Props) {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const timeScale = useStore((s) => s.timeScale);
  const paused = useStore((s) => s.paused);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const instances = useMemo(() => {
    const arr: { r: number; a: number; y: number; s: number; rot: number }[] =
      [];
    for (let i = 0; i < count; i++) {
      arr.push({
        r: inner + Math.random() * (outer - inner),
        a: Math.random() * Math.PI * 2,
        y: (Math.random() - 0.5) * thickness,
        s: 0.04 + Math.random() * 0.12,
        rot: Math.random() * Math.PI,
      });
    }
    return arr;
  }, [inner, outer, count, thickness]);

  useEffect(() => {
    instances.forEach((it, i) => {
      dummy.position.set(Math.cos(it.a) * it.r, it.y, Math.sin(it.a) * it.r);
      dummy.rotation.set(it.rot, it.rot * 1.7, 0);
      dummy.scale.setScalar(it.s);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  }, [instances, dummy]);

  useFrame((_, dt) => {
    if (!paused) groupRef.current.rotation.y += dt * 0.02 * timeScale;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={ref} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} roughness={1} metalness={0.1} />
      </instancedMesh>
    </group>
  );
}
