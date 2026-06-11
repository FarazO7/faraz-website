// ---------------------------------------------------------------------------
// Client-side GitHub data. Both APIs are CORS-open; everything degrades:
//   contributions: API → ghchart image → profile link (handled in the UI)
//   repos: fresh cache → live API → stale cache → static snapshot
// ---------------------------------------------------------------------------

import { fallbackRepos, identity } from "./content";

export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionData = {
  total: number;
  days: ContributionDay[];
};

export type Repo = {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  url: string;
  pushedAt: string;
};

/** "stale" = cache served after an API failure; "snapshot" = baked-in data. */
export type RepoSource = "live" | "cache" | "stale" | "snapshot";

const CONTRIB_API = `https://github-contributions-api.jogruber.de/v4/${identity.githubUsername}?y=last`;
const REPOS_API = `https://api.github.com/users/${identity.githubUsername}/repos?sort=updated&per_page=12`;
const CACHE_KEY = `gh-repos-${identity.githubUsername}-v1`;
const CACHE_TTL_MS = 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8_000;

function timeoutSignal(): AbortSignal | undefined {
  try {
    return AbortSignal.timeout(FETCH_TIMEOUT_MS);
  } catch {
    return undefined;
  }
}

type ContributionsPayload = {
  total?: Record<string, number>;
  contributions?: { date: string; count: number; level: number }[];
};

export async function fetchContributions(): Promise<ContributionData> {
  const res = await fetch(CONTRIB_API, { signal: timeoutSignal() });
  if (!res.ok) throw new Error(`Contributions API responded ${res.status}`);
  const payload = (await res.json()) as ContributionsPayload;
  const days = payload.contributions;
  const total = payload.total?.lastYear;
  if (!Array.isArray(days) || days.length === 0 || typeof total !== "number") {
    throw new Error("Unexpected contributions payload");
  }
  return {
    total,
    days: days.map((d) => ({
      date: d.date,
      count: d.count,
      level: Math.min(4, Math.max(0, d.level)) as ContributionDay["level"],
    })),
  };
}

export type Week = (ContributionDay | null)[];

/** Chunk a year of days into Sunday-started columns of 7 for the 53×7 grid. */
export function buildWeeks(days: ContributionDay[]): Week[] {
  const weeks: Week[] = [];
  let week: Week = [];
  const firstDay = new Date(`${days[0].date}T00:00:00`).getDay();
  for (let i = 0; i < firstDay; i++) week.push(null);
  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function monthLabels(
  weeks: Week[],
): { label: string; week: number }[] {
  const labels: { label: string; week: number }[] = [];
  let prevMonth = -1;
  weeks.forEach((week, i) => {
    const day = week.find((d) => d !== null);
    if (!day) return;
    const month = new Date(`${day.date}T00:00:00`).getMonth();
    if (month !== prevMonth) {
      labels.push({ label: MONTHS[month], week: i });
      prevMonth = month;
    }
  });
  // The first partial month would overlap the second label — drop it.
  if (labels.length > 1 && labels[1].week - labels[0].week < 3) labels.shift();
  return labels;
}

type CacheEntry = { savedAt: number; repos: Repo[] };

function readCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    return Array.isArray(entry.repos) && entry.repos.length > 0 ? entry : null;
  } catch {
    return null;
  }
}

function writeCache(repos: Repo[]): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), repos }));
  } catch {
    // Storage unavailable (private mode, quota) — caching is best-effort.
  }
}

/** Synchronous fallback: any cached copy, else the baked-in snapshot. */
export function getOfflineRepos(): { repos: Repo[]; source: RepoSource } {
  const cached = readCache();
  return cached
    ? { repos: cached.repos, source: "stale" }
    : { repos: fallbackRepos, source: "snapshot" };
}

type GitHubApiRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  pushed_at: string;
  fork: boolean;
};

/**
 * Never rejects. Serves a fresh cache without spending rate limit; otherwise
 * fetches, caches on success, and falls back through stale cache → snapshot.
 */
export async function loadRepos(): Promise<{
  repos: Repo[];
  source: RepoSource;
}> {
  const cached = readCache();
  if (cached && Date.now() - cached.savedAt < CACHE_TTL_MS) {
    return { repos: cached.repos, source: "cache" };
  }
  try {
    const res = await fetch(REPOS_API, {
      headers: { Accept: "application/vnd.github+json" },
      signal: timeoutSignal(),
    });
    if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);
    const payload = (await res.json()) as GitHubApiRepo[];
    const repos = payload
      .filter((r) => !r.fork)
      .sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at))
      .slice(0, 8)
      .map((r) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        url: r.html_url,
        pushedAt: r.pushed_at,
      }));
    if (repos.length === 0) throw new Error("No repositories returned");
    writeCache(repos);
    return { repos, source: "live" };
  } catch {
    return getOfflineRepos();
  }
}
