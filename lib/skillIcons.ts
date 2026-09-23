// Brand marks for skill nodes, imported from simple-icons at build time — no
// runtime CDN, the export stays fully static. Only the icons actually used are
// imported, so the bundle carries nine SVG paths, not the whole set.
import {
  siClickup,
  siConfluence,
  siFirebase,
  siGoogleanalytics,
  siJira,
  siMetabase,
  siMixpanel,
  siNotion,
  siPython,
  type SimpleIcon,
} from "simple-icons";

export type BrandIcon = { path: string; hex: string; title: string };

const ICONS: Record<string, SimpleIcon> = {
  jira: siJira,
  confluence: siConfluence,
  googleanalytics: siGoogleanalytics,
  firebase: siFirebase,
  metabase: siMetabase,
  python: siPython,
  mixpanel: siMixpanel,
  clickup: siClickup,
  notion: siNotion,
};

/** Monochrome black marks (Notion) would vanish on the dark UI below this. */
const MIN_MARK_LUMINANCE = 0.01;

function relativeLuminance(hex: string): number {
  const n = parseInt(hex.replace("#", ""), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Fill for a brand mark: its desaturated colour, or the text colour when the mark is near-black. */
export function markFill(hex: string): string {
  return relativeLuminance(hex) < MIN_MARK_LUMINANCE ? "currentColor" : desaturate(hex);
}

export function getBrandIcon(slug?: string): BrandIcon | null {
  if (!slug) return null;
  const icon = ICONS[slug];
  return icon ? { path: icon.path, hex: `#${icon.hex}`, title: icon.title } : null;
}

/**
 * Desaturate a brand hex ~15% toward its own luminance so the logos sit in the
 * dark theme instead of glaring. Returns an rgb() string.
 */
export function desaturate(hex: string, amount = 0.15): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const mix = (c: number) => Math.round(c + (lum - c) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
}
