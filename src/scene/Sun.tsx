import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { SUN } from "../data/bodies";
import { registerBody, unregisterBody } from "./registry";
import { useStore } from "../store/useStore";
import { Prominences } from "./Prominences";
import { makeGlowTexture } from "../utils/textures";

// Hybrid sun surface: a real solar surface photo (equirectangular, public
// domain) provides the dense fibrous granulation that procedural noise cannot
// match, then the shader animates it with a flowing domain warp, grades it to
// the golden EUV palette (Solar Orbiter look) and adds limb brightening.
const SURFACE_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vPos;
  varying vec3 vNormalV;
  varying vec3 vViewDir;
  void main() {
    vUv = uv;
    vPos = normalize(position);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormalV = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const SURFACE_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uClose;
  varying vec2 vUv;
  varying vec3 vPos;
  varying vec3 vNormalV;
  varying vec3 vViewDir;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
      mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  vec3 hash33(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(p) * 43758.5453);
  }
  // 3D cellular noise -> distance to nearest feature point (granule lanes)
  float worley(vec3 p) {
    vec3 ip = floor(p);
    vec3 fp = fract(p);
    float d = 1.0;
    for (int x = -1; x <= 1; x++)
    for (int y = -1; y <= 1; y++)
    for (int z = -1; z <= 1; z++) {
      vec3 g = vec3(float(x), float(y), float(z));
      vec3 o = hash33(ip + g);
      o = 0.5 + 0.45 * sin(uTime * 0.6 + 6.2831 * o); // cells boil
      d = min(d, length(g + o - fp));
    }
    return d;
  }

  float lumOf(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

  void main() {
    float t = uTime * 0.025;

    // flowing domain warp => the plasma "boils" instead of being a static photo
    vec2 w = vec2(
      noise(vUv * 7.0 + vec2(0.0, t)),
      noise(vUv * 7.0 + vec2(5.2, t * 1.3))
    ) - 0.5;
    vec2 uv = vUv + w * 0.010;

    // two scales of the real granulation, one drifting, for live shimmer
    float l1 = lumOf(texture2D(uMap, uv).rgb);
    float l2 = lumOf(texture2D(uMap, uv * 2.0 + vec2(t * 0.6, -t * 0.4)).rgb);
    float lum = l1 * 0.82 + l2 * 0.18;

    // fine granulation "popcorn" (Inouye look) that emerges on close zoom:
    // bright cell interiors, dark intergranular lanes
    if (uClose > 0.001) {
      float w1 = worley(vPos * 75.0);
      float w2 = worley(vPos * 160.0);
      float gran = (1.0 - smoothstep(0.05, 0.6, w1)) * 0.7
                 + (1.0 - smoothstep(0.05, 0.55, w2)) * 0.3;
      float granMod = mix(0.5, 1.35, gran); // lanes darken, centers brighten
      lum = mix(lum, lum * granMod, uClose);
    }

    // contrast: keep texture detail but lift blacks (EUV shadows are deep
    // orange, not the photosphere's black sunspots) and brighten midtones
    lum = pow(clamp((lum - 0.05) * 1.55, 0.0, 1.0), 0.95);

    // --- EUV golden colour ramp (Solar Orbiter palette) ---
    vec3 c0 = vec3(0.14, 0.035, 0.0);  // deep orange shadow (not black)
    vec3 c1 = vec3(0.55, 0.19, 0.02);  // orange-brown
    vec3 c2 = vec3(0.94, 0.52, 0.09);  // gold
    vec3 c3 = vec3(1.0, 0.85, 0.45);   // bright plasma
    vec3 c4 = vec3(1.0, 0.99, 0.9);    // hot active region core
    vec3 col = mix(c0, c1, smoothstep(0.0, 0.24, lum));
    col = mix(col, c2, smoothstep(0.22, 0.5, lum));
    col = mix(col, c3, smoothstep(0.5, 0.78, lum));
    col = mix(col, c4, smoothstep(0.82, 1.0, lum));

    // limb brightening — EUV disk glows brighter at the edge. The source photo
    // bakes in limb *darkening*, so we counteract it and add a golden edge glow.
    float mu = max(dot(vNormalV, vViewDir), 0.0);
    float rim = pow(1.0 - mu, 2.0);
    col *= 1.0 + 0.45 * rim;                       // undo baked limb darkening
    col += vec3(1.0, 0.66, 0.28) * rim * 0.8;      // golden edge glow

    gl_FragColor = vec4(col, 1.0);
  }
`;

const SHOW_GLOW = true;

export function Sun() {
  const anchorRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const select = useStore((s) => s.select);
  const hover = useStore((s) => s.hover);

  const map = useTexture("/textures/sun_map.jpg");
  useMemo(() => {
    map.wrapS = THREE.RepeatWrapping;
    map.wrapT = THREE.RepeatWrapping;
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    return map;
  }, [map]);

  const surfaceMat = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMap: { value: map },
        uClose: { value: 0 },
      },
      vertexShader: SURFACE_VERT,
      fragmentShader: SURFACE_FRAG,
    });
    m.toneMapped = false;
    return m;
  }, [map]);

  // chromosphere: thin glowing rim just above the surface
  const chromoMat = useMemo(() => makeRimMaterial("#ffb347", 4.5, 0.9), []);
  // soft camera-facing corona glow (no hard edge)
  const glowTex = useMemo(() => makeGlowTexture(), []);
  const glowMat = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: glowTex,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        toneMapped: false,
      }),
    [glowTex]
  );
  useEffect(() => {
    registerBody(SUN.id, anchorRef.current);
    return () => unregisterBody(SUN.id);
  }, []);

  useFrame((state, dt) => {
    surfaceMat.uniforms.uTime.value = state.clock.elapsedTime;
    // sun sits at the scene origin, so camera distance == position length
    const dist = state.camera.position.length();
    surfaceMat.uniforms.uClose.value = THREE.MathUtils.clamp(
      (68 - dist) / (68 - 20),
      0,
      1
    );
    if (meshRef.current) meshRef.current.rotation.y += dt * 0.02;
  });

  return (
    <group ref={anchorRef}>
      <pointLight
        intensity={4200}
        distance={0}
        decay={2}
        color="#fff3d6"
        castShadow={false}
      />
      <ambientLight intensity={0.06} />

      <mesh
        ref={meshRef}
        material={surfaceMat}
        onClick={(e) => {
          e.stopPropagation();
          select(SUN.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          hover(SUN.id);
        }}
        onPointerOut={() => hover(null)}
      >
        <sphereGeometry args={[SUN.radius, 128, 128]} />
      </mesh>

      {/* erupting prominences / coronal loops at the limb */}
      <Prominences radius={SUN.radius} />

      {/* chromosphere rim */}
      <mesh scale={SUN.radius * 1.04} material={chromoMat}>
        <sphereGeometry args={[1, 64, 64]} />
      </mesh>
      {/* soft corona halo — always faces the camera, fades smoothly outward */}
      {SHOW_GLOW && <sprite scale={SUN.radius * 5} material={glowMat} />}
    </group>
  );
}

function makeRimMaterial(color: string, power: number, strength: number) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uPower: { value: power },
      uStrength: { value: strength },
    },
    vertexShader: /* glsl */ `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uPower;
      uniform float uStrength;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        float rim = 1.0 - max(dot(vNormal, vViewDir), 0.0);
        float glow = pow(rim, uPower) * uStrength;
        gl_FragColor = vec4(uColor * glow, glow);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false,
    toneMapped: false,
  });
}
