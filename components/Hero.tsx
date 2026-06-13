import { Download } from "lucide-react";
import Avatar from "./Avatar";
import ContactLinks from "./ContactLinks";
import Metrics from "./Metrics";
import { identity } from "@/lib/content";
import { withBase } from "@/lib/utils";

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
                  href={withBase(identity.resumePath)}
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
