"use client";

import { useId, useState, type CSSProperties } from "react";
import { ArrowUpRight, ChevronDown, FileText } from "lucide-react";
import Section from "./Section";
import { caseStudies, type CaseStudy } from "@/lib/content";
import { cn, withBase } from "@/lib/utils";

// Editorial grid after the reference's image tiles: two columns, the second
// set lower, previews revealed with the reference's scale-in. Each preview is
// page 1 of the case-study PDF (public/previews).
export default function CaseStudies() {
  return (
    <Section id="work" kicker="Case Studies" title="Selected Work" accent="Work">
      <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-20">
        {caseStudies.map((study, i) => (
          <CaseStudyCard key={study.title} study={study} offset={i % 2 === 1} />
        ))}
      </div>
    </Section>
  );
}

function CaseStudyCard({ study, offset }: { study: CaseStudy; offset: boolean }) {
  const [open, setOpen] = useState(false);
  const docsId = useId();

  return (
    <article className={cn("flex flex-col", offset && "md:mt-24")}>
      <div
        data-reveal="image"
        className="g-border overflow-hidden rounded-[var(--radius)] bg-surface-3"
      >
        <div className="aspect-[4/3] overflow-hidden rounded-[var(--radius)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, basePath handled via withBase */}
          <img
            src={withBase(`/previews/${study.slug}.webp`)}
            alt={`First page of ${study.title} case study`}
            loading="lazy"
            decoding="async"
            className="size-full object-cover object-top"
          />
        </div>
      </div>

      <div className="mt-6" data-reveal="up">
        {study.subtitle && <p className="kicker">{study.subtitle}</p>}
        <h3 className="t-h3 mt-3">{study.title}</h3>
        {study.summary && (
          <p className="prose-measure mt-3 leading-relaxed text-muted">{study.summary}</p>
        )}
        {study.href && (
          <a
            href={study.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost mt-6"
          >
            Open case study
            <ArrowUpRight className="size-4" aria-hidden />
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
              className="btn btn-ghost mt-6"
            >
              {open ? "Hide" : "View"} {study.docs.length} documents
              <ChevronDown
                className={cn("size-4 transition-transform duration-500", open && "rotate-180")}
                aria-hidden
              />
            </button>
            <ul id={docsId} hidden={!open} className="mt-4 divide-y divide-line border-y border-line">
              {study.docs.map((doc, i) => (
                <li key={doc.href}>
                  <a
                    href={doc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 py-3"
                    style={{ "--i": i } as CSSProperties}
                  >
                    <FileText className="size-4 text-primary" aria-hidden />
                    <span className="flex-1">{doc.title}</span>
                    <span className="sr-only"> (PDF, opens in a new tab)</span>
                    <ArrowUpRight aria-hidden className="size-4 transition-transform duration-500 group-hover:translate-x-0.5" />
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
