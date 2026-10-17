"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import Section from "./Section";
import { GitHubMark } from "./icons";
import { projects, type Project } from "@/lib/content";
import { linkProps } from "@/lib/links";
import { cn } from "@/lib/utils";

const HOVER_DELAY_MS = 150; // a pointer just passing over doesn't open a card
const CLICK_GRACE_MS = 800; // a click right after hover-open keeps the card open

// Expanding cards after the reference's capability panels. Closed, a card
// shows the project name and a faint index number (a CSS counter); open, it
// shows everything. One card is open at a time. A mouse opens a card after a
// short hover with real movement (scrolling under a still cursor opens
// nothing) and the card stays open when the pointer leaves the list; touch
// and keyboard toggle it through the header button. Closed content is inert.
// Open, a card shows its description and links; every card opens to one
// height, the tallest card's content at the current width (--built-open).
// Taglines, subtitles, highlights and screenshots stay in the data, unshown.
const TONES = ["blue", "teal", "lilac", "sand"] as const;

export default function BuiltProjects() {
  const [open, setOpen] = useState<number | null>(null);
  const timer = useRef(0);
  const hoverOpenedAt = useRef(0);
  const listRef = useRef<HTMLOListElement>(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let width = 0;
    const measure = () => {
      list.style.removeProperty("--built-open");
      const heights = [...list.querySelectorAll<HTMLElement>(".product-content")].map((el) => el.offsetHeight);
      list.style.setProperty("--built-open", `${Math.max(...heights)}px`);
    };
    // Width changes only: the list's height also changes as cards open.
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width === width) return;
      width = entry.contentRect.width;
      measure();
    });
    observer.observe(list);
    document.fonts.ready.then(measure);
    return () => observer.disconnect();
  }, []);

  function onHover(index: number, event: PointerEvent) {
    if (event.pointerType !== "mouse" || (event.movementX === 0 && event.movementY === 0)) return;
    window.clearTimeout(timer.current);
    if (index === open) return;
    timer.current = window.setTimeout(() => {
      hoverOpenedAt.current = performance.now(); // same clock as event.timeStamp
      setOpen(index);
    }, HOVER_DELAY_MS);
  }

  function onToggle(index: number, event: MouseEvent) {
    window.clearTimeout(timer.current);
    // detail is 0 for Enter/Space, so keyboard toggles always toggle.
    const justHoverOpened = event.detail > 0 && event.timeStamp - hoverOpenedAt.current < CLICK_GRACE_MS;
    if (index === open && justHoverOpened) return;
    setOpen(index === open ? null : index);
  }

  return (
    <Section id="built" kicker="Built" title="Prototypes I've built" accent="built">
      <ol ref={listRef} className="products space-y-3 md:space-y-4" onPointerLeave={() => window.clearTimeout(timer.current)}>
        {projects.map((project, i) => (
          <li key={project.name} data-reveal="up" style={{ "--i": i } as CSSProperties}>
            <ProjectCard
              project={project}
              index={i}
              tone={TONES[i % TONES.length]}
              open={open === i}
              onHover={(event) => onHover(i, event)}
              onToggle={(event) => onToggle(i, event)}
            />
          </li>
        ))}
      </ol>
    </Section>
  );
}

function ProjectCard({
  project,
  index,
  tone,
  open,
  onHover,
  onToggle,
}: {
  project: Project;
  index: number;
  tone: (typeof TONES)[number];
  open: boolean;
  onHover: (event: PointerEvent) => void;
  onToggle: (event: MouseEvent) => void;
}) {
  const bodyId = `project-${index}`;
  return (
    <article className="product g-border" data-tone={tone} data-open={open ? "" : undefined} onPointerMove={onHover}>
      <div aria-hidden className={`product-wash product-wash-${tone}`}>
        <span className="product-sphere product-sphere-a sphere sphere-blue" />
        <span className="product-sphere product-sphere-b sphere sphere-sand" />
        <span className="product-sphere product-sphere-c sphere sphere-pink" />
      </div>
      <h3 className="relative">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={onToggle}
          className="product-head"
        >
          <span className="t-h2 mr-auto font-serif italic">{project.name}</span>
          <span aria-hidden className="product-num" />
          <Plus aria-hidden className="product-plus size-5" />
        </button>
      </h3>
      <div id={bodyId} className="product-body" inert={!open}>
        <div className="product-body-inner">
          <div className="product-content">
            <p className="prose-measure leading-relaxed text-muted">{project.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {project.demo && (
                <a {...linkProps(project.demo)} className="btn btn-primary">
                  Live demo
                  <ArrowUpRight className="size-4" aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              )}
              <a {...linkProps(project.repo)} className={cn("btn", project.demo ? "btn-ghost" : "btn-primary")}>
                <GitHubMark className="size-4" />
                View repo
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
