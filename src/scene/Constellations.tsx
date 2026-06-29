import { useEffect, useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Orbit } from "./Orbit";
import { ZODIAC, ELEMENT_COLOR, type ZodiacSign } from "../data/zodiac";
import { useStore } from "../store/useStore";

const RADIUS = 700;
const SCALE = 58;
const STAR_BASE = 11;

function makeStarTexture(): THREE.Texture {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.9)");
  g.addColorStop(0.5, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

interface ConProps {
  sign: ZodiacSign;
  starTex: THREE.Texture;
  active: boolean;
  dim: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
}

function Constellation({ sign, starTex, active, dim, onSelect, onHover }: ConProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const color = ELEMENT_COLOR[sign.element];

  const a = (sign.longitude * Math.PI) / 180;
  const pos: [number, number, number] = [
    Math.cos(a) * RADIUS,
    0,
    Math.sin(a) * RADIUS,
  ];

  // Orient the constellation plane to face the solar system center.
  useEffect(() => {
    groupRef.current.lookAt(0, 0, 0);
  }, []);

  const lineGeom = useMemo(() => {
    const verts: number[] = [];
    for (const [i, j] of sign.lines) {
      const p = sign.stars[i];
      const q = sign.stars[j];
      verts.push(p[0] * SCALE, p[1] * SCALE, 0, q[0] * SCALE, q[1] * SCALE, 0);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(verts, 3)
    );
    return g;
  }, [sign]);

  // Bounds for the pick plane and the label position.
  const bounds = useMemo(() => {
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;
    for (const [x, y] of sign.stars) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    const pad = 0.35;
    return {
      cx: ((minX + maxX) / 2) * SCALE,
      cy: ((minY + maxY) / 2) * SCALE,
      w: (maxX - minX + pad * 2) * SCALE,
      h: (maxY - minY + pad * 2) * SCALE,
      top: (maxY + pad) * SCALE,
    };
  }, [sign]);

  const lineOpacity = active ? 1 : dim ? 0.14 : 0.5;
  const starOpacity = active ? 1 : dim ? 0.4 : 0.92;
  const starScale = active ? 1.35 : 1;
  const labelClass = `zodiac-label ${active ? "active" : ""} ${
    dim ? "dim" : ""
  }`;

  return (
    <group ref={groupRef} position={pos}>
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={lineOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {sign.stars.map((p, idx) => {
        const mag = sign.mags?.[idx] ?? 1;
        const size = STAR_BASE * mag * starScale;
        return (
          <sprite
            key={idx}
            position={[p[0] * SCALE, p[1] * SCALE, 0]}
            scale={[size, size, size]}
          >
            <spriteMaterial
              map={starTex}
              color={color}
              transparent
              opacity={starOpacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        );
      })}

      {/* Invisible pick target */}
      <mesh
        position={[bounds.cx, bounds.cy, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(sign.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(sign.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = "auto";
        }}
      >
        <planeGeometry args={[bounds.w, bounds.h]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Html
        position={[bounds.cx, bounds.top + 10, 0]}
        center
        distanceFactor={300}
        zIndexRange={[5, 0]}
      >
        <div
          className={labelClass}
          onClick={() => onSelect(sign.id)}
          onPointerEnter={() => onHover(sign.id)}
          onPointerLeave={() => onHover(null)}
        >
          <span className="sym" style={{ color }}>
            {sign.symbol}
          </span>
          <span className="nm">{sign.name}</span>
        </div>
      </Html>
    </group>
  );
}

export function Constellations() {
  const show = useStore((s) => s.showConstellations);
  const selected = useStore((s) => s.selectedConstellation);
  const hovered = useStore((s) => s.hoveredConstellation);
  const selectC = useStore((s) => s.selectConstellation);
  const hoverC = useStore((s) => s.hoverConstellation);
  const starTex = useMemo(makeStarTexture, []);

  if (!show) return null;
  const anyActive = selected ?? hovered;

  return (
    <group>
      <Orbit distance={RADIUS} color="#aab8ff" opacity={0.1} />
      {ZODIAC.map((z) => {
        const active = z.id === selected || z.id === hovered;
        return (
          <Constellation
            key={z.id}
            sign={z}
            starTex={starTex}
            active={active}
            dim={!!anyActive && !active}
            onSelect={selectC}
            onHover={hoverC}
          />
        );
      })}
    </group>
  );
}
