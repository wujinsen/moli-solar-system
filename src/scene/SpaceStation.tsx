import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Sparkles } from "@react-three/drei";
import { StationLabel } from "./BodyLabel";
import * as THREE from "three";
import { useStore } from "../store/useStore";
import { getBodyRadius } from "../data/bodies";
import { SPACE_STATION } from "../data/station";
import { makeThrusterTexture } from "../utils/textures";
import { getBodyObject, registerBody, unregisterBody } from "./registry";
import { StationModel, type StationLayout } from "./StationModel";

const ORBIT_R_OFFSET = 0.62;
const ORBIT_SPEED = 1.65;
const SPIN_SPEED = 0.22;
const ORBIT_INCL = 0.38;

const DEFAULT_LAYOUT: StationLayout = {
  pickRadius: 0.55,
  labelY: 0.42,
  ringRadius: 0.38,
};

export function SpaceStation() {
  const pivotRef = useRef<THREE.Group>(null!);
  const anchorRef = useRef<THREE.Group>(null!);
  const modelRef = useRef<THREE.Group>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const haloRef = useRef<THREE.Sprite>(null!);
  const coreLightRef = useRef<THREE.PointLight>(null!);
  const dockLightRef = useRef<THREE.PointLight>(null!);

  const orbitAngle = useRef(0.9);
  const pulseMats = useRef<THREE.MeshStandardMaterial[]>([]);
  const hostPos = useRef(new THREE.Vector3());
  const tangent = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  const [layout, setLayout] = useState(DEFAULT_LAYOUT);
  const onStationReady = useCallback(
    (data: {
      layout: StationLayout;
      pulseMats: THREE.MeshStandardMaterial[];
    }) => {
      setLayout(data.layout);
      pulseMats.current = data.pulseMats;
    },
    []
  );

  const hoveredId = useStore((s) => s.hoveredId);
  const selectedId = useStore((s) => s.selectedId);
  const paused = useStore((s) => s.paused);
  const timeScale = useStore((s) => s.timeScale);

  const haloTex = useMemo(makeThrusterTexture, []);
  const ringColor = useMemo(() => new THREE.Color("#5fe8ff"), []);
  const active = hoveredId === "station" || selectedId === "station";

  useEffect(() => {
    registerBody("station", anchorRef.current);
    return () => unregisterBody("station");
  }, []);

  useFrame((state, dt) => {
    const host = getBodyObject(SPACE_STATION.parentId);
    if (!host || !pivotRef.current || !anchorRef.current) return;

    host.getWorldPosition(hostPos.current);
    pivotRef.current.position.copy(hostPos.current);

    const orbitR = getBodyRadius(SPACE_STATION.parentId) + ORBIT_R_OFFSET;

    const step = Math.min(dt, 0.05);
    if (!paused) {
      orbitAngle.current += step * ORBIT_SPEED * Math.max(timeScale, 0.15);
    }

    const a = orbitAngle.current;
    const yOff = Math.sin(a * 0.85) * ORBIT_INCL * 0.35 + 0.06;
    anchorRef.current.position.set(
      Math.cos(a) * orbitR,
      yOff,
      -Math.sin(a) * orbitR
    );

    tangent.current.set(-Math.sin(a), 0, -Math.cos(a)).normalize();
    if (modelRef.current) {
      lookTarget.current
        .copy(anchorRef.current.position)
        .add(tangent.current);
      modelRef.current.lookAt(lookTarget.current);
      if (!paused) {
        modelRef.current.rotateY(step * SPIN_SPEED * Math.max(timeScale, 0.15));
      }
    }

    const t = state.clock.elapsedTime;
    const pulse = 0.55 + Math.sin(t * 2.4) * 0.18 + Math.sin(t * 5.1) * 0.08;
    const flicker = 0.92 + Math.sin(t * 11.3) * 0.05;

    for (const mat of pulseMats.current) {
      mat.emissiveIntensity = pulse * flicker;
    }

    if (ringRef.current) {
      ringRef.current.rotation.y += step * 0.85;
      ringRef.current.rotation.z += step * 0.35;
      const mat = ringRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.9 + Math.sin(t * 3.2) * 0.35;
      mat.opacity = 0.42 + Math.sin(t * 2.1) * 0.12;
    }

    if (haloRef.current) {
      const s = 0.95 + Math.sin(t * 1.8) * 0.12;
      haloRef.current.scale.set(s * layout.ringRadius * 1.6, s * layout.ringRadius * 1.6, 1);
      (haloRef.current.material as THREE.SpriteMaterial).opacity =
        0.28 + Math.sin(t * 2.6) * 0.1;
    }

    if (coreLightRef.current) {
      coreLightRef.current.intensity = 1.1 + Math.sin(t * 2.8) * 0.45;
    }
    if (dockLightRef.current) {
      dockLightRef.current.intensity = 0.65 + Math.sin(t * 4.2 + 1.2) * 0.3;
    }
  });

  return (
    <group ref={pivotRef}>
      <group ref={anchorRef}>
        <group ref={modelRef}>
          <StationModel onReady={onStationReady} />
        </group>

        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[layout.ringRadius, 0.012, 12, 64]} />
          <meshStandardMaterial
            color={ringColor}
            emissive={ringColor}
            emissiveIntensity={1.1}
            transparent
            opacity={0.5}
            toneMapped={false}
          />
        </mesh>

        <sprite ref={haloRef} scale={[layout.ringRadius * 1.6, layout.ringRadius * 1.6, 1]}>
          <spriteMaterial
            map={haloTex}
            color="#6ee7ff"
            transparent
            opacity={0.32}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>

        <Sparkles
          count={36}
          scale={layout.pickRadius * 1.35}
          size={1.4}
          speed={0.35}
          opacity={0.55}
          color="#88eeff"
        />

        <pointLight
          ref={coreLightRef}
          color="#8fe8ff"
          intensity={1.1}
          distance={5}
          decay={2}
        />
        <pointLight
          ref={dockLightRef}
          position={[0, -0.08, 0.12]}
          color="#ffd080"
          intensity={0.7}
          distance={3.5}
          decay={2}
        />

        <mesh
          visible={false}
          onClick={(e) => {
            e.stopPropagation();
            useStore.getState().clickBody("station");
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            useStore.getState().hover("station");
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            useStore.getState().hover(null);
            document.body.style.cursor = "auto";
          }}
        >
          <sphereGeometry args={[layout.pickRadius, 12, 12]} />
        </mesh>

        {active && (
          <Html center distanceFactor={8} position={[0, layout.labelY, 0]}>
            <StationLabel />
          </Html>
        )}
      </group>
    </group>
  );
}
