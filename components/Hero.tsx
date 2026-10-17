import Credibility from "./Credibility";
import HeroStage from "./HeroStage";
import { bioAccents, bioEmphasis, identity } from "@/lib/content";
import { splitByPhrases } from "@/lib/utils";

// First screen: portrait, name, title, both actions and the contact row
// (HeroStage). Then the bio as an editorial About intro on the section grid,
// then the Experience/Education logo panel.
export default function Hero() {
  // The bio splits after its first sentence: a lead, then the detail.
  const cut = identity.bio.indexOf(". ") + 1;
  const lead = identity.bio.slice(0, cut);
  const detail = identity.bio.slice(cut + 1);

  return (
    <section id="top" tabIndex={-1} className="relative">
      <HeroStage />
      <div className="wrap section" data-reveal="up">
        <p className="kicker">About</p>
        <p className="mt-5 text-[clamp(1.25rem,1.6vw,1.625rem)] leading-[1.4] tracking-[-0.01em]">
          {splitByPhrases(lead, bioAccents).map((part, i) =>
            part.match ? (
              <span key={i} className="accent whitespace-nowrap">
                {part.text}
              </span>
            ) : (
              part.text
            ),
          )}
        </p>
        <p className="mt-5 leading-[1.65] text-muted lg:text-[1.125rem]">
          {splitByPhrases(detail, bioEmphasis).map((part, i) =>
            part.match ? (
              <span key={i} className="text-ink">
                {part.text}
              </span>
            ) : (
              part.text
            ),
          )}
        </p>
      </div>
      <div className="wrap">
        <Credibility />
      </div>
    </section>
  );
}
