import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { BodyLabel } from "./BodyLabel";
import * as THREE from "three";
import type { CometData } from "../data/comets";
import { useStore } from "../store/useStore";
import { registerBody, unregisterBody } from "./registry";

const BASE_ORBIT_SPEED = 0.12;

interface Props {
  data: CometData;
}

// Soft radial glow for the coma / core.
function makeGlowTexture(): THREE.Texture {
  const s = 128;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.2, "rgba(255,255,255,0.85)");
  g.addColorStop(0.45, "rgba(255,255,255,0.35)");
  g.addColorStop(0.75, "rgba(255,255,255,0.08)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Comet tail gradient: brightest at the head (v=0), fading out along the
// length, and a gaussian width that is narrow near the head and spreads out
// toward the far end — the classic comet-tail silhouette, all soft edges.
function makeTailTexture(): THREE.Texture {
  const W = 128;
  const H = 512;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(W, H);
  for (let y = 0; y < H; y++) {
    const v = y / (H - 1); // 0 = head (near nucleus), 1 = far end
    const lengthFalloff = Math.pow(1 - v, 1.5);
    const sigma = 0.05 + 0.26 * v; // widen toward the tail end
    for (let x = 0; x < W; x++) {
      const u = x / (W - 1) - 0.5;
      const widthFactor = Math.exp(-(u * u) / (2 * sigma * sigma));
      const a = lengthFalloff * widthFactor;
      const i = (y * W + x) * 4;
      img.data[i] = 255;
      img.data[i + 1] = 255;
      img.data[i + 2] = 255;
      img.data[i + 3] = Math.round(Math.min(1, a) * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Halley's Comet on a real inclined retrograde ellipse; tail always points
// away from the Sun and lengthens near perihelion.
export function Comet({ data }: Props) {
  const anchorRef = useRef<THREE.Group>(null!);
  const tailRef = useRef<THREE.Group>(null!);
  const angleRef = useRef(Math.PI * 0.35);
  const timeScale = useStore((s) => s.timeScale);
  const paused = useStore((s) => s.paused);
  const clickBody = useStore((s) => s.clickBody);
  const hover = useStore((s) => s.hover);
  const hoveredId = useStore((s) => s.hoveredId);
  const selectedId = useStore((s) => s.selectedId);

  const glowTex = useMemo(makeGlowTexture, []);
  const tailTex = useMemo(makeTailTexture, []);
  const color = useMemo(() => new THREE.Color(data.color), [data.color]);

  const { a, b, f, orbitQuat, speed } = useMemo(() => {
    const a = data.semiMajor;
    const b = data.semiMinor;
    const f = Math.sqrt(Math.max(0, a * a - b * b));
    const incl = (data.inclination * Math.PI) / 180;
    const lan = ((data.ascendingNode ?? 0) * Math.PI) / 180;
    const inclQuat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(incl, 0, 0)
    );
    const lanQuat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, lan, 0)
    );
    const orbitQuat = lanQuat.multiply(inclQuat);
    const speed = BASE_ORBIT_SPEED / data.orbitalPeriod;
    return { a, b, f, orbitQuat, speed };
  }, [data]);

  const orbitLine = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const tmp = new THREE.Vector3();
    for (let i = 0; i <= 256; i++) {
      const t = (i / 256) * Math.PI * 2;
      tmp.set(Math.cos(t) * a - f, 0, Math.sin(t) * b);
      tmp.applyQuaternion(orbitQuat);
      points.push(tmp.clone());
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return new THREE.Line(geometry, material);
  }, [a, b, f, orbitQuat, color]);

  useEffect(() => {
    registerBody(data.id, anchorRef.current);
    return () => unregisterBody(data.id);
  }, [data.id]);

  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);

  useFrame((_, dt) => {
    if (!paused) angleRef.current += dt * speed * timeScale;
    const t = angleRef.current;
    pos.set(Math.cos(t) * a - f, 0, Math.sin(t) * b);
    pos.applyQuaternion(orbitQuat);
    anchorRef.current.position.copy(pos);

    // Orient the tail so its local +Y points away from the Sun (origin).
    dir.copy(pos).normalize();
    quat.setFromUnitVectors(up, dir);
    tailRef.current.quaternion.copy(quat);

    // Longer, slimmer tail near perihelion; shorter when far away.
    const dist = pos.length();
    const length = THREE.MathUtils.clamp(760 / dist + 8, 13, 44);
    const width = Math.max(4.5, length * 0.16);
    tailRef.current.scale.set(width, length, width);
  });

  const isActive = hoveredId === data.id || selectedId === data.id;
  const r = data.nucleusRadius;
  const comaSize = r * 7;

  return (
    <>
      <primitive object={orbitLine} />
      <group ref={anchorRef}>
        {/* Tail: two crossed soft gradient planes pointing away from the Sun */}
        <group ref={tailRef}>
          {[0, Math.PI / 2].map((rot) => (
            <mesh key={rot} rotation={[0, rot, 0]} position={[0, 0.5, 0]}>
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                map={tailTex}
                color={color}
                transparent
                opacity={0.55}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>

        {/* Coma: soft glowing halo around the nucleus */}
        <sprite scale={[comaSize, comaSize, comaSize]}>
          <spriteMaterial
            map={glowTex}
            color={color}
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>

        {/* Bright nucleus core */}
        <mesh>
          <sphereGeometry args={[r, 16, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>

        {/* Invisible, easier-to-hit pick target */}
        <mesh
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
          <sphereGeometry args={[comaSize * 0.5, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {isActive && (
          <Html center distanceFactor={12} position={[0, comaSize * 0.5 + 1, 0]}>
            <BodyLabel id={data.id} />
          </Html>
        )}
      </group>
    </>
  );
}
