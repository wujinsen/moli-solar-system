import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { BodyLabel } from "./BodyLabel";
import * as THREE from "three";
import type { BlackHole as BlackHoleData } from "../data/blackholes";
import { useStore } from "../store/useStore";
import { registerBody, unregisterBody } from "./registry";

const DISK_VERT = /* glsl */ `
  varying vec2 vP;
  void main() {
    vP = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const DISK_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vP;
  uniform float uTime;
  uniform float uInner;
  uniform float uOuter;
  uniform vec3  uHot;
  uniform vec3  uCool;
  uniform float uSpin;
  uniform float uDoppler;
  uniform float uBrightness;
  uniform float uOpacity;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  // seamless (periodic in angle) fractal noise sampled on a ring
  float ringNoise(float ang, float r, float tOff){
    vec2 p = vec2(cos(ang), sin(ang));
    float n = 0.0, amp = 0.55;
    for (int i = 0; i < 3; i++){
      n += amp * noise(p * (3.0 + float(i) * 4.0) + vec2(r, tOff));
      amp *= 0.5;
    }
    return n;
  }

  void main() {
    float r = length(vP);
    float ang = atan(vP.y, vP.x);
    float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);

    // smooth temperature gradient: hot inner -> cool outer
    vec3 col = mix(uHot, uCool, pow(t, 0.5));

    // radial profile: a very bright, thin inner rim (ISCO) that falls off smoothly
    float inner = smoothstep(0.0, 0.05, t);
    float outer = 1.0 - smoothstep(0.72, 1.0, t);
    float rim   = exp(-t * 3.4);
    float base  = rim * 1.15 + 0.28;

    // Keplerian shear: inner gas orbits faster than outer (smooth flow, no petals)
    float shear = uTime * uSpin * (0.5 + 1.3 / (r * 0.04 + 0.6));
    float streak = 0.88 + 0.12 * sin(ang * 16.0 - shear);
    float gas = ringNoise(ang, r * 0.35 - shear * 0.15, uTime * uSpin * 0.2);
    streak *= 0.82 + 0.34 * gas;

    float intensity = base * streak * inner * outer;

    // relativistic doppler beaming: approaching side brighter & bluer (smooth)
    float dopp = cos(ang);
    intensity *= 1.0 + uDoppler * dopp * 0.95;
    col = mix(col, col * vec3(0.72, 0.86, 1.32), clamp(uDoppler * dopp, 0.0, 1.0) * 0.7);
    col = mix(col, col * vec3(1.32, 0.7, 0.5), clamp(-uDoppler * dopp, 0.0, 1.0) * 0.7);

    float alpha = clamp(intensity, 0.0, 2.5) * uOpacity;
    gl_FragColor = vec4(col * intensity * uBrightness, alpha);
  }
`;

function makeDiskMaterial(v: BlackHoleData["visual"]) {
  return new THREE.ShaderMaterial({
    vertexShader: DISK_VERT,
    fragmentShader: DISK_FRAG,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uInner: { value: v.diskInner },
      uOuter: { value: v.diskOuter },
      uHot: { value: new THREE.Color(v.colorHot) },
      uCool: { value: new THREE.Color(v.colorCool) },
      uSpin: { value: v.spin },
      uDoppler: { value: v.doppler },
      uBrightness: { value: v.brightness },
      uOpacity: { value: 1 },
    },
  });
}

