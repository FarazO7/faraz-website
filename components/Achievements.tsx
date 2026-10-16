import { ArrowUpRight } from "lucide-react";
import Words from "./Words";
import { achievements } from "@/lib/content";

// The reference's statement lines: one centred headline per achievement under
// a pink sparkle, words blurring in once on first view. Rendered once (the old
// pinned desktop copy and its mobile twin are gone).
export default function Achievements() {
  return (
    <section
      id="achievements"
      aria-labelledby="achievements-title"
      tabIndex={-1}
      className="section relative overflow-hidden bg-[linear-gradient(180deg,#fff,rgba(223,233,250,0.45))]"
    >
      <h2 id="achievements-title" className="sr-only">
        Achievements
      </h2>
      <span aria-hidden className="sphere sphere-pink -left-16 top-24 size-56 opacity-70" />
      <span aria-hidden className="sphere sphere-sand -right-10 bottom-10 size-64 opacity-70" />
      <div className="wrap relative text-center">
        <p className="kicker" data-reveal="fade">
          Recognition
        </p>
        <ul className="mt-12 space-y-16 md:mt-16 md:space-y-24">
          {achievements.map((a) => (
            <li key={a.title} className="flex flex-col items-center">
              <span aria-hidden className="sparkle size-6" />
              <h3 className="t-h1 mt-6 max-w-[20ch]" data-reveal="blur">
                {a.href ? (
                  <a href={a.href} target="_blank" rel="noopener noreferrer" className="link">
                    <Words text={a.title} />
                    <ArrowUpRight className="ml-2 inline size-[0.5em] align-baseline" aria-hidden />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ) : (
                  <Words text={a.title} />
                )}
              </h3>
              {a.year && <span className="t-label mt-4">{a.year}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
