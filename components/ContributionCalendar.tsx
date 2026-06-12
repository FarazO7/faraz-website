"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight } from "lucide-react";
import {
  buildWeeks,
  fetchContributions,
  monthLabels,
  type ContributionData,
  type ContributionDay,
} from "@/lib/github";
import { identity } from "@/lib/content";
import { formatTooltipDate } from "@/lib/utils";

const CELL = 11;
const GAP = 3;
const STEP = CELL + GAP;

type Mode = "loading" | "grid" | "img" | "link";
type Tip = { x: number; y: number; label: string };

export default function ContributionCalendar() {
  const [mode, setMode] = useState<Mode>("loading");
  const [data, setData] = useState<ContributionData | null>(null);
  const [tip, setTip] = useState<Tip | null>(null);

  useEffect(() => {
    let alive = true;
    fetchContributions()
      .then((d) => {
        if (alive) {
          setData(d);
          setMode("grid");
        }
      })
      .catch(() => {
        if (alive) setMode("img");
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="glass p-5 sm:p-6">
      <h3 className="text-sm font-medium">
        {mode === "grid" && data ? (
          <>
            <span className="font-mono text-2xl font-bold text-accent-c">
              {data.total.toLocaleString("en-US")}
            </span>{" "}
            <span className="text-muted">contributions in the last year</span>
          </>
        ) : (
          <span className="text-muted">Contributions in the last year</span>
        )}
      </h3>
      <div className="mt-4">
        {mode === "loading" && (
          <div className="skeleton h-[140px] w-full" aria-hidden />
        )}
        {mode === "grid" && data && (
          <>
            <Grid days={data.days} total={data.total} onTip={setTip} />
            <div
              aria-hidden
              className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[10px] text-muted"
            >
              Less
              {[0, 1, 2, 3, 4].map((level) => (
                <span
                  key={level}
                  className="inline-block rounded-[3px]"
                  style={{
                    width: CELL,
                    height: CELL,
                    background: cellColor(level),
                  }}
                />
              ))}
              More
            </div>
          </>
        )}
        {mode === "img" && (
          /* eslint-disable-next-line @next/next/no-img-element -- live-generated external chart, not a static asset */
          <img
            src={`https://ghchart.rshah.org/26a641/${identity.githubUsername}`}
            alt={`GitHub contribution chart for ${identity.githubUsername}`}
            className="w-full"
            loading="lazy"
            onError={() => setMode("link")}
          />
        )}
        {mode === "link" && (
          <a
            href={identity.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-accent-a hover:underline"
          >
            View contribution activity on GitHub
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        )}
      </div>
      {/* .glass is transformed, which would re-root position:fixed — portal the
          tooltip to <body> so viewport coordinates stay correct. */}
      {tip &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="pointer-events-none fixed z-[60] -translate-x-1/2 -translate-y-full rounded-md border border-white/10 bg-[#0d1220] px-2 py-1 font-mono text-[11px] whitespace-nowrap"
            style={{ left: tip.x, top: tip.y }}
            role="tooltip"
          >
            {tip.label}
          </div>,
          document.body,
        )}
    </div>
  );
}

function cellColor(level: number): string {
  // Empty days: darkest step at reduced opacity so cells still read on glass.
  return level === 0 ? "rgba(22, 27, 34, 0.55)" : `var(--gh-${level})`;
}

function tipLabel(day: ContributionDay): string {
  const noun = day.count === 1 ? "contribution" : "contributions";
  return `${day.count} ${noun} on ${formatTooltipDate(day.date)}`;
}

// Memoized so tooltip state changes in the parent don't re-render ~371 cells
// on every mouseenter (days and the setState-backed onTip are stable).
const Grid = memo(function Grid({
  days,
  total,
  onTip,
}: {
  days: ContributionDay[];
  total: number;
  onTip: (tip: Tip | null) => void;
}) {
  const weeks = useMemo(() => buildWeeks(days), [days]);
  const labels = useMemo(() => monthLabels(weeks), [weeks]);

  return (
    <div className="overflow-x-auto pb-1">
      <div
        role="img"
        aria-label={`Contribution calendar: ${total} contributions in the last year`}
        style={{ width: weeks.length * STEP - GAP }}
      >
        <div aria-hidden className="relative h-4">
          {labels.map((l) => (
            <span
              key={`${l.label}-${l.week}`}
              className="absolute font-mono text-[10px] text-muted"
              style={{ left: l.week * STEP }}
            >
              {l.label}
            </span>
          ))}
        </div>
        <div aria-hidden className="mt-1 flex" style={{ gap: GAP }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
              {week.map((day, di) =>
                day ? (
                  <div
                    key={day.date}
                    className="rounded-[3px]"
                    style={{
                      width: CELL,
                      height: CELL,
                      background: cellColor(day.level),
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      onTip({
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8,
                        label: tipLabel(day),
                      });
                    }}
                    onMouseLeave={() => onTip(null)}
                  />
                ) : (
                  <div key={di} style={{ width: CELL, height: CELL }} />
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
