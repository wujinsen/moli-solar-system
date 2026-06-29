import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { ExoPlanet, ExoStar, StarSystem } from "../data/systems";
import { makePlanetTexture, makeGlowTexture } from "../utils/textures";
import { Atmosphere } from "./Atmosphere";
import { Orbit } from "./Orbit";
import { registerBody, unregisterBody } from "./registry";
import { useStore } from "../store/useStore";

const BASE_ORBIT_SPEED = 1.6;
const BASE_ROT_SPEED = 0.4;

function StarMesh({ star }: { star: ExoStar }) {
  const glowTex = useMemo(makeGlowTexture, []);
  const beamsRef = useRef<THREE.Group>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const clickBody = useStore((s) => s.clickBody);
  const hover = useStore((s) => s.hover);
  const paused = useStore((s) => s.paused);
  const timeScale = useStore((s) => s.timeScale);

  useFrame((_, dt) => {
    if (paused) return;
    if (beamsRef.current) beamsRef.current.rotation.y += dt * 6 * timeScale;
    if (coreRef.current) coreRef.current.rotation.y += dt * 0.3 * timeScale;
  });

  const glowSize = star.radius * (star.pulsar ? 7 : 4.2);

  return (
    <group>
      <mesh
        ref={coreRef}
        onClick={(e) => {
          e.stopPropagation();
          clickBody(star.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          hover(star.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          hover(null);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[star.radius, 48, 48]} />
        <meshBasicMaterial color={star.color} toneMapped={false} />
      </mesh>

      <sprite scale={[glowSize, glowSize, glowSize]}>
        <spriteMaterial
          map={glowTex}
          color={star.glowColor}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>

      <pointLight color={star.color} intensity={2.2} distance={400} decay={0} />

      {star.pulsar && (
        <group ref={beamsRef} rotation={[Math.PI * 0.16, 0, 0]}>
          {[1, -1].map((s) => (
            <mesh key={s} position={[0, s * 80, 0]} rotation={[s < 0 ? Math.PI : 0, 0, 0]}>
              <coneGeometry args={[3, 150, 24, 1, true]} />
              <meshBasicMaterial
                color="#bcd8ff"
                transparent
                opacity={0.12}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
}

function HabitableZone({ inner, outer }: { inner: number; outer: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[inner, outer, 96]} />
      <meshBasicMaterial
        color="#3fd98a"
        transparent
        opacity={0.08}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function ExoPlanetMesh({ data }: { data: ExoPlanet }) {
  const orbitRef = useRef<THREE.Group>(null!);
  const anchorRef = useRef<THREE.Group>(null!);
  const planetRef = useRef<THREE.Mesh>(null!);
  const startAngle = useMemo(() => Math.random() * Math.PI * 2, []);
  const timeScale = useStore((s) => s.timeScale);
  const paused = useStore((s) => s.paused);
  const clickBody = useStore((s) => s.clickBody);
  const hover = useStore((s) => s.hover);
  const hoveredId = useStore((s) => s.hoveredId);
  const selectedId = useStore((s) => s.selectedId);

  const tex = useMemo(
    () =>
      makePlanetTexture(
        data.textureStyle,
        data.baseColor,
        data.secondaryColor,
        data.distance
      ),
    [data]
  );

  useEffect(() => {
    registerBody(data.id, anchorRef.current);
    return () => unregisterBody(data.id);
  }, [data.id]);

  useFrame((_, dt) => {
    if (paused) return;
    const orbitSpeed =
      (BASE_ORBIT_SPEED / Math.pow(data.distance, 1.3)) * timeScale;
    orbitRef.current.rotation.y += dt * orbitSpeed;
    planetRef.current.rotation.y += dt * BASE_ROT_SPEED * timeScale;
  });

  const isActive = hoveredId === data.id || selectedId === data.id;

  return (
    <group>
      <Orbit
        distance={data.distance}
        color={data.habitable ? "#5fe0a0" : data.atmosphere?.color ?? data.baseColor}
        opacity={data.candidate ? 0.35 : isActive ? 0.7 : 0.3}
        dashed={data.candidate}
      />
      <group ref={orbitRef} rotation={[0, startAngle, 0]}>
        <group ref={anchorRef} position={[data.distance, 0, 0]}>
          <mesh
            ref={planetRef}
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
            <sphereGeometry args={[data.radius, 48, 48]} />
            <meshStandardMaterial
              map={tex}
              roughness={data.textureStyle === "gas" ? 0.9 : 1}
              metalness={0}
              transparent={data.candidate}
              opacity={data.candidate ? 0.55 : 1}
            />
          </mesh>

          {data.atmosphere && (
            <Atmosphere
              radius={data.radius}
              color={data.atmosphere.color}
              intensity={data.atmosphere.intensity}
            />
          )}

          {isActive && (
            <Html center distanceFactor={10} position={[0, data.radius + 1, 0]}>
              <div className="body-label">
                {data.name}
                {data.habitable && <span className="hz-badge">宜居</span>}
              </div>
            </Html>
          )}
        </group>
      </group>
    </group>
  );
}

export function ExoSystem({ system }: { system: StarSystem }) {
  return (
    <group>
      <ambientLight intensity={0.08} />
      <StarMesh star={system.star} />
      {system.habitableZone && (
        <HabitableZone
          inner={system.habitableZone.inner}
          outer={system.habitableZone.outer}
        />
      )}
      {system.planets.map((p) => (
        <ExoPlanetMesh key={p.id} data={p} />
      ))}
    </group>
  );
}
