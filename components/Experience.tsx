import { SectionHead } from "./Section";
import Timeline from "./Timeline";
import { domains, educationTimeline, experience } from "@/lib/content";

// The reference's "What to expect" layout: heading and Domains pinned on the
// left from lg, the numbered timeline on the right. Reading-first: full text,
// no collapsing, nothing dims after it has appeared.
export default function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" tabIndex={-1} className="section">
      <div className="wrap grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHead id="experience" kicker="Track Record" title="Experience" />
          <div className="mt-10" data-reveal="fade">
            <p id="domains-label" className="kicker">
              Domains
            </p>
            <ul aria-labelledby="domains-label" className="mt-4 flex flex-wrap gap-2">
              {domains.map((domain) => (
                <li key={domain} className="pill bg-surface-3 text-[0.875rem]">
                  {domain}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <Timeline roles={experience} />
          <div className="mt-16 md:mt-24">
            <h3 className="t-h2" data-reveal="fade">
              Education
            </h3>
            <p className="mt-3 text-muted" data-reveal="fade">
              Where the foundation was laid.
            </p>
            <Timeline roles={educationTimeline} compact className="mt-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
