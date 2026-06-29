import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  radius: number;
  count?: number;
}

interface Loop {
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  major: number;
  tube: number;
  arc: number;
  material: THREE.ShaderMaterial;
  baseOpacity: number;
  phase: number;
  speed: number;
}

const LOOP_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// A glowing plasma strand instead of a solid ring: bright down the tube
// centerline, feathered at the edges, and fading softly at the two feet so the
// loop looks like it rises out of the surface following a magnetic field line.
const LOOP_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float cross = 1.0 - abs(vUv.y - 0.5) * 2.0;
    cross = pow(max(cross, 0.0), 1.6);
    float feet = smoothstep(0.0, 0.16, vUv.x) * smoothstep(1.0, 0.84, vUv.x);
    float a = uOpacity * cross * (0.3 + 0.7 * feet);
    vec3 col = mix(uColor, vec3(1.0, 0.95, 0.8), cross * 0.45);
    gl_FragColor = vec4(col, a);
  }
`;

// Plasma loops / prominences arching off the surface along magnetic field
// lines: thin glowing strands, brightest at the limb against dark space.
export function Prominences({ radius, count = 30 }: Props) {
  const groupRef = useRef<THREE.Group>(null!);

  const loops = useMemo<Loop[]>(() => {
    const arr: Loop[] = [];
    const yAxis = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < count; i++) {
      const dir = new THREE.Vector3().randomDirection().normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(yAxis, dir);
      const roll = new THREE.Quaternion().setFromAxisAngle(
        dir,
        Math.random() * Math.PI * 2
      );
      q.premultiply(roll);

      const big = Math.random() < 0.3;
      const major = big
        ? radius * (0.22 + Math.random() * 0.22)
        : radius * (0.07 + Math.random() * 0.1);
      // thin strands look far more like real plasma than fat tubes
      const tube = major * (0.012 + Math.random() * 0.012);
      const baseOpacity = (big ? 0.5 : 0.7) + Math.random() * 0.3;
      const color = new THREE.Color().setHSL(
        0.08 + Math.random() * 0.03,
        1.0,
        0.62
      );
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: color },
          uOpacity: { value: baseOpacity },
        },
        vertexShader: LOOP_VERT,
        fragmentShader: LOOP_FRAG,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      });

      arr.push({
        position: dir.multiplyScalar(radius * 0.97),
        quaternion: q,
        major,
        tube,
        arc: Math.PI * (0.82 + Math.random() * 0.36),
        material,
        baseOpacity,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.8,
      });
    }
    return arr;
  }, [radius, count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (const loop of loops) {
      // gentle plasma shimmer — brightness breathes, no fake "growing" rings
      const flicker = 0.5 + 0.5 * Math.sin(t * loop.speed + loop.phase);
      const slow = 0.5 + 0.5 * Math.sin(t * 0.3 * loop.speed + loop.phase * 1.7);
      loop.material.uniforms.uOpacity.value =
        loop.baseOpacity * (0.35 + 0.55 * flicker) * (0.6 + 0.4 * slow);
    }
  });

  return (
    <group ref={groupRef}>
      {loops.map((loop, i) => (
        <mesh
          key={i}
          position={loop.position}
          quaternion={loop.quaternion}
          material={loop.material}
        >
          <torusGeometry args={[loop.major, loop.tube, 12, 64, loop.arc]} />
        </mesh>
      ))}
    </group>
  );
}
