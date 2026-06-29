import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { EXO_SYSTEMS } from "../data/systems";
import { makeGlowTexture } from "../utils/textures";
import { useStore } from "../store/useStore";

// Direction (will be normalized) + color for each distant system beacon, so
// they sit in distinct corners of the solar sky, off the ecliptic plane.
const LAYOUT: Record<string, { dir: [number, number, number]; color: string }> = {
  trappist1: { dir: [-0.7, 0.4, -0.6], color: "#ff6a3d" },
  hr8799: { dir: [0.85, 0.3, -0.45], color: "#cfe0ff" },
  hd10180: { dir: [0.55, -0.32, 0.78], color: "#ffe2a0" },
  kepler90: { dir: [-0.8, 0.18, 0.58], color: "#ffd98a" },
  psr1257: { dir: [0.12, 0.62, 0.78], color: "#bcd8ff" },
};

// Map real light-years to a scene radius on a log scale so nearby systems
// (TRAPPIST-1, 40 ly) sit closer and far ones (Kepler-90, 2540 ly) sit deep
// in the sky, while everything stays within the camera's reach (maxDistance 420).
function radiusForLy(ly: number): number {
  return 150 + 78 * Math.log10(ly); // 40ly→275, 129ly→315, 2540ly→415
}

function Beacon({
  id,
  name,
  distanceLy,
  distanceLyNum,
}: {
  id: string;
  name: string;
  distanceLy: string;
  distanceLyNum: number;
}) {
  const cfg = LAYOUT[id];
  const glowTex = useMemo(makeGlowTexture, []);
  const groupRef = useRef<THREE.Group>(null!);
  const selectSystem = useStore((s) => s.selectSystem);
  const hoveredId = useStore((s) => s.hoveredId);
  const hover = useStore((s) => s.hover);
  const hovered = hoveredId === `beacon-${id}`;

  const pos = useMemo(() => {
    const v = new THREE.Vector3(...cfg.dir)
      .normalize()
      .multiplyScalar(radiusForLy(distanceLyNum));
    return v;
  }, [cfg.dir, distanceLyNum]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 2 + pos.x) * 0.12;
    const s = (hovered ? 26 : 20) * pulse;
    groupRef.current.scale.setScalar(s);
  });

  return (
    <group position={pos}>
      <group ref={groupRef}>
        <sprite>
          <spriteMaterial
            map={glowTex}
            color={cfg.color}
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </sprite>
      </group>

      {/* Generous invisible pick target */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          selectSystem(id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          hover(`beacon-${id}`);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          hover(null);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[14, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Html center distanceFactor={260} position={[0, 24, 0]}>
        <div
          className={`beacon-label ${hovered ? "hot" : ""}`}
          onClick={() => selectSystem(id)}
          onPointerOver={() => hover(`beacon-${id}`)}
          onPointerOut={() => hover(null)}
        >
          <span className="bn" style={{ color: cfg.color }}>
            {name}
          </span>
          <span className="bd">{distanceLy}</span>
          <span className="bgo">▷ 查看详情</span>
        </div>
      </Html>
    </group>
  );
}

export function SystemBeacons() {
  return (
    <group>
      {EXO_SYSTEMS.map((s) => (
        <Beacon
          key={s.id}
          id={s.id}
          name={s.name}
          distanceLy={s.distanceLy}
          distanceLyNum={s.distanceLyNum}
        />
      ))}
    </group>
  );
}
