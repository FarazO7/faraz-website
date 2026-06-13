// Brand marks for skill nodes, imported from simple-icons at build time — no
// runtime CDN, the export stays fully static. Only the icons actually used are
// imported, so the bundle carries seven SVG paths, not the whole set.
import {
  siConfluence,
  siFirebase,
  siGoogleanalytics,
  siJira,
  siMetabase,
  siMixpanel,
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
};

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
