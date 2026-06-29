import { identity } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/ogImage";

// Required so the image is baked at build time under `output: export`.
export const dynamic = "force-static";
export const alt = `${identity.name} — ${identity.title}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: identity.title,
    title: identity.name,
    subtitle: identity.positioning,
  });
}
