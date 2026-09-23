import { BadgeCheck, ChevronRight } from "lucide-react";
import Section from "./Section";
import {
  skills,
  skillsIndex,
  skillsIntro,
  certifications,
  type Credential,
  type SkillHub,
} from "@/lib/content";
import { getBrandIcon, markFill } from "@/lib/skillIcons";
import { cn } from "@/lib/utils";

const INDEX_COUNT = skillsIndex.reduce((sum, group) => sum + group.items.length, 0);

// Static, scannable replacement for the animated constellation: each hub is a
// glass card with its tools as chips (brand mark when one exists, else text).
// The first hub spans the full width. Hub cards use the no-blur glass variant
// so the section, and the GitHub boundary above it, stay within the ~6
// live-blur budget. The full resume taxonomy sits in a native <details>.
export default function Skills() {
  return (
    <Section id="skills" kicker="Toolkit" title="Skills & Credentials">
      <p className="mb-8 max-w-3xl text-[15px] leading-relaxed text-muted">
        {skillsIntro}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {skills.map((hub, i) => (
          <HubCard key={hub.name} hub={hub} wide={i === 0} />
        ))}
      </div>
      <SkillsIndex />
      <div className="mt-12 border-t border-white/[0.07] pt-10">
        <CredentialList title="Certifications" items={certifications} />
      </div>
    </Section>
  );
}

function HubCard({ hub, wide }: { hub: SkillHub; wide: boolean }) {
  return (
    <div className={cn("glass glass-nested p-6", wide && "sm:col-span-2")}>
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: hub.accent }}
          aria-hidden
        />
        {hub.name}
      </h3>
      <ul className="mt-4 flex flex-wrap gap-2">
        {hub.nodes.map((node) => {
          const icon = getBrandIcon(node.slug);
          return (
            <li
              key={node.label}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-[13px] text-foreground/85"
            >
              {icon && (
                <svg
                  viewBox="0 0 24 24"
                  width="13"
                  height="13"
                  fill={markFill(icon.hex)}
                  aria-hidden
                >
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

// Flat, native <details>: collapsed by default, but the text is in the DOM for
// search engines and find-in-page.
function SkillsIndex() {
  return (
    <details className="group mt-8">
      <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-lg text-sm font-semibold [&::-webkit-details-marker]:hidden">
        <ChevronRight
          className="size-4 text-muted transition-transform group-open:rotate-90 motion-reduce:transition-none"
          aria-hidden
        />
        All skills
        <span className="font-normal text-muted">({INDEX_COUNT})</span>
      </summary>
      <dl className="mt-5 grid gap-x-10 gap-y-5 md:grid-cols-2">
        {skillsIndex.map((group) => (
          <div key={group.name}>
            <dt className="font-mono text-xs tracking-[0.2em] text-accent-b uppercase">
              {group.name}
            </dt>
            <dd className="mt-1.5 text-sm leading-relaxed text-muted">
              {group.items.join(", ")}
            </dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

function CredentialList({
  title,
  items,
}: {
  title: string;
  items: Credential[];
}) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <BadgeCheck className="size-4 text-accent-b" aria-hidden />
        {title}
      </h3>
      <ul className="mt-3 grid gap-x-10 gap-y-2 text-sm leading-relaxed text-muted sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.text}>
            {item.href ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-a hover:underline"
              >
                {item.text}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              item.text
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
