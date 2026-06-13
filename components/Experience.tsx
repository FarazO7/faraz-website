import Section from "./Section";
import Timeline from "./Timeline";
import { educationTimeline, experience } from "@/lib/content";

export default function Experience() {
  return (
    <Section id="experience" kicker="Track Record" title="Experience">
      <Timeline roles={experience} />
      <div className="mt-14">
        <h3 className="font-display text-xl font-semibold tracking-tight">
          Education
        </h3>
        <p className="mt-1 mb-6 text-sm text-muted">
          Where the foundation was laid.
        </p>
        <Timeline roles={educationTimeline} compact />
      </div>
    </Section>
  );
}
