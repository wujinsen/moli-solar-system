import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import { BodyLabel } from "./BodyLabel";
import * as THREE from "three";
import type { BodyData } from "../data/bodies";
import { makePlanetTexture } from "../utils/textures";
import { Atmosphere } from "./Atmosphere";
import { PlanetRing } from "./SaturnRing";
import { Moon } from "./Moon";
import { Orbit } from "./Orbit";
import { registerBody, unregisterBody } from "./registry";
import { useStore } from "../store/useStore";

const BASE_ORBIT_SPEED = 0.12;
const BASE_ROT_SPEED = 0.5;

// Build an inverted copy of a grayscale map (used to turn an ocean=white
// specular mask into an ocean=smooth roughness map for sun-glint reflections).
function invertTexture(tex: THREE.Texture): THREE.Texture {
  const img = tex.image as HTMLImageElement | undefined;
  if (!img || !img.width) return tex;
  const c = document.createElement("canvas");
  c.width = img.width;
  c.height = img.height;
  const ctx = c.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  ctx.globalCompositeOperation = "difference";
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, c.width, c.height);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

// Real 8K NASA "Blue Marble" imagery + glossy oceans for a true from-space look.
function EarthMaterial() {
  const [day, normal, spec, night] = useTexture([
    "/textures/earth_day8k.jpg",
    "/textures/earth_normal.jpg",
    "/textures/earth_spec.jpg",
    "/textures/earth_night8k.jpg",
  ]);
  const oceanRoughness = useMemo(() => invertTexture(spec), [spec]);
  useMemo(() => {
    day.colorSpace = THREE.SRGBColorSpace;
    night.colorSpace = THREE.SRGBColorSpace;
    spec.colorSpace = THREE.NoColorSpace;
    for (const t of [day, normal, spec, night]) t.anisotropy = 8;
  }, [day, normal, spec, night]);
  return (
    <meshStandardMaterial
      map={day}
      normalMap={normal}
      normalScale={new THREE.Vector2(0.7, 0.7)}
      roughnessMap={oceanRoughness}
      roughness={0.95}
      metalness={0.1}
      emissiveMap={night}
      emissive={new THREE.Color("#ffcf8f")}
      emissiveIntensity={0.28}
    />
  );
}

function EarthClouds() {
  const clouds = useTexture("/textures/earth_clouds8k.jpg");
  useMemo(() => {
    clouds.anisotropy = 8;
  }, [clouds]);
  return (
    <meshStandardMaterial
      color="#ffffff"
      alphaMap={clouds}
      transparent
      opacity={0.55}
      depthWrite={false}
    />
  );
}

export function Planet({ data }: { data: BodyData }) {
  const orbitRef = useRef<THREE.Group>(null!);
  const anchorRef = useRef<THREE.Group>(null!);
  const planetRef = useRef<THREE.Mesh>(null!);
  const cloudRef = useRef<THREE.Mesh>(null!);

  const startAngle = useMemo(() => Math.random() * Math.PI * 2, []);
  const timeScale = useStore((s) => s.timeScale);
  const paused = useStore((s) => s.paused);
  const showOrbits = useStore((s) => s.showOrbits);
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
  const isEarth = data.id === "earth";

  useEffect(() => {
    registerBody(data.id, anchorRef.current);
    return () => unregisterBody(data.id);
  }, [data.id]);

  useFrame((_, dt) => {
    const sign = data.orbitalPeriod < 0 ? -1 : 1;
    if (!paused) {
      const orbitSpeed =
        (BASE_ORBIT_SPEED / Math.max(0.2, data.orbitalPeriod)) * timeScale;
      orbitRef.current.rotation.y += dt * orbitSpeed;
      const rotSpeed =
        (BASE_ROT_SPEED / Math.max(0.2, Math.abs(data.rotationPeriod))) *
        (data.rotationPeriod < 0 ? -1 : 1) *
        timeScale;
      planetRef.current.rotation.y += dt * rotSpeed;
      if (cloudRef.current) cloudRef.current.rotation.y += dt * rotSpeed * 1.3;
    }
    void sign;
  });

  const isActive = hoveredId === data.id || selectedId === data.id;
  const tilt = (data.axialTilt * Math.PI) / 180;
  const incl = data.inclination ?? 0;

  return (
    <group rotation={[0, 0, (incl * Math.PI) / 180]}>
      {showOrbits && (
        <Orbit
          distance={data.distance}
          color={data.atmosphere?.color ?? data.baseColor}
          opacity={isActive ? 0.7 : 0.28}
          eccentricity={data.eccentricity}
        />
      )}
      <group ref={orbitRef} rotation={[0, startAngle, 0]}>
        <group ref={anchorRef} position={[data.distance, 0, 0]}>
          <group rotation={[0, 0, tilt]}>
            <mesh
              ref={planetRef}
              castShadow
              receiveShadow
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
              <sphereGeometry args={[data.radius, 64, 64]} />
              {isEarth ? (
                <EarthMaterial />
              ) : (
                <meshStandardMaterial
                  map={tex}
                  roughness={data.textureStyle === "gas" ? 0.9 : 1}
                  metalness={0}
                />
              )}
            </mesh>

            {isEarth && (
              <mesh ref={cloudRef} scale={data.radius * 1.02}>
                <sphereGeometry args={[1, 48, 48]} />
                <EarthClouds />
              </mesh>
            )}

            {data.atmosphere && (
              <Atmosphere
                radius={data.radius}
                color={data.atmosphere.color}
                intensity={data.atmosphere.intensity}
              />
            )}

            {data.ring && (
              <PlanetRing
                inner={data.ring.inner}
                outer={data.ring.outer}
                color={data.ring.color}
              />
            )}
          </group>

          {data.moons?.map((m) => (
            <Moon key={m.id} data={m} />
          ))}

          {isActive && (
            <Html center distanceFactor={10} position={[0, data.radius + 1, 0]}>
              <BodyLabel id={data.id} />
            </Html>
          )}
        </group>
      </group>
    </group>
  );
}
