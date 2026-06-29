import { useMemo } from "react";
import * as THREE from "three";

interface Props {
  radius: number;
  color: string;
  intensity?: number;
  power?: number;
}

// Thin Fresnel atmosphere shell. A slightly larger back-side sphere with
// additive blending glows only at the limb, and the glow is modulated by the
// Sun direction (at the origin) so the day side limb glows while the night
// side fades out — like a real planet's atmosphere seen from space.
export function Atmosphere({
  radius,
  color,
  intensity = 1,
  power = 4.5,
}: Props) {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(color) },
        uIntensity: { value: intensity },
        uPower: { value: power },
        uSunPos: { value: new THREE.Vector3(0, 0, 0) },
      },
      vertexShader: /* glsl */ `
        varying vec3 vNormalV;
        varying vec3 vViewDir;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vNormalV = normalize(normalMatrix * normal);
          vViewDir = normalize(-mvPosition.xyz);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uIntensity;
        uniform float uPower;
        uniform vec3 uSunPos;
        varying vec3 vNormalV;
        varying vec3 vViewDir;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPos;
        void main() {
          float rim = 1.0 - max(dot(vNormalV, vViewDir), 0.0);
          float glow = pow(rim, uPower);

          vec3 sunDir = normalize(uSunPos - vWorldPos);
          float day = dot(vWorldNormal, sunDir);
          float dayFactor = smoothstep(-0.25, 0.35, day);

          float a = glow * uIntensity * (0.12 + 0.88 * dayFactor);
          gl_FragColor = vec4(uColor * a, a);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
  }, [color, intensity, power]);

  return (
    <mesh scale={radius * 1.05} material={material}>
      <sphereGeometry args={[1, 64, 64]} />
    </mesh>
  );
}
