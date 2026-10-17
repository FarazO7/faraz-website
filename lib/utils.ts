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

/**
 * Cut `text` around the given exact phrases, in order, so a component can
 * style them: "a b c" + ["b"] → [{a }, {b, match}, { c}].
 */
export function splitByPhrases(text: string, phrases: string[]): { text: string; match: boolean }[] {
  if (phrases.length === 0) return [{ text, match: false }];
  const escaped = phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return text
    .split(new RegExp(`(${escaped.join("|")})`))
    .filter(Boolean)
    .map((part) => ({ text: part, match: phrases.includes(part) }));
}
