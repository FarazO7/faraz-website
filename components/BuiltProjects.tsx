import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import Section from "./Section";
import { GitHubMark } from "./icons";
import { projects, type Project } from "@/lib/content";
import { withBase } from "@/lib/utils";

// The reference's numbered capability panels, one per project, Signal first.
// Hover or focus (or simply a touch screen) brings up the panel's pastel wash,
// lifts its spheres and colours its numeral; nothing ever collapses, so every
// description stays readable. The numeral is a CSS counter, not DOM text.
const TONES = ["blue", "teal", "lilac", "sand"] as const;

export default function BuiltProjects() {
  const flagship = projects.find((p) => p.flagship);
  const rest = projects.filter((p) => !p.flagship);

  return (
    <Section id="built" kicker="Built" title="Prototypes I've built" accent="built">
      <ol className="products space-y-3 md:space-y-4">
        {flagship && (
          <li data-reveal="up">
            <FeaturedPanel project={flagship} />
          </li>
        )}
        {rest.map((project, i) => (
          <li key={project.name} data-reveal="up" style={{ "--i": i + 1 } as CSSProperties}>
            <ProjectPanel project={project} tone={TONES[(i + 1) % TONES.length]} />
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Backdrop({ tone }: { tone: (typeof TONES)[number] }) {
  return (
    <div aria-hidden className={`product-wash product-wash-${tone}`}>
      <span className="product-sphere product-sphere-a sphere sphere-blue" />
      <span className="product-sphere product-sphere-b sphere sphere-sand" />
      <span className="product-sphere product-sphere-c sphere sphere-pink" />
    </div>
  );
}

function FeaturedPanel({ project }: { project: Project }) {
  return (
    <article className="product g-border" data-tone="blue">
      <Backdrop tone="blue" />
      <span aria-hidden className="product-num" />
      <div className="relative grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div>
          <p className="kicker">{project.tagline}</p>
          <h3 className="t-h2 mt-4 font-serif italic">{project.name}</h3>
          {(project.subtitle || project.year) && (
            <p className="mt-3 font-medium">{[project.subtitle, project.year].filter(Boolean).join(" · ")}</p>
          )}
          <p className="prose-measure mt-4 leading-relaxed text-muted">{project.description}</p>
          {project.highlights && project.highlights.length > 0 && (
            <ul className="prose-measure mt-5 space-y-3">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 leading-relaxed">
                  <span aria-hidden className="sparkle mt-1.5" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Live demo
                <ArrowUpRight className="size-4" aria-hidden />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
            <a href={project.repo} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              <GitHubMark className="size-4" />
              View repo
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
        {project.screenshot && (
          <figure data-reveal="image" className="g-border overflow-hidden rounded-[var(--radius)] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
            <img
              src={withBase(project.screenshot.src)}
              alt={project.screenshot.alt}
              width={1040}
              height={670}
              loading="lazy"
              decoding="async"
              className="h-auto w-full"
            />
          </figure>
        )}
      </div>
    </article>
  );
}

// The whole panel is one link to the repo; its text order (tagline, name,
// description, "View repo") is unchanged, so its accessible name is too.
function ProjectPanel({ project, tone }: { project: Project; tone: (typeof TONES)[number] }) {
  return (
    <a
      href={project.repo}
      target="_blank"
      rel="noopener noreferrer"
      className="product g-border group block"
      data-tone={tone}
    >
      <Backdrop tone={tone} />
      <span aria-hidden className="product-num" />
      <div className="relative">
        <p className="kicker">{project.tagline}</p>
        <div className="mt-3 flex items-center gap-3 pr-16">
          <h3 className="t-h2 font-serif italic">{project.name}</h3>
          <GitHubMark className="size-5 shrink-0 text-muted" />
        </div>
        <p className="prose-measure mt-3 leading-relaxed text-muted">{project.description}</p>
        <span className="mt-6 inline-flex items-center gap-3 font-medium">
          View repo
          <span aria-hidden className="round">
            <ArrowUpRight className="size-4" />
          </span>
        </span>
        <span className="sr-only"> (opens in a new tab)</span>
      </div>
    </a>
  );
}
