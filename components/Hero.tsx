import { ArrowRight, Download } from "lucide-react";
import ContactLinks from "./ContactLinks";
import Credibility from "./Credibility";
import { identity } from "@/lib/content";
import { withBase } from "@/lib/utils";

// Immersive split hero: identity + dual CTA + contact row on the left, a large
// portrait wrapped in an orbital halo on the right, with the Experience &
// Education proof strip docked at the base. No entrance animation on the copy —
// the name is the LCP element and must paint immediately.
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col px-4 pt-24 pb-6 sm:px-6 md:pt-28"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center">
        <div className="grid w-full items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
          {/* LEFT — identity */}
          <div className="min-w-0">
            <p className="font-mono text-sm text-accent-b">{identity.greeting}</p>
            <h1 className="mt-3 font-display text-5xl font-bold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              I am {identity.name}.
            </h1>
            <h2 className="mt-4 font-display text-xl font-medium text-muted sm:text-2xl">
              {identity.title}
            </h2>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
              {identity.bio}
            </p>

            {/* Dual CTA — primary "Get in touch", ghost "Download Resume" */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${identity.email}`}
                className="group inline-flex items-center gap-2 rounded-xl bg-accent-a px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3d6af0]"
              >
                Get in touch
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
              <a
                href={withBase(identity.resumePath)}
                download
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-white/25 hover:bg-white/[0.08]"
              >
                <Download className="size-4" aria-hidden />
                Download Resume
              </a>
            </div>

            {/* Contact row — phone · email · LinkedIn · GitHub */}
            <div className="mt-6">
              <ContactLinks />
            </div>
          </div>

          {/* RIGHT — circular portrait framed by the orbital ring */}
          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(79,124,255,0.25), rgba(24,198,180,0.08) 55%, transparent 72%)",
              }}
            />
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              className="orbit-spin absolute inset-0 h-full w-full"
            >
              <circle
                cx="50"
                cy="50"
                r="49"
                fill="none"
                stroke="#4F7CFF"
                strokeOpacity="0.32"
                strokeWidth="0.4"
              />
              <circle cx="99" cy="50" r="1.4" fill="#9DB8FF" />
            </svg>
            <div className="absolute inset-[6%] overflow-hidden rounded-full shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 35%, rgba(79,124,255,0.12), transparent 70%)",
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, basePath via withBase */}
              <img
                src={withBase(identity.headshotPath)}
                alt={identity.headshotAlt}
                width={1024}
                height={1024}
                fetchPriority="high"
                decoding="async"
                className="relative h-full w-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Experience & Education proof strip, docked at the base of the hero */}
      <div className="mx-auto w-full max-w-6xl">
        <Credibility />
      </div>
    </section>
  );
}