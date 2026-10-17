import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getImpactDetail, identity } from "./content";

// Shared 1200×630 social-card renderer, reused by the home and impact-page
// opengraph-image / twitter-image routes, in the site's light palette. No
// custom font is supplied, so next/og's bundled default font is used (keeps
// the card build self-contained).
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
          backgroundColor: "#FFFFFF",
          backgroundImage:
            "radial-gradient(circle at 12% 18%, rgba(118,168,243,0.28), transparent 45%), radial-gradient(circle at 92% 88%, rgba(255,163,184,0.26), transparent 45%)",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#5B6066",
            fontWeight: 500,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 88,
            fontWeight: 500,
            color: "#111212",
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 30,
            color: "#5B6066",
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
            color: "#5B6066",
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
