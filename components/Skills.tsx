import type { CSSProperties } from "react";
import Section from "./Section";
import {
  skills,
  skillsIntro,
  certifications,
  type Credential,
  type SkillHub,
} from "@/lib/content";
import { getBrandIcon, markFill } from "@/lib/skillIcons";

// Reading-first: the intro line, one pastel card per resume skill group (the
// reference's benefit cards) with each skill as a white pill and a brand mark
// where one exists, then Certifications as a plain list.
const TONES = ["bg-blue-50", "bg-pink-50", "bg-surface-3", "bg-surface-2"];

export default function Skills() {
  return (
    <Section id="skills" kicker="Toolkit" title="Skills & Credentials" accent="&">
      <p className="t-lead prose-measure" data-reveal="up">
        {skillsIntro}
      </p>
      <div className="mt-10 grid gap-3 md:grid-cols-2 md:gap-4">
        {skills.map((hub, i) => (
          <HubCard key={hub.name} hub={hub} tone={TONES[i % TONES.length]} index={i} />
        ))}
      </div>
      <div className="mt-14 border-t border-line pt-10" data-reveal="up">
        <CredentialList title="Certifications" items={certifications} />
      </div>
    </Section>
  );
}

function HubCard({ hub, tone, index }: { hub: SkillHub; tone: string; index: number }) {
  return (
    <div
      className={`rounded-[var(--radius)] p-6 md:p-8 ${tone}`}
      data-reveal="up"
      style={{ "--i": index } as CSSProperties}
    >
      <h3 className="flex items-center gap-3 text-[1.75rem] leading-tight">
        <span aria-hidden className="sparkle size-4" style={{ "--sparkle": hub.accent } as CSSProperties} />
        <span className="font-serif italic">{hub.name}</span>
      </h3>
      <ul className="mt-5 flex flex-wrap gap-2">
        {hub.nodes.map((node) => {
          const icon = getBrandIcon(node.slug);
          return (
            <li key={node.label} className="pill">
              {icon && (
                <svg viewBox="0 0 24 24" width="14" height="14" fill={markFill(icon.hex)} aria-hidden>
                  <path d={icon.path} />
                </svg>
              )}
              {node.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CredentialList({ title, items }: { title: string; items: Credential[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)] md:gap-16">
      <h3 className="kicker">{title}</h3>
      <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.text} className="flex items-center gap-3 text-[1.0625rem]">
            <span aria-hidden className="sparkle" />
            {item.href ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer" className="link">
                {item.text}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <span>{item.text}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
