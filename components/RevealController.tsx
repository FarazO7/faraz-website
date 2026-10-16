"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// One observer for every [data-reveal] element (styles in globals.css).
// Anything already on screen is marked revealed before .reveal-ready lands on
// <html>, in the same task, so nothing visible ever blinks out. Once a reveal
// has played (all run under 3s) the attribute is dropped, so its transition
// timing stops overriding the element's own hover transitions. Under reduced
// motion the class is never added and the page stays static. Re-runs on
// client navigation (home ↔ impact pages).
const REVEAL_MS = 3000;
export default function RevealController() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: number[] = [];
    const reveal = (el: Element) => {
      el.classList.add("is-in");
      timers.push(window.setTimeout(() => el.removeAttribute("data-reveal"), REVEAL_MS));
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    for (const el of document.querySelectorAll("[data-reveal]:not(.is-in)")) {
      const { top, bottom } = el.getBoundingClientRect();
      if (top < window.innerHeight * 0.88 && bottom > 0) reveal(el);
      else observer.observe(el);
    }
    document.documentElement.classList.add("reveal-ready");
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [pathname]);

  return null;
}
