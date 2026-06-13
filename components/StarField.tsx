"use client";

import { useEffect, useRef } from "react";

// Procedurally generated deep-space star field. Three parallax layers drift,
// twinkle, and (on desktop) host the occasional shooting star. Everything is
// painted into one fixed canvas behind the nebula orbs — no media files, no
// network weight. Perf budget: one rAF loop throttled to ~30fps, DPR capped
// at 1.5, fully paused on hidden tabs, a single static frame under
// prefers-reduced-motion.

type Star = {
  x: number;
  y: number;
  r: number;
  baseAlpha: number;
  twinklePhase: number;
  twinkleSpeed: number; // rad/s
  color: string; // "r,g,b"
};

type Layer = {
  stars: Star[];
  // Diagonal drift in px/s (spec: 2–6 px/min)
  driftX: number;
  driftY: number;
  parallax: number; // fraction of scrollY
};

type Streak = { x: number; y: number; dx: number; dy: number; born: number };

const WHITE = "232,236,245";
const STAR_BLUE = "157,184,255";
const TEAL = "24,198,180";
const FRAME_MS = 33; // ~30fps — drift and twinkle are slow; 60fps buys nothing
const STREAK_LIFE_MS = 300;

function rand(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function makeStar(w: number, h: number, rMax: number): Star {
  const tinted = Math.random() < 0.15;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r: rand(0.5, rMax),
    baseAlpha: rand(0.2, 0.7),
    twinklePhase: Math.random() * Math.PI * 2,
    twinkleSpeed: (Math.PI * 2) / rand(2, 6),
    color: tinted ? (Math.random() < 0.6 ? STAR_BLUE : TEAL) : WHITE,
  };
}

function makeLayers(w: number, h: number, mobile: boolean): Layer[] {
  // far → mid → near; near is fastest, largest, most parallax
  const counts = mobile ? [60, 50, 40] : [140, 110, 90];
  const speeds = [2.5, 4, 6].map((pxPerMin) => pxPerMin / 60);
  const radii = [0.9, 1.2, 1.5];
  const parallaxes = [0.02, 0.04, 0.06];
  return counts.map((count, i) => ({
    stars: Array.from({ length: count }, () => makeStar(w, h, radii[i])),
    driftX: speeds[i] * 0.7,
    driftY: speeds[i] * 0.7,
    parallax: parallaxes[i],
  }));
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let layers: Layer[] = [];
    let mobile = false;
    let w = 0;
    let h = 0;
    let raf = 0;
    let lastFrame = 0;
    let streak: Streak | null = null;
    let nextStreakAt = performance.now() + rand(10_000, 20_000);
    let disposed = false;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      mobile = w < 768;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layers = makeLayers(w, h, mobile);
    };

    const drawFrame = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      const t = now / 1000;
      const scrollY = window.scrollY;
      for (const layer of layers) {
        // Reduced motion: one truly static frame — no drift, no scroll parallax.
        const ox = reduced ? 0 : (t * layer.driftX) % w;
        const oy = reduced ? 0 : ((t * layer.driftY) % h) + scrollY * layer.parallax;
        for (const s of layer.stars) {
          // Positive modulo so wrapped coords never go negative at any offset.
          const x = (((s.x + ox) % w) + w) % w;
          const y = (((s.y - oy) % h) + h) % h;
          const alpha = reduced
            ? s.baseAlpha
            : Math.max(
                0.05,
                s.baseAlpha + 0.15 * Math.sin(t * s.twinkleSpeed + s.twinklePhase),
              );
          ctx.beginPath();
          ctx.arc(x, y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${s.color},${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      if (!reduced && !mobile) {
        if (!streak && now >= nextStreakAt) {
          const angle = rand(Math.PI * 0.15, Math.PI * 0.35);
          streak = {
            x: rand(w * 0.1, w * 0.9),
            y: rand(0, h * 0.4),
            dx: Math.cos(angle) * 420,
            dy: Math.sin(angle) * 420,
            born: now,
          };
        }
        if (streak) {
          const age = now - streak.born;
          if (age > STREAK_LIFE_MS) {
            streak = null;
            nextStreakAt = now + rand(10_000, 20_000);
          } else {
            const p = age / STREAK_LIFE_MS;
            const hx = streak.x + (streak.dx * age) / 1000;
            const hy = streak.y + (streak.dy * age) / 1000;
            const grad = ctx.createLinearGradient(
              hx - streak.dx * 0.08,
              hy - streak.dy * 0.08,
              hx,
              hy,
            );
            grad.addColorStop(0, "rgba(157,184,255,0)");
            grad.addColorStop(1, `rgba(232,236,245,${(0.7 * (1 - p)).toFixed(3)})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(hx - streak.dx * 0.08, hy - streak.dy * 0.08);
            ctx.lineTo(hx, hy);
            ctx.stroke();
          }
        }
      }
    };

    const loop = (now: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(loop);
      if (now - lastFrame < FRAME_MS) return;
      lastFrame = now;
      drawFrame(now);
    };

    const start = () => {
      if (disposed) return;
      fit();
      drawFrame(performance.now());
      canvas.style.opacity = "1";
      if (!reduced) raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (reduced) return;
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        lastFrame = 0;
        raf = requestAnimationFrame(loop);
      }
    };

    const onResize = () => {
      fit();
      if (reduced) drawFrame(performance.now());
    };

    // Defer the first paint so the canvas never competes with LCP.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idleId: number = hasIdle
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 0);

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (hasIdle) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 size-full opacity-0 transition-opacity duration-600"
    />
  );
}
