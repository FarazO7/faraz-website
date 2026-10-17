import type { CSSProperties } from "react";
import Carousel from "./Carousel";
import Section from "./Section";
import { certifications, skills, type Certification, type SkillHub } from "@/lib/content";
import { linkProps } from "@/lib/links";
import { getBrandIcon, markFill } from "@/lib/skillIcons";
import { withBase } from "@/lib/utils";

// Reading-first: one pastel card per resume skill group (the reference's
// benefit cards) with each skill as a white pill and a brand mark where one
// exists, then the certifications as a carousel of cards.
const TONES = ["bg-blue-50", "bg-pink-50", "bg-surface-3", "bg-surface-2"];

export default function Skills() {
  return (
    <Section id="skills" title="Skills & Credentials" accent="&">
      <div className="grid gap-3 md:grid-cols-2 md:gap-4">
        {skills.map((hub, i) => (
          <HubCard key={hub.name} hub={hub} tone={TONES[i % TONES.length]} index={i} />
        ))}
      </div>
      <div className="mt-14 border-t border-line pt-10">
        <h3 className="kicker">Certifications</h3>
        <div className="mt-6">
          <Carousel
            label="Certifications"
            itemClassName="w-[72cqw] sm:w-[calc((100cqw-2rem)/3.3)]"
            items={certifications.map((cert) => (
              <CertificationCard key={cert.href} cert={cert} />
            ))}
          />
        </div>
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

// The whole card links to the certificate, in a new tab. The image is a local
// copy, shown whole (contained) in a consistent 4:3 frame.
function CertificationCard({ cert }: { cert: Certification }) {
  return (
    <a {...linkProps(cert.href)} className="panel g-border lift group flex h-full flex-col p-4">
      <span className="relative block aspect-[4/3] overflow-hidden rounded-[calc(var(--radius)-0.5rem)] bg-surface-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, basePath via withBase */}
        <img
          src={withBase(cert.image)}
          alt={`${cert.name} certificate`}
          width={800}
          height={600}
          loading="lazy"
          decoding="async"
          // Pinned to the frame so object-contain letterboxes any shape.
          className="absolute inset-0 size-full object-contain"
        />
      </span>
      <span className="mt-4 block leading-snug font-medium">{cert.name}</span>
      <span className="mt-1 block text-[0.9375rem] text-muted">{cert.issuer}</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
