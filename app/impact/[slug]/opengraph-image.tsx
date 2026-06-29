import { identity, impactDetails } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderImpactOgImage } from "@/lib/ogImage";

// One static card per metric in the export.
export function generateStaticParams() {
  return impactDetails.map((d) => ({ slug: d.slug }));
}

export const dynamicParams = false;
// Required so the images are baked at build time under `output: export`.
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
