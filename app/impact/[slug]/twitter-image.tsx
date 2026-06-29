import { identity, impactDetails } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderImpactOgImage } from "@/lib/ogImage";

// Reuse the per-metric Open Graph card for the Twitter (summary_large_image)
// card. Config consts are declared directly (Next can't follow re-exports).
export function generateStaticParams() {
  return impactDetails.map((d) => ({ slug: d.slug }));
}

export const dynamicParams = false;
export const dynamic = "force-static";
export const alt = `Impact case study — ${identity.name}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return renderImpactOgImage(params);
}
