"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import ContactRow from "./ContactRow";
import Words from "./Words";
import { heroStrengths, identity } from "@/lib/content";
import { linkProps, resumeLinkProps } from "@/lib/links";
import { withBase } from "@/lib/utils";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

const easeOut = (t: number) => 1 - (1 - t) * (1 - t); // power1.out, as measured

// Identical to the gate in app/globals.css (Hero stage; values in
// docs/DESIGN.md): motion allowed, and either a screen at least 750px tall or
// a portrait phone 360 to 559px wide and at least 540px tall.
const HERO_LIVE_QUERY =
  "(prefers-reduced-motion: no-preference) and (min-height: 750px), " +
  "(prefers-reduced-motion: no-preference) and (orientation: portrait) and (min-width: 360px) and (max-width: 559px) and (min-height: 540px)";

// The reference's hero: a headline with a small sphere above it; scrolling
// carries the sphere down into a ring while cards fade in around it. Here the
// portrait plays the sphere and the cards are five strengths, laid out on a
// CSS grid so they never cover the portrait. CSS alone decides between the
// sticky scroll stage and the static stack (reduced motion, no JS, short
// screens), before first paint; this component only drives the scroll
// variables while the stage is live.
export default function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const sticky = stickyRef.current;
    const portrait = portraitRef.current;
    const box = boxRef.current;
    if (!stage || !sticky || !portrait || !box) return;
    const live = window.matchMedia(HERO_LIVE_QUERY);

    const offsetIn = (el: HTMLElement) => {
      let y = 0;
      for (let n: HTMLElement | null = el; n && n !== sticky; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
      return y;
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      // Stage and frame are both in svh, so Safari's toolbar collapsing (which
      // changes innerHeight) can't change the range or make progress jump.
      const range = stage.offsetHeight - sticky.offsetHeight;
      const p = clamp01(-stage.getBoundingClientRect().top / range);
      const set = (name: string, value: number) => stage.style.setProperty(name, value.toFixed(4));
      set("--pc", clamp01(p / 0.22));
      set("--pm", easeOut(clamp01(p / 0.5)));
      set("--pr", clamp01((p - 0.25) / 0.25));
      heroStrengths.forEach((_, i) => set(`--k${i}`, clamp01((p - 0.38 - i * 0.06) / 0.2)));
      stage.dataset.copy = p < 0.12 ? "on" : "off";
    };
    const onScroll = () => {
      if (live.matches && !raf) raf = requestAnimationFrame(update);
    };
    const measure = () => {
      if (!live.matches) return;
      const dy = offsetIn(box) + box.offsetHeight / 2 - (offsetIn(portrait) + portrait.offsetHeight / 2);
      stage.style.setProperty("--dy", `${dy}px`);
      stage.style.setProperty("--sc", ((box.offsetWidth * 0.62) / portrait.offsetWidth).toFixed(3));
      update();
    };

    // Geometry depends on width only: re-measure on width or orientation
    // changes, a gate change and once the web fonts have settled the copy,
    // never on the height-only resizes Safari's toolbar causes.
    let width = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      measure();
    };
    measure();
    document.fonts.ready.then(measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    live.addEventListener("change", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      live.removeEventListener("change", measure);
    };
  }, []);

  return (
    <div ref={stageRef} className="hero-stage">
      <div ref={stickyRef} className="hero-sticky">
        <div aria-hidden className="hero-arc hero-arc-top" />
        <div aria-hidden className="hero-arc hero-arc-bottom" />
        <div className="hero-top wrap">
          <div ref={portraitRef} className="hero-portrait enter-fade" style={{ "--d": "0s" } as CSSProperties}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, basePath via withBase */}
            <img
              src={withBase(identity.headshotPath)}
              alt={identity.headshotAlt}
              width={1024}
              height={1024}
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="hero-copy">
            <p className="kicker enter-fade" style={{ "--d": "0.1s" } as CSSProperties}>
              {identity.greeting}
            </p>
            <h1 className="t-display enter-words mt-5">
              <Words text={`I am ${identity.name}.`} accent="I am" />
            </h1>
            <h2 className="t-h3 enter-fade mt-4 md:mt-6" style={{ "--d": "0.35s" } as CSSProperties}>
              {identity.title}
            </h2>
            <div
              className="enter-fade mt-8 flex flex-wrap items-center justify-center gap-3"
              style={{ "--d": "0.45s" } as CSSProperties}
            >
              <a {...linkProps(identity.emailHref)} className="btn btn-primary">
                Get in touch
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
              <a {...resumeLinkProps()} className="btn btn-secondary">
                <Download className="size-4" aria-hidden />
                Download Resume
              </a>
            </div>
            <div className="enter-fade mt-5" style={{ "--d": "0.55s" } as CSSProperties}>
              <ContactRow />
            </div>
          </div>
        </div>
        <div className="hero-orbit">
          {heroStrengths.map((strength, i) => (
            <div
              key={strength.title}
              className="strength-card"
              // Hidden until the stage measures (live mode only).
              style={{ "--k": `var(--k${i}, 0)` } as CSSProperties}
            >
              <p className="font-serif text-[clamp(1.25rem,1rem+1.2vw,2rem)] leading-tight italic">{strength.title}</p>
              <p className="mt-2 text-[0.875rem] leading-snug text-muted md:text-[0.9375rem]">
                {strength.tags ? strength.tags.join(" · ") : strength.line}
              </p>
            </div>
          ))}
          {/* After the cards, so the grid's nth-child areas count cards only. */}
          <div ref={boxRef} aria-hidden className="orbit-box">
            <div className="orbit-ring" />
            <div className="orbit-sphere sphere sphere-blue" />
          </div>
        </div>
      </div>
    </div>
  );
}
