import * as THREE from "three";

// Lightweight value-noise based procedural textures. These give a believable
// "realistic" base look without requiring external image assets. Drop real
// images into /public/textures and wire them up in Planet.tsx to upgrade.

function hash(x: number, y: number, seed: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

function valueNoise(x: number, y: number, seed: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const tl = hash(xi, yi, seed);
  const tr = hash(xi + 1, yi, seed);
  const bl = hash(xi, yi + 1, seed);
  const br = hash(xi + 1, yi + 1, seed);
  const u = smooth(xf);
  const v = smooth(yf);
  return lerp(lerp(tl, tr, u), lerp(bl, br, u), v);
}

function fbm(x: number, y: number, seed: number, octaves = 5) {
  let value = 0;
  let amp = 0.5;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    value += amp * valueNoise(x * freq, y * freq, seed + i * 13.3);
    freq *= 2;
    amp *= 0.5;
  }
  return value;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

function mix(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export type TexStyle = "rocky" | "earth" | "gas" | "ice" | "sun";

const cache = new Map<string, THREE.Texture>();

export function makePlanetTexture(
  style: TexStyle,
  base: string,
  secondary: string,
  seed = 1
): THREE.Texture {
  const key = `${style}-${base}-${secondary}-${seed}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const w = 1024;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const data = img.data;

  const c1 = hexToRgb(base);
  const c2 = hexToRgb(secondary);
  const white: [number, number, number] = [245, 248, 255];
  const ocean: [number, number, number] = hexToRgb(base);
  const land: [number, number, number] = hexToRgb(secondary);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const nx = (x / w) * 8;
      const ny = (y / h) * 4;
      let col: [number, number, number];

      if (style === "gas") {
        // horizontal bands with turbulence
        const turb = fbm(nx * 1.5, ny * 6, seed, 4) * 0.6;
        const band = Math.sin((ny + turb) * 9.0) * 0.5 + 0.5;
        col = mix(c1, c2, band);
        // a faint storm spot
        const dx = x / w - 0.62;
        const dy = y / h - 0.42;
        const d = Math.sqrt(dx * dx * 3 + dy * dy * 6);
        if (d < 0.07) {
          col = mix(col, [200, 70, 40], (0.07 - d) / 0.07);
        }
      } else if (style === "earth") {
        const n = fbm(nx * 1.4, ny * 1.4, seed, 6);
        const polar = Math.abs(y / h - 0.5) * 2;
        if (n > 0.52) {
          col = mix(land, [90, 130, 70], (n - 0.52) * 2);
        } else {
          col = mix([20, 60, 120], ocean, n);
        }
        if (polar > 0.86) col = mix(col, white, (polar - 0.86) / 0.14);
      } else if (style === "ice") {
        const n = fbm(nx, ny, seed, 5);
        col = mix(c1, c2, n * 0.7);
        col = mix(col, white, Math.max(0, n - 0.7) * 0.5);
      } else {
        // rocky: craters / blotches
        const n = fbm(nx * 2, ny * 2, seed, 6);
        col = mix(c2, c1, n);
        const crater = fbm(nx * 6 + 50, ny * 6 + 50, seed + 7, 3);
        if (crater > 0.72) col = mix(col, c2, (crater - 0.72) * 2.5);
      }

      data[i] = col[0];
      data[i + 1] = col[1];
      data[i + 2] = col[2];
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  cache.set(key, tex);
  return tex;
}

// Earth cloud layer: white wisps on transparent background.
export function makeCloudTexture(seed = 99): THREE.Texture {
  const key = `clouds-${seed}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const w = 1024;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const data = img.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const nx = (x / w) * 6;
      const ny = (y / h) * 3;
      const n = fbm(nx * 1.8, ny * 1.8, seed, 6);
      const a = Math.max(0, n - 0.5) * 2;
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
      data[i + 3] = Math.min(255, a * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  cache.set(key, tex);
  return tex;
}

// Ring texture: concentric translucent bands for Saturn / Uranus.
export function makeRingTexture(color: string, seed = 5): THREE.Texture {
  const key = `ring-${color}-${seed}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const w = 1024;
  const h = 16;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const data = img.data;
  const c = hexToRgb(color);
  for (let x = 0; x < w; x++) {
    const t = x / w;
    const bands =
      Math.sin(t * 60) * 0.25 +
      Math.sin(t * 23) * 0.2 +
      valueNoise(t * 40, 0, seed) * 0.4;
    let alpha = 0.35 + bands;
    // a few gaps
    if (t > 0.42 && t < 0.46) alpha *= 0.1;
    if (t > 0.74 && t < 0.77) alpha *= 0.2;
    alpha = Math.max(0, Math.min(1, alpha));
    for (let y = 0; y < h; y++) {
      const i = (y * w + x) * 4;
      data[i] = c[0];
      data[i + 1] = c[1];
      data[i + 2] = c[2];
      data[i + 3] = alpha * 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}

// Soft radial corona glow used on a camera-facing sprite. The gradient peaks
// just outside the solar disk and fades smoothly to zero, so there is no hard
// edge — unlike a Fresnel shell.
export function makeGlowTexture(): THREE.Texture {
  const key = "sun-glow";
  const cached = cache.get(key);
  if (cached) return cached;
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;
  const grad = ctx.createRadialGradient(c, c, 0, c, c, c);
  // Transparent center so the textured disk shows through; the glow forms a
  // halo hugging the limb (~0.4 of the sprite) and fades smoothly outward.
  grad.addColorStop(0.0, "rgba(255, 200, 110, 0.0)");
  grad.addColorStop(0.36, "rgba(255, 200, 110, 0.0)");
  grad.addColorStop(0.43, "rgba(255, 195, 95, 0.55)");
  grad.addColorStop(0.55, "rgba(255, 155, 60, 0.24)");
  grad.addColorStop(0.75, "rgba(255, 130, 50, 0.07)");
  grad.addColorStop(1.0, "rgba(255, 130, 50, 0.0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}

/** Soft radial bloom — bright core fading to transparent (engine plume / thruster). */
export function makeThrusterTexture(): THREE.Texture {
  const key = "thruster-plume";
  const cached = cache.get(key);
  if (cached) return cached;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;
  const grad = ctx.createRadialGradient(c, c, 0, c, c, c);
  grad.addColorStop(0.0, "rgba(255,255,255,1)");
  grad.addColorStop(0.18, "rgba(255,255,255,0.82)");
  grad.addColorStop(0.42, "rgba(255,255,255,0.35)");
  grad.addColorStop(0.68, "rgba(255,255,255,0.08)");
  grad.addColorStop(1.0, "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}

// Radial corona rays / streamers used on a slowly-rotating camera-facing
// sprite — the spiky golden "光芒" reaching out from behind the disk.
export function makeRaysTexture(): THREE.Texture {
  const key = "sun-rays";
  const cached = cache.get(key);
  if (cached) return cached;
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const c = size / 2;
  const inner = c * 0.3; // start just outside the disk
  ctx.translate(c, c);
  ctx.globalCompositeOperation = "lighter";
  const N = 72;
  for (let i = 0; i < N; i++) {
    const ang = (i / N) * Math.PI * 2 + Math.random() * 0.05;
    const len = c * (0.5 + Math.random() * 0.5);
    const width = 1.5 + Math.random() * Math.random() * 9;
    const alpha = 0.08 + Math.random() * 0.22;
    ctx.save();
    ctx.rotate(ang);
    const grad = ctx.createLinearGradient(0, inner, 0, len);
    grad.addColorStop(0.0, "rgba(255, 210, 130, 0)");
    grad.addColorStop(0.15, `rgba(255, 200, 110, ${alpha})`);
    grad.addColorStop(0.5, `rgba(255, 165, 70, ${alpha * 0.5})`);
    grad.addColorStop(1.0, "rgba(255, 140, 50, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(-width / 2, inner, width, len - inner);
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}

// Sun surface: turbulent emissive texture.
export function makeSunTexture(seed = 3): THREE.Texture {
  const key = `sun-${seed}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const w = 1024;
  const h = 512;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const data = img.data;
  const hot: [number, number, number] = [255, 240, 180];
  const mid: [number, number, number] = [255, 150, 40];
  const dark: [number, number, number] = [160, 50, 10];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const nx = (x / w) * 10;
      const ny = (y / h) * 6;
      const n = fbm(nx * 1.5, ny * 1.5, seed, 6);
      let col = mix(dark, mid, n);
      col = mix(col, hot, Math.max(0, n - 0.55) * 2.2);
      data[i] = col[0];
      data[i + 1] = col[1];
      data[i + 2] = col[2];
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  cache.set(key, tex);
  return tex;
}
