import { ArrowUpRight } from "lucide-react";
import { GitHubMark } from "./icons";
import { curatedRepos } from "@/lib/content";

// A hand-curated, ordered set of repos (flagships first) with hand-written
// context — no live API fetch, so the grid never depends on push recency.
export default function RepoCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {curatedRepos.map((repo) => (
        <a
          key={repo.name}
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="glass glass-nested glass-hover group flex flex-col p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <h4 className="truncate font-mono text-sm font-medium">
              {repo.name}
            </h4>
            <GitHubMark className="size-4 shrink-0 text-muted transition-colors group-hover:text-foreground" />
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-muted">
            {repo.description}
          </p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-3 font-mono text-xs text-accent-a">
            View repo
            <ArrowUpRight className="size-3.5" aria-hidden />
          </span>
          <span className="sr-only"> (opens GitHub in a new tab)</span>
        </a>
      ))}
    </div>
  );
}
