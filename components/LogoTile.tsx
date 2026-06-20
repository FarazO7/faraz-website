"use client";

import { useState } from "react";
import { withBase } from "@/lib/utils";

// Shows an organization's logo when its file exists in /public, and falls back
// to the monogram tile if the file is missing or fails to load — so the strip
// never shows a broken image while real logos are still being collected.
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
        onError={() => setFailed(true)}
        className="size-10 shrink-0 rounded-xl bg-white/[0.06] object-contain p-1.5 ring-1 ring-white/10"
      />
    );
  }

  return (
    <span
      className="grid size-10 shrink-0 place-items-center rounded-xl text-xs font-semibold"
      style={{ backgroundColor: `${accent}1F`, color: accent }}
    >
      {mark}
    </span>
  );
}