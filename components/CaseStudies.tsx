"use client";

import { useId, useState } from "react";
import { ChevronDown, ExternalLink, FileText } from "lucide-react";
import Section from "./Section";
import { caseStudies, type CaseStudy } from "@/lib/content";
import { cn, withBase } from "@/lib/utils";

export default function CaseStudies() {
  return (
    <Section id="work" kicker="Case Studies" title="Selected Work">
      <div className="grid gap-5 md:grid-cols-2">
        {caseStudies.map((study) => (
          <CaseStudyCard key={study.title} study={study} />
        ))}
      </div>
    </Section>
  );
}

function CaseStudyCard({ study }: { study: CaseStudy }) {
  const [open, setOpen] = useState(false);
  const docsId = useId();

  return (
    <article className="glass glass-nested glass-hover flex flex-col overflow-hidden">
      {/* Preview: page 1 of the case-study PDF (generated into public/previews). */}
      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/10 bg-white/[0.03]">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, basePath handled via withBase */}
        <img
          src={withBase(`/previews/${study.slug}.webp`)}
          alt={`First page of ${study.title} case study`}
          loading="lazy"
          decoding="async"
          className="size-full object-cover object-top"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-[#0b0f1a]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold">{study.title}</h3>
        {study.subtitle && (
          <p className="mt-1.5 font-mono text-xs tracking-wider uppercase text-accent-b">
            {study.subtitle}
          </p>
        )}
        {study.summary && (
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {study.summary}
          </p>
        )}
        {study.href && (
          <a
            href={study.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-medium text-accent-a hover:underline"
          >
            Open case study
            <ExternalLink className="size-4" aria-hidden />
            <span className="sr-only">(PDF, opens in a new tab)</span>
          </a>
        )}
        {study.docs && (
          <>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls={docsId}
              className="mt-4 inline-flex w-fit items-center gap-2 text-sm font-medium text-accent-a"
            >
              {open ? "Hide" : "View"} {study.docs.length} documents
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  open && "rotate-180",
                )}
                aria-hidden
              />
            </button>
            <ul
              id={docsId}
              hidden={!open}
              className="mt-3 space-y-2 border-t border-white/10 pt-3"
            >
              {study.docs.map((doc) => (
                <li key={doc.href}>
                  <a
                    href={doc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    <FileText className="size-4 text-accent-a" aria-hidden />
                    {doc.title}
                    <span className="sr-only"> (PDF, opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </article>
  );
}
