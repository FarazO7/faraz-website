import { BadgeCheck } from "lucide-react";
import Section from "./Section";
import {
  skills,
  certifications,
  type Credential,
  type SkillHub,
} from "@/lib/content";
import { getBrandIcon, desaturate } from "@/lib/skillIcons";

// Static, scannable replacement for the animated constellation: each hub is a
// glass card with its tools as chips (brand mark when one exists, else text).
export default function Skills() {
  return (
    <Section id="skills" kicker="Toolkit" title="Skills & Credentials">
      <div className="grid gap-4 sm:grid-cols-2">
        {skills.map((hub) => (
          <HubCard key={hub.name} hub={hub} />
        ))}
      </div>
      <div className="mt-12 border-t border-white/[0.07] pt-10">
        <CredentialList title="Certifications" items={certifications} />
      </div>
    </Section>
  );
}

function HubCard({ hub }: { hub: SkillHub }) {
  return (
    <div className="glass p-6">
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
                  fill={desaturate(icon.hex)}
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