import { Award, BadgeCheck, type LucideIcon } from "lucide-react";
import Section from "./Section";
import {
  achievements,
  certifications,
  skills,
  type Credential,
} from "@/lib/content";

export default function Skills() {
  return (
    <Section id="skills" kicker="Capabilities" title="Skills & Credentials">
      <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
        {skills.map((group) => (
          <div key={group.name}>
            <h3 className="font-mono text-xs font-medium tracking-[0.18em] uppercase text-muted">
              {group.name}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.items.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[13px] text-muted"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 grid gap-8 border-t border-white/[0.07] pt-10 md:grid-cols-2">
        <CredentialList icon={Award} title="Achievements" items={achievements} />
        <CredentialList
          icon={BadgeCheck}
          title="Certifications"
          items={certifications}
        />
      </div>
    </Section>
  );
}

function CredentialList({
  icon: Icon,
  title,
  items,
}: {
  icon: LucideIcon;
  title: string;
  items: Credential[];
}) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4 text-accent-b" aria-hidden />
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
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
