import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import { BodyLabel } from "./BodyLabel";
import * as THREE from "three";
import type { MoonData } from "../data/bodies";
import { makePlanetTexture } from "../utils/textures";
import { useStore } from "../store/useStore";
import { registerBody, unregisterBody } from "./registry";

const BASE_MOON_SPEED = 0.6;

export function Moon({ data }: { data: MoonData }) {
  const pivotRef = useRef<THREE.Group>(null!);
  const anchorRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const startAngle = useMemo(() => Math.random() * Math.PI * 2, []);
  const lunar = useTexture("/textures/moon_map.jpg");
  const proc = useMemo(
    () => makePlanetTexture("rocky", data.color, "#4a4038", data.distance * 13),
    [data.color, data.distance]
  );
  const tex = data.id === "moon" ? lunar : proc;
  const timeScale = useStore((s) => s.timeScale);
  const paused = useStore((s) => s.paused);
  const clickBody = useStore((s) => s.clickBody);
  const hover = useStore((s) => s.hover);
  const hoveredId = useStore((s) => s.hoveredId);
  const selectedId = useStore((s) => s.selectedId);

  useEffect(() => {
    registerBody(data.id, anchorRef.current);
    return () => unregisterBody(data.id);
  }, [data.id]);

  useFrame((_, dt) => {
    if (!paused) {
      const sign = data.orbitalPeriod < 0 ? -1 : 1;
      const speed = (BASE_MOON_SPEED / Math.abs(data.orbitalPeriod)) * sign;
      pivotRef.current.rotation.y += dt * speed * timeScale;
      meshRef.current.rotation.y += dt * 0.4 * timeScale;
    }
  });

  const isActive = hoveredId === data.id || selectedId === data.id;

  return (
    <group ref={pivotRef} rotation={[0, startAngle, 0]}>
      <group ref={anchorRef} position={[data.distance, 0, 0]}>
        <mesh
          ref={meshRef}
          castShadow
          onClick={(e) => {
            e.stopPropagation();
            clickBody(data.id);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            hover(data.id);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            hover(null);
            document.body.style.cursor = "auto";
          }}
        >
          <sphereGeometry args={[data.radius, 24, 24]} />
          <meshStandardMaterial map={tex} roughness={1} metalness={0} />
        </mesh>
        {isActive && (
          <Html center distanceFactor={10} position={[0, data.radius + 0.5, 0]}>
            <BodyLabel id={data.id} />
          </Html>
        )}
      </group>
    </group>
  );
}
