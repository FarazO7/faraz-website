export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/** Inlined at build time; set for GitHub Pages project sites. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix public-asset hrefs that bypass next/image and next/link. */
export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}

const TOOLTIP_DATE = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

/** "2026-06-11" → "June 11, 2026" (parsed as local time, not UTC) */
export function formatTooltipDate(isoDate: string): string {
  return TOOLTIP_DATE.format(new Date(`${isoDate}T00:00:00`));
}

/** GitHub-linguist colors for the languages that appear in the repo set. */
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  TypeScript: "#3178c6",
};

export function languageColor(language: string): string {
  return LANGUAGE_COLORS[language] ?? "#8b949e";
}
