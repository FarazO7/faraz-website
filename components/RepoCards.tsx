"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { GitHubMark } from "./icons";
import {
  getOfflineRepos,
  loadRepos,
  type Repo,
  type RepoSource,
} from "@/lib/github";
import { languageColor } from "@/lib/utils";

const SKELETON_MAX_MS = 2_000;

export default function RepoCards() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [source, setSource] = useState<RepoSource>("live");

  useEffect(() => {
    let alive = true;
    let settled = false;

    // Skeletons show for at most 2s; after that the fallback engages. If the
    // live response lands later it still replaces the fallback.
    const timer = setTimeout(() => {
      if (alive && !settled) {
        const offline = getOfflineRepos();
        setRepos(offline.repos);
        setSource(offline.source);
      }
    }, SKELETON_MAX_MS);

    loadRepos().then(({ repos, source }) => {
      if (alive) {
        settled = true;
        setRepos(repos);
        setSource(source);
      }
    });

    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  if (repos === null) {
    return (
      <div className="grid gap-4 sm:grid-cols-2" aria-hidden>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass p-5">
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton mt-3 h-3 w-full" />
            <div className="skeleton mt-2 h-3 w-2/3" />
            <div className="skeleton mt-4 h-3 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {repos.map((repo) => (
          <RepoCard key={repo.name} repo={repo} />
        ))}
      </div>
      {(source === "stale" || source === "snapshot") && (
        <p className="mt-3 font-mono text-xs text-muted">
          Showing {source === "stale" ? "cached" : "snapshot"} data — the
          GitHub API is unavailable right now.
        </p>
      )}
    </>
  );
}

function RepoCard({ repo }: { repo: Repo }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass glass-hover group flex flex-col p-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h4 className="truncate font-mono text-sm font-medium">{repo.name}</h4>
        <GitHubMark className="size-4 shrink-0 text-muted transition-colors group-hover:text-foreground" />
      </div>
      <p className="mt-2 line-clamp-2 min-h-10 text-[13px] leading-relaxed text-muted">
        {repo.description ?? "No description provided."}
      </p>
      <div className="mt-auto flex items-center gap-4 pt-3 font-mono text-xs text-muted">
        {repo.language && (
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className="size-2.5 rounded-full"
              style={{ background: languageColor(repo.language) }}
            />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && (
          <span className="inline-flex items-center gap-1">
            <Star className="size-3.5" aria-hidden />
            {repo.stars}
            <span className="sr-only"> stars</span>
          </span>
        )}
      </div>
      <span className="sr-only"> (opens GitHub in a new tab)</span>
    </a>
  );
}
