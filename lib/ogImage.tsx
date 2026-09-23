import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getImpactDetail, identity } from "./content";

// Shared 1200×630 social-card renderer, reused by the home and impact-page
// opengraph-image / twitter-image routes. No custom font is supplied, so
// next/og's bundled default font is used (keeps the card build self-contained).
export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

export function renderOgImage({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#070B14",
          backgroundImage:
            "radial-gradient(circle at 22% 28%, rgba(79,124,255,0.28), transparent 55%), radial-gradient(circle at 85% 80%, rgba(24,198,180,0.20), transparent 55%)",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#18C6B4",
            fontWeight: 600,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 88,
            fontWeight: 800,
            color: "#FFFFFF",
            lineHeight: 1.04,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 30,
            color: "#9AA4B8",
            lineHeight: 1.4,
            maxWidth: 920,
          }}
        >
          {subtitle}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 52,
            fontSize: 22,
            color: "#5B6678",
          }}
        >
          {new URL(identity.siteUrl).host}
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}

// Shared body for the impact-page og/twitter image routes (config consts must
// be declared literally per route file — Next can't follow re-exports — so only
// the render body is shared here).
export async function renderImpactOgImage(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  const detail = getImpactDetail(slug);
  if (!detail) notFound();

  return renderOgImage({
    eyebrow: `${identity.name} · Impact`,
    title: detail.metric,
    subtitle: detail.outcome,
  });
}
