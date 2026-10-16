"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import Numeral from "./Numeral";
import Words from "./Words";
import { heroStats, identity, metricLabel } from "@/lib/content";
import { heroFits } from "@/lib/heroFit";
import { withBase } from "@/lib/utils";

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

const easeOut = (t: number) => 1 - (1 - t) * (1 - t); // power1.out, as measured

// The reference's hero: a headline with a small sphere above it; scrolling
// carries the sphere down into a ring while three stat cards fade in around
// it. Here the portrait plays the sphere. Server-rendered as a static stack
// (portrait + copy, then the orbit), which is also the reduced-motion, no-JS
// and short-screen layout. The client upgrades it to a sticky scroll stage
// (data-live) only when motion is allowed and the copy fits one screen.
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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const offsetIn = (el: HTMLElement) => {
      let y = 0;
      for (let n: HTMLElement | null = el; n && n !== sticky; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
      return y;
    };

    let raf = 0;
    const update = () => {
      raf = 0;
      const range = stage.offsetHeight - window.innerHeight;
      const p = clamp01(-stage.getBoundingClientRect().top / range);
      const set = (name: string, value: number) => stage.style.setProperty(name, value.toFixed(4));
      set("--pc", clamp01(p / 0.22));
      set("--pm", easeOut(clamp01(p / 0.5)));
      set("--pr", clamp01((p - 0.25) / 0.25));
      heroStats.forEach((_, i) => set(`--k${i}`, clamp01((p - 0.38 - i * 0.06) / 0.2)));
      stage.dataset.copy = p < 0.12 ? "on" : "off";
      stage.dataset.cards = p > 0.7 ? "on" : "off";
      if (p > 0.38) stage.dataset.roll = ""; // stat odometers roll as the cards arrive
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const measure = () => {
      const dy = offsetIn(box) + box.offsetHeight / 2 - (offsetIn(portrait) + portrait.offsetHeight / 2);
      stage.style.setProperty("--dy", `${dy}px`);
      stage.style.setProperty("--sc", ((box.offsetWidth * 0.62) / portrait.offsetWidth).toFixed(3));
      update();
    };
    // Live or static is decided from the width-dependent content height and
    // re-decided only when the width changes, so mobile toolbars collapsing
    // (a height-only resize) can never flip the layout mid-scroll.
    let width = window.innerWidth;
    const decide = () => {
      if (heroFits(stage)) stage.setAttribute("data-live", "");
      else stage.removeAttribute("data-live");
      if (stage.hasAttribute("data-live")) measure();
    };
    const onResize = () => {
      if (window.innerWidth !== width) {
        width = window.innerWidth;
        decide();
      } else if (stage.hasAttribute("data-live")) measure();
    };

    const wasLive = stage.hasAttribute("data-live");
    if (wasLive) measure();
    else decide();
    // After a client-side navigation to "/#section" the page scrolled before
    // the stage grew; land on the target again.
    if (!wasLive && stage.hasAttribute("data-live") && location.hash) {
      document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: "instant" });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={stageRef} id="hero-stage" className="hero-stage" suppressHydrationWarning>
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
              <a href={`mailto:${identity.email}`} className="btn btn-primary">
                Get in touch
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
              <a href={withBase(identity.resumePath)} download className="btn btn-secondary">
                <Download className="size-4" aria-hidden />
                Download Resume
              </a>
            </div>
          </div>
        </div>
        <div className="hero-orbit">
          <div ref={boxRef} className="orbit-box">
            <div aria-hidden className="orbit-ring" />
            <div aria-hidden className="orbit-sphere sphere sphere-blue" />
            {heroStats.map((metric, i) => (
              <Link
                key={metric.slug}
                href={`/impact/${metric.slug}`}
                aria-label={metricLabel(metric)}
                className={`orbit-card orbit-card-${i} group`}
                // Hidden until the stage measures (live mode only); the same
                // figures are always visible in the Impact section.
                style={{ "--k": `var(--k${i}, 0)` } as CSSProperties}
              >
                <span className="t-numeral block text-[clamp(2.25rem,3.6vw,3.75rem)]">
                  <Numeral metric={metric} />
                </span>
                <span className="mt-3 block text-[0.9375rem] leading-snug md:text-base">{metric.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
