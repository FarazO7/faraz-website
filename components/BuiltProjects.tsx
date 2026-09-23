import { ArrowUpRight, ExternalLink } from "lucide-react";
import Section from "./Section";
import { GitHubMark } from "./icons";
import { projects, type Project } from "@/lib/content";

// Shipped products. Signal is the flagship (full-width featured card with live
// demo + repo); the rest are secondary cards. Reuses the existing glass card,
// spacing scale, and button styles — no new visual language.
export default function BuiltProjects() {
  const flagship = projects.find((p) => p.flagship);
  const rest = projects.filter((p) => !p.flagship);

  return (
    <Section id="built" kicker="Built" title="Products I've shipped">
      {flagship && <FeaturedCard project={flagship} />}
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {rest.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </Section>
  );
}

function FeaturedCard({ project }: { project: Project }) {
  return (
    <article className="glass glass-hover p-6 sm:p-8">
      <p className="font-mono text-xs tracking-wider uppercase text-accent-b">
        {project.tagline}
      </p>
      <h3 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        {project.name}
      </h3>
      {(project.subtitle || project.year) && (
        <p className="mt-1 text-sm font-medium text-foreground/85">
          {[project.subtitle, project.year].filter(Boolean).join(" · ")}
        </p>
      )}
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-[15px]">
        {project.description}
      </p>
      {project.highlights && project.highlights.length > 0 && (
        <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-4 text-sm leading-relaxed text-muted marker:text-white/30">
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      )}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-xl bg-accent-a px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3d6af0]"
          >
            Live demo
            <ExternalLink
              className="size-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-foreground transition-colors hover:border-white/25 hover:bg-white/[0.08]"
        >
          <GitHubMark className="size-4" />
          View repo
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      href={project.repo}
      target="_blank"
      rel="noopener noreferrer"
      className="glass glass-hover group flex flex-col p-6"
    >
      <p className="font-mono text-xs tracking-wider uppercase text-accent-b">
        {project.tagline}
      </p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold tracking-tight">
          {project.name}
        </h3>
        <GitHubMark className="size-4 shrink-0 text-muted transition-colors group-hover:text-foreground" />
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">
        {project.description}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-a">
        View repo
        <ArrowUpRight className="size-4" aria-hidden />
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
