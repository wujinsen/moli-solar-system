import { useMemo } from "react";
import * as THREE from "three";

interface Props {
  distance: number;
  color?: string;
  opacity?: number;
  inclination?: number;
  eccentricity?: number;
  dashed?: boolean;
}

// A glowing orbital ring drawn as a thin additive line loop.
export function Orbit({
  distance,
  color = "#5d7bd6",
  opacity = 0.35,
  inclination = 0,
  eccentricity = 0,
  dashed = false,
}: Props) {
  const line = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 256;
    const a = distance;
    const b = distance * (1 - eccentricity);
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(t) * a, 0, Math.sin(t) * b));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = dashed
      ? new THREE.LineDashedMaterial({
          color: new THREE.Color(color),
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          dashSize: 1.4,
          gapSize: 1.4,
        })
      : new THREE.LineBasicMaterial({
          color: new THREE.Color(color),
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
    const l = new THREE.Line(geometry, material);
    if (dashed) l.computeLineDistances();
    return l;
  }, [distance, eccentricity, color, opacity, dashed]);

  return (
    <group rotation={[0, 0, (inclination * Math.PI) / 180]}>
      <primitive object={line} />
    </group>
  );
}
