"use client";

import { useState } from "react";
import { withBase } from "@/lib/utils";

// Shows an organization's logo when its file exists in /public, and falls back
// to the monogram (ink on a tint of the org's accent) if the file is missing
// or fails to load, so the strip never shows a broken image.
export default function LogoTile({
  logo,
  mark,
  accent,
  name,
}: {
  logo?: string;
  mark: string;
  accent: string;
  name: string;
}) {
  const [failed, setFailed] = useState(false);

  if (logo && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export, basePath via withBase
      <img
        src={withBase(logo)}
        alt={`${name} logo`}
        width={40}
        height={40}
        loading="lazy"
        onError={() => setFailed(true)}
        className="size-9 shrink-0 rounded-full bg-white object-contain p-1.5 ring-1 ring-line sm:size-10"
      />
    );
  }

  return (
    <span
      className="grid size-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-ink sm:size-10"
      style={{ backgroundColor: `${accent}66` }}
    >
      {mark}
    </span>
  );
}
