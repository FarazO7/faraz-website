import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Numeral from "./Numeral";
import { getRole, metricGroups, metricLabel, type Metric } from "@/lib/content";
import { cn } from "@/lib/utils";

// The reference's "numbers" bento: one group per role (employer and dates as
// the heading, current role first), four tiles each on a three-column grid.
// Spans alternate 2+1 / 1+2 and mirror for the next group; surfaces cycle the
// reference's pastels with one inverted ink tile. Every tile is one link to
// its impact page, with the same accessible name as before.
const SPANS = [
  [2, 1, 1, 2],
  [1, 2, 2, 1],
];
const TONES = [
  ["bg-blue-50", "bg-ink text-white", "bg-pink-50", "bg-surface-3"],
  ["bg-pink-50", "bg-surface-3", "bg-blue-50", "bg-ink text-white"],
];

export default function Metrics() {
  return (
    <div className="space-y-14 md:space-y-20">
      {metricGroups.map((group, g) => (
        <div key={group.org}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line pb-4" data-reveal="fade">
            <h3 className="t-h3">{group.label}</h3>
            <p className="t-label">{getRole(group.org)?.dates}</p>
          </div>
          <ul className="mt-5 grid gap-3 md:grid-cols-3 md:gap-4">
            {group.metrics.map((metric, i) => (
              <li key={metric.slug} className={SPANS[g % 2][i] === 2 ? "md:col-span-2" : undefined}>
                <MetricTile metric={metric} tone={TONES[g % 2][i]} index={i} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function MetricTile({ metric, tone, index }: { metric: Metric; tone: string; index: number }) {
  const dark = tone.includes("bg-ink");
  return (
    <Link
      href={`/impact/${metric.slug}`}
      aria-label={metricLabel(metric)}
      data-reveal="up"
      style={{ "--i": index, "--num-color": dark ? "#fff" : "var(--ink)" } as CSSProperties}
      className={cn(
        "group lift flex h-full min-h-[15rem] flex-col justify-between gap-8 rounded-[var(--radius)] p-6 md:min-h-[17.5rem] md:p-8",
        tone,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="t-numeral">
          <Numeral metric={metric} />
        </p>
        <span aria-hidden className={cn("round", dark ? "bg-white/15" : "bg-white/80")}>
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div>
        <p className="t-lead">{metric.label}</p>
        <p className={cn("mt-2 max-w-[52ch] text-base leading-relaxed", dark ? "text-[var(--on-dark-muted)]" : "text-muted")}>
          {metric.detail}
        </p>
      </div>
    </Link>
  );
}
