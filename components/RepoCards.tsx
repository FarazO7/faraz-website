import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { GitHubMark } from "./icons";
import { curatedRepos } from "@/lib/content";

// A hand-curated, ordered set of repos (flagships first) with hand-written
// context, no live API fetch. Styled as the reference's listing rows: name and
// description left, "View repo" and a round arrow right.
export default function RepoCards() {
  return (
    <ul className="grid gap-3">
      {curatedRepos.map((repo, i) => (
        <li key={repo.name} data-reveal="up" style={{ "--i": i } as CSSProperties}>
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="panel g-border group flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between md:px-8"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h4 className="truncate text-[1.375rem] leading-snug tracking-[-0.02em]">{repo.name}</h4>
                <GitHubMark className="size-4 shrink-0 text-muted" />
              </div>
              <p className="prose-measure mt-1.5 leading-relaxed text-muted">{repo.description}</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-3 text-[0.9375rem] font-medium">
              View repo
              <span aria-hidden className="round">
                <ArrowUpRight className="size-4" />
              </span>
            </span>
            <span className="sr-only"> (opens GitHub in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
