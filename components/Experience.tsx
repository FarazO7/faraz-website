import DomainPills from "./DomainPills";
import { SectionHead } from "./Section";
import Timeline from "./Timeline";
import { educationTimeline, experience } from "@/lib/content";

const COLUMNS = "wrap grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] lg:gap-16";

// The reference's "What to expect" layout: heading and the active role's
// Domains pinned on the left from lg, the numbered timeline on the right.
// Education is its own section on the same columns, so the pinned panel's
// grid ends with the last role and the panel scrolls away with it.
// Reading-first: full text, no collapsing, nothing dims after it has appeared.
export default function Experience() {
  return (
    <>
      <section id="experience" aria-labelledby="experience-title" tabIndex={-1} className="section">
        <div className={COLUMNS}>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead id="experience" title="Experience" />
            <DomainPills sets={experience.map((role) => role.domains ?? [])} timelineId="experience-roles" />
          </div>
          <Timeline id="experience-roles" roles={experience} />
        </div>
      </section>
      <section id="education" aria-labelledby="education-title" tabIndex={-1} className="section">
        <div className={COLUMNS}>
          <div>
            <SectionHead id="education" title="Education" />
            <p className="mt-3 text-muted" data-reveal="fade">
              Where the foundation was laid.
            </p>
          </div>
          <Timeline roles={educationTimeline} compact />
        </div>
      </section>
    </>
  );
}