/** The lensed photon ring: a crisp thin Einstein ring + a soft glow, camera-facing. */
function PhotonRing({ radius, color }: { radius: number; color: string }) {
  const ref = useRef<THREE.Group>(null!);
  const { camera } = useThree();
  useFrame(() => {
    if (ref.current) ref.current.quaternion.copy(camera.quaternion);
  });
  return (
    <group ref={ref}>
      {/* soft outer glow */}
      <mesh>
        <ringGeometry args={[radius * 1.0, radius * 1.28, 128]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      {/* crisp Einstein ring hugging the shadow */}
      <mesh>
        <ringGeometry args={[radius * 1.0, radius * 1.07, 160]} />
        <meshBasicMaterial
          color="#fff3da"
          transparent
          opacity={1}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Jets({ v }: { v: BlackHoleData["visual"] }) {
  const ref = useRef<THREE.Group>(null!);

  const { outerMat, coreMat, outerGeo, coreGeo } = useMemo(() => {
    const mk = (color: string) =>
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      });
    return {
      outerMat: mk(v.jetColor),
      coreMat: mk("#ffffff"),
      outerGeo: new THREE.ConeGeometry(v.horizonRadius * 0.7, v.jetLength, 28, 1, true),
      coreGeo: new THREE.ConeGeometry(v.horizonRadius * 0.22, v.jetLength * 0.95, 20, 1, true),
    };
  }, [v]);

  useEffect(() => {
    return () => {
      outerMat.dispose();
      coreMat.dispose();
      outerGeo.dispose();
      coreGeo.dispose();
    };
  }, [outerMat, coreMat, outerGeo, coreGeo]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const flick = 0.6 + Math.sin(t * 8.0) * 0.12 + Math.sin(t * 3.3) * 0.08;
    outerMat.opacity = 0.18 * flick;
    coreMat.opacity = 0.26 * flick;
    if (ref.current) ref.current.rotation.y += 0.004;
  });

  const halfLen = v.jetLength / 2;
  return (
    <group ref={ref}>
      {[1, -1].map((s) => (
        <group key={s} position={[0, 0, s * halfLen]} rotation={[s < 0 ? 0 : Math.PI, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} geometry={outerGeo} material={outerMat} />
          <mesh rotation={[Math.PI / 2, 0, 0]} geometry={coreGeo} material={coreMat} />
        </group>
      ))}
    </group>
  );
}

export function BlackHole({ data }: { data: BlackHoleData }) {
  const v = data.visual;
  const groupRef = useRef<THREE.Group>(null!);
  const anchorRef = useRef<THREE.Group>(null!);
  const hoveredId = useStore((s) => s.hoveredId);
  const selectedId = useStore((s) => s.selectedId);
  const paused = useStore((s) => s.paused);
  const timeScale = useStore((s) => s.timeScale);

  const diskMat = useMemo(() => makeDiskMaterial(v), [v]);
  const haloMat = useMemo(() => {
    const m = makeDiskMaterial(v);
    m.uniforms.uOpacity.value = 0.7;
    return m;
  }, [v]);

  const ringGeo = useMemo(
    () => new THREE.RingGeometry(v.diskInner, v.diskOuter, 220, 1),
    [v.diskInner, v.diskOuter]
  );

  // Inclination: 0 = face-on donut, 1 = edge-on Interstellar look.
  const tilt = -v.inclination * (Math.PI / 2);

  useEffect(() => {
    registerBody(data.id, anchorRef.current);
    return () => {
      unregisterBody(data.id);
      diskMat.dispose();
      haloMat.dispose();
      ringGeo.dispose();
    };
  }, [data.id, diskMat, haloMat, ringGeo]);

  useFrame((state, dt) => {
    const step = paused ? 0 : dt * Math.max(timeScale, 0.15);
    const tNow = state.clock.elapsedTime;
    diskMat.uniforms.uTime.value = tNow;
    haloMat.uniforms.uTime.value = tNow;
    if (groupRef.current && step > 0) {
      groupRef.current.rotation.z += step * 0.04;
    }
  });

  const active = hoveredId === data.id || selectedId === data.id;

  return (
    <group>
      <ambientLight intensity={0.05} />

      <group ref={anchorRef}>
        {/* Event horizon — opaque so it occludes the far side of the disk/halo */}
        <mesh>
          <sphereGeometry args={[v.horizonRadius, 48, 48]} />
          <meshBasicMaterial color="#000000" toneMapped={false} />
        </mesh>

        <PhotonRing radius={v.horizonRadius} color={v.colorHot} />

        <group ref={groupRef} rotation={[tilt, 0, 0]}>
          {/* Equatorial accretion disk */}
          <mesh geometry={ringGeo} material={diskMat} />
          {/* Lensed perpendicular image — the over-the-top arc */}
          {v.halo && (
            <mesh
              geometry={ringGeo}
              material={haloMat}
              rotation={[Math.PI / 2, 0, 0]}
            />
          )}
          {v.jet && <Jets v={v} />}
        </group>

        {/* Pick target + hover label */}
        <mesh
          visible={false}
          onClick={(e) => {
            e.stopPropagation();
            useStore.getState().clickBody(data.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            useStore.getState().hover(data.id);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            useStore.getState().hover(null);
            document.body.style.cursor = "auto";
          }}
        >
          <sphereGeometry args={[v.horizonRadius * 1.4, 16, 16]} />
        </mesh>

        {active && (
          <Html center distanceFactor={60} position={[0, v.diskOuter * 0.62, 0]}>
            <BodyLabel id={data.id} />
          </Html>
        )}
      </group>
    </group>
  );
}
