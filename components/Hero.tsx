import ContactLinks from "./ContactLinks";
import Credibility from "./Credibility";
import HeroStage from "./HeroStage";
import { HERO_FITS_JS } from "@/lib/heroFit";
import { identity } from "@/lib/content";

// First viewport: portrait, name, title and both actions (HeroStage). The
// introduction and contact row follow the stat orbit, then the logo strip.
export default function Hero() {
  return (
    <section id="top" tabIndex={-1} className="relative">
      <HeroStage />
      {/* Picks the stage layout during parsing, before first paint, so anchors
          and restored scroll positions land in the right place. */}
      <script dangerouslySetInnerHTML={{ __html: HERO_FITS_JS }} />
      <div className="wrap pb-6 text-center md:pt-6">
        <p className="t-lead mx-auto max-w-[60ch]" data-reveal="up">
          {identity.bio}
        </p>
        <div data-reveal="up" style={{ "--i": 1 } as React.CSSProperties}>
          <ContactLinks className="mt-8 justify-center" />
        </div>
      </div>
      <div className="wrap pt-12 md:pt-16">
        <Credibility />
      </div>
    </section>
  );
}
