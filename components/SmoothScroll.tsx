"use client";

import { useEffect } from "react";

// Lenis-powered smooth scrolling (the buttery feel from dennissnellenberg.com).
// Disabled entirely under prefers-reduced-motion. In-page anchor links (#work,
// #impact, …) are routed through Lenis so the nav glides instead of jumping.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let raf = 0;
    let destroy = () => {};

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      const onClick = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement | null)?.closest(
          'a[href^="#"]',
        ) as HTMLAnchorElement | null;
        if (!anchor) return;
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: -80 });
      };
      document.addEventListener("click", onClick);

      destroy = () => {
        cancelAnimationFrame(raf);
        document.removeEventListener("click", onClick);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      destroy();
    };
  }, []);

  return null;
}