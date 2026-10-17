"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// The reference's divider: a hairline that draws itself in on first view and,
// on fine pointers, bends toward the cursor and springs back when it leaves
// (an underdamped spring standing in for elastic.out). Decorative only.
export default function Divider({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const path = pathRef.current;
    if (!host || !path) return;
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;

    let raf = 0;
    let target = { x: 0, y: 0 };
    let pos = { x: 0, y: 0 };
    let vel = 0;
    let hovering = false;
    const draw = () => {
      const w = host.offsetWidth;
      path.setAttribute("d", `M0,100 Q${pos.x || w / 2},${100 + pos.y} ${w},100`);
    };
    const tick = () => {
      if (hovering) {
        pos = { ...target };
        vel = 0;
      } else {
        // Spring back toward rest: stiffness 0.06, damping 0.86 (≈ 2s settle).
        vel = (vel + (0 - pos.y) * 0.06) * 0.86;
        pos.y += vel;
      }
      draw();
      raf = Math.abs(pos.y) > 0.1 || Math.abs(vel) > 0.1 || hovering ? requestAnimationFrame(tick) : 0;
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      hovering = true;
      target = { x: e.clientX - r.left, y: Math.max(-40, Math.min(40, (e.clientY - (r.top + r.height / 2)) * 2)) };
      start();
    };
    const onLeave = () => {
      hovering = false;
      start();
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", draw);
    draw();
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", draw);
    };
  }, []);

  return (
    <div ref={hostRef} aria-hidden className={cn("divider", className)} data-reveal="draw">
      <svg preserveAspectRatio="none">
        <path ref={pathRef} d="M0,100 L10000,100" />
      </svg>
    </div>
  );
}
