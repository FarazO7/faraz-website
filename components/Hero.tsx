"use client";

import Image from "next/image";
import { useState } from "react";
import { Download } from "lucide-react";
import ContactLinks from "./ContactLinks";
import Metrics from "./Metrics";
import { identity } from "@/lib/content";
import { withBasePath } from "@/lib/utils";

function Avatar() {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className="w-fit shrink-0 rounded-full border-2 border-white/[0.18] p-1"
      style={{ boxShadow: "0 0 48px rgba(79, 124, 255, 0.28)" }}
    >
      {failed ? (
        <div
          role="img"
          aria-label={identity.headshotAlt}
          className="grid size-28 place-items-center rounded-full bg-white/[0.06] font-display text-3xl font-bold sm:size-32"
        >
          FA
        </div>
      ) : (
        <Image
          // unoptimized images bypass the loader that would add basePath
          src={withBasePath(identity.headshotPath)}
          alt={identity.headshotAlt}
          width={128}
          height={128}
          priority
          onError={() => setFailed(true)}
          className="size-28 rounded-full object-cover sm:size-32"
        />
      )}
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="px-4 pt-24 pb-4 sm:px-6 md:pt-32 md:pb-8">
      <div className="mx-auto max-w-6xl">
        {/* No entrance animation here: the hero holds the LCP text, and
            animating it from opacity 0 disqualifies it as an LCP candidate. */}
        <div className="glass p-6 sm:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
            <Avatar />
            <div className="min-w-0">
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                {identity.name}
              </h1>
              <p className="mt-2 font-mono text-sm text-accent-b">
                {identity.title} · {identity.company} · {identity.location}
              </p>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
                {identity.positioning}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                <a
                  href={withBasePath(identity.resumePath)}
                  download
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-medium transition-colors hover:border-white/[0.18] hover:bg-white/15"
                >
                  <Download className="size-4" aria-hidden />
                  Download Resume
                </a>
                <ContactLinks />
              </div>
            </div>
          </div>
          <Metrics />
        </div>
      </div>
    </section>
  );
}
