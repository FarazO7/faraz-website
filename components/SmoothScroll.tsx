"use client";

import { useEffect } from "react";

// Lenis smooth scrolling with the reference's settings: duration 1.5 and its
// default exponential ease, wheel only, off on touch devices and under
// prefers-reduced-motion (native scrolling there). Keyboard scrolling and
// find-in-page stay native. In-page anchors glide through Lenis, which honours
// each target's scroll-margin-top (clears the fixed nav); the hash still
// updates and focus moves to the target so keyboard users continue from it.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;

    let cancelled = false;
    let raf = 0;
    let destroy = () => {};

    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ duration: 1.5, smoothWheel: true });

      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);

      const onClick = (e: MouseEvent) => {
        const anchor = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
        const href = anchor?.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.getElementById(decodeURIComponent(href.slice(1)));
        if (!target) return;
        e.preventDefault();
        history.pushState(null, "", href);
        lenis.scrollTo(target, {
          onComplete: () => target.focus({ preventScroll: true }),
        });
      };
      document.addEventListener("click", onClick);

      // The open mobile menu locks scrolling with html.no-scroll; pause too.
      const lock = new MutationObserver(() => {
        if (document.documentElement.classList.contains("no-scroll")) lenis.stop();
        else lenis.start();
      });
      lock.observe(document.documentElement, { attributeFilter: ["class"] });

      destroy = () => {
        cancelAnimationFrame(raf);
        document.removeEventListener("click", onClick);
        lock.disconnect();
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
