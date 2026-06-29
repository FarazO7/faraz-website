export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/** Inlined at build time; set for GitHub Pages project sites. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefix root-relative URLs that bypass Next's own basePath handling: plain
 * anchors, plain <img> srcs, and next/image srcs (unoptimized images skip the
 * loader that would prepend it).
 */
export function withBase(path: string): string {
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
