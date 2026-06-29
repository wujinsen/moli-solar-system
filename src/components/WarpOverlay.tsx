import { useEffect, useRef } from "react";
import { useStore } from "../store/useStore";

interface Star {
  angle: number;
  radius: number;
  speed: number;
  len: number;
  hue: number;
}

const DURATION = 1700; // must match store startWarp timing

export function WarpOverlay() {
  const warping = useStore((s) => s.warping);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    if (!warping) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    // Seed radial streak stars.
    const N = 520;
    starsRef.current = Array.from({ length: N }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: Math.random() * 0.25,
      speed: 0.6 + Math.random() * 1.4,
      len: 0.04 + Math.random() * 0.12,
      hue: 200 + Math.random() * 60,
    }));
    startRef.current = performance.now();

    const draw = (now: number) => {
      const t = Math.min((now - startRef.current) / DURATION, 1);
      // Acceleration envelope: ramp up fast, hold, ease out.
      const accel =
        t < 0.42
          ? (t / 0.42) ** 2
          : t < 0.62
          ? 1
          : 1 - ((t - 0.62) / 0.38) ** 1.5;
      // Screen flash / vignette opacity.
      const flash =
        t < 0.42 ? (t / 0.42) * 0.9 : t < 0.62 ? 0.9 : 0.9 * (1 - (t - 0.62) / 0.38);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.hypot(cx, cy);

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(2,3,12,0.32)";
      ctx.fillRect(0, 0, w, h);

      // Central bluish flash.
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      grad.addColorStop(0, `rgba(150,190,255,${flash * 0.5})`);
      grad.addColorStop(0.3, `rgba(80,120,220,${flash * 0.18})`);
      grad.addColorStop(1, "rgba(2,3,12,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      for (const st of starsRef.current) {
        st.radius += st.speed * accel * 0.016;
        if (st.radius > 1.25) {
          st.radius = Math.random() * 0.08;
          st.angle = Math.random() * Math.PI * 2;
        }
        const r0 = st.radius * maxR;
        const r1 = (st.radius - st.len * (0.4 + accel)) * maxR;
        const x0 = cx + Math.cos(st.angle) * r0;
        const y0 = cy + Math.sin(st.angle) * r0;
        const x1 = cx + Math.cos(st.angle) * Math.max(r1, 0);
        const y1 = cy + Math.sin(st.angle) * Math.max(r1, 0);
        const alpha = Math.min(st.radius * 2.2, 1) * (0.5 + accel * 0.5);
        ctx.strokeStyle = `hsla(${st.hue},100%,80%,${alpha})`;
        ctx.lineWidth = (1 + accel * 2.4) * dpr;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      const c = canvasRef.current;
      if (c) c.getContext("2d")?.clearRect(0, 0, c.width, c.height);
    };
  }, [warping]);

  return (
    <canvas
      ref={canvasRef}
      className={`warp-overlay ${warping ? "on" : ""}`}
      aria-hidden
    />
  );
}
