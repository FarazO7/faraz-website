import Section from "./Section";
import Timeline from "./Timeline";
import { domains, educationTimeline, experience } from "@/lib/content";

export default function Experience() {
  return (
    <Section id="experience" kicker="Track Record" title="Experience">
      {/* Domains: flat chips, no glass (keeps the section's blur budget for
          the current-role card). */}
      <div className="mb-10">
        <p
          id="domains-label"
          className="font-mono text-xs tracking-[0.2em] text-muted uppercase"
        >
          Domains
        </p>
        <ul aria-labelledby="domains-label" className="mt-3 flex flex-wrap gap-2">
          {domains.map((domain) => (
            <li
              key={domain}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[13px] text-foreground/85"
            >
              {domain}
            </li>
          ))}
        </ul>
      </div>
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
