"use client";

import { useState } from "react";
import { identity } from "@/lib/content";
import { withBase } from "@/lib/utils";

// Hero avatar with a graceful source chain (Phase 2):
//   GitHub avatar endpoint (always current) → local headshot → "FA" monogram.
// onError walks the chain one step at a time. This is the hero image, so it
// loads eagerly with fetchpriority="high" — never lazy.
const GITHUB_AVATAR = `https://github.com/${identity.githubUsername}.png?size=400`;

type Stage = "github" | "local" | "monogram";

export default function Avatar() {
  const [stage, setStage] = useState<Stage>("github");

  const src =
    stage === "github" ? GITHUB_AVATAR : withBase(identity.headshotPath);

  return (
    <div
      className="w-fit shrink-0 rounded-full border-2 border-white/[0.18] p-1"
      style={{ boxShadow: "0 0 48px rgba(79, 124, 255, 0.28)" }}
    >
      {stage === "monogram" ? (
        <div
          role="img"
          aria-label={identity.headshotAlt}
          className="grid size-28 place-items-center rounded-full bg-white/[0.06] font-display text-3xl font-bold sm:size-32"
        >
          FA
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- external GitHub
        // avatar + static export; next/image gives no benefit here.
        <img
          src={src}
          alt={identity.headshotAlt}
          width={128}
          height={128}
          fetchPriority="high"
          decoding="async"
          onError={() =>
            setStage((s) => (s === "github" ? "local" : "monogram"))
          }
          className="size-28 rounded-full object-cover sm:size-32"
        />
      )}
    </div>
  );
}
