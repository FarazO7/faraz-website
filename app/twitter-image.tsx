import { identity } from "@/lib/content";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/ogImage";

// Reuse the Open Graph card for the Twitter (summary_large_image) card. Config
// consts are declared directly (Next can't follow re-exports).
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
