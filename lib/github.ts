// ---------------------------------------------------------------------------
// Client-side GitHub data for the contribution heatmap. The API is CORS-open
// and degrades: API → ghchart image → profile link (handled in the UI). The
// repo grid is curated statically (see curatedRepos in content.ts).
// ---------------------------------------------------------------------------

import { identity } from "./content";

export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionData = {
  total: number;
  days: ContributionDay[];
};

const CONTRIB_API = `https://github-contributions-api.jogruber.de/v4/${identity.githubUsername}?y=last`;
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
  if (days.length === 0) return [];
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
