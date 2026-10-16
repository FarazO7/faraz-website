"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// One observer for every [data-reveal] element (styles in globals.css).
// Anything already on screen is marked revealed before .reveal-ready lands on
// <html>, in the same task, so nothing visible ever blinks out. Under reduced
// motion the class is never added and the page stays static. Re-runs on
// client navigation (home ↔ impact pages).
export default function RevealController() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    for (const el of document.querySelectorAll("[data-reveal]:not(.is-in)")) {
      const { top, bottom } = el.getBoundingClientRect();
      if (top < window.innerHeight * 0.88 && bottom > 0) el.classList.add("is-in");
      else observer.observe(el);
    }
    document.documentElement.classList.add("reveal-ready");
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
