"use client";

import { useId, useState } from "react";
import { ArrowUpRight, ChevronDown, FileText } from "lucide-react";
import Carousel from "./Carousel";
import Section from "./Section";
import { caseStudies, type CaseStudy } from "@/lib/content";
import { linkProps } from "@/lib/links";
import { cn, withBase } from "@/lib/utils";

// Previews are page 1 of each case-study PDF (public/previews, 800×449). The
// frame takes that shape and the image is contained, so a preview of another
// shape is letterboxed, never cropped.
const PREVIEW = { width: 800, height: 449 };

export default function CaseStudies() {
  return (
    <Section id="work" kicker="Case Studies" title="Selected Work" accent="Work">
      <Carousel
        label="Case studies"
        itemClassName="w-[86cqw] sm:w-[calc((100cqw-1rem)/2.15)]"
        items={caseStudies.map((study) => (
          <CaseStudyCard key={study.title} study={study} />
        ))}
      />
    </Section>
  );
}

// The card is one click target: its "Open case study" link stretches over it
// (no nested links). Zomato has four documents rather than one destination,
// so its card keeps the documents toggle instead.
function CaseStudyCard({ study }: { study: CaseStudy }) {
  const [open, setOpen] = useState(false);
  const docsId = useId();

  return (
    <article className="relative flex h-full flex-col">
      <div className="g-border overflow-hidden rounded-[var(--radius)] bg-surface-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, basePath handled via withBase */}
        <img
          src={withBase(`/previews/${study.slug}.webp`)}
          alt={`First page of ${study.title} case study`}
          width={PREVIEW.width}
          height={PREVIEW.height}
          loading="lazy"
          decoding="async"
          className="aspect-[800/449] h-auto w-full object-contain"
        />
      </div>

      <div className="mt-6 flex flex-1 flex-col">
        {study.subtitle && <p className="kicker">{study.subtitle}</p>}
        <h3 className="t-h3 mt-3">{study.title}</h3>
        {study.summary && <p className="prose-measure mt-3 leading-relaxed text-muted">{study.summary}</p>}
        <div className="mt-auto pt-6">
          {study.href && (
            <a {...linkProps(study.href)} className="btn btn-ghost stretched">
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
                className="btn btn-ghost"
              >
                {open ? "Hide" : "View"} {study.docs.length} documents
                <ChevronDown
                  className={cn("size-4 transition-transform duration-500 motion-reduce:transition-none", open && "rotate-180")}
                  aria-hidden
                />
              </button>
              <ul id={docsId} hidden={!open} className="mt-4 divide-y divide-line border-y border-line">
                {study.docs.map((doc) => (
                  <li key={doc.href}>
                    <a {...linkProps(doc.href)} className="group flex items-center gap-3 py-3">
                      <FileText className="size-4 text-primary" aria-hidden />
                      <span className="flex-1">{doc.title}</span>
                      <span className="sr-only"> (PDF, opens in a new tab)</span>
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 motion-reduce:transition-none"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
