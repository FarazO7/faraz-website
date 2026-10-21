"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Numeral from "./Numeral";
import { revealNow } from "./RevealController";
import { currentRole, getRole, metricGroups, metricLabel, type Metric } from "@/lib/content";
import { cn } from "@/lib/utils";

// One tab per company (name and dates), current role first: a WAI-ARIA
// tablist with roving tabindex, arrow keys, Home and End. Each panel is the
// company's bento of four tiles, every tile one link to its impact page. Both
// panels share one grid cell, so the section is always as tall as the taller
// panel and switching never moves the page; the inactive panel fades out and
// is then visibility:hidden and inert. Switching replays the tiles' rise and
// odometer (instant under reduced motion).
// Five columns, so the narrow tiles take two fifths of a row, not a third.
const SPANS = [
  [3, 2, 2, 3],
  [2, 3, 3, 2],
];
const TONES = [
  ["bg-blue-50", "bg-ink text-white", "bg-pink-50", "bg-surface-3"],
  ["bg-pink-50", "bg-surface-3", "bg-blue-50", "bg-ink text-white"],
];
const DEFAULT_TAB = Math.max(
  0,
  metricGroups.findIndex((group) => group.org === currentRole.id),
);

export default function Metrics() {
  const [active, setActive] = useState(DEFAULT_TAB);
  // Bumped on every switch; it keys the active panel's tiles so they remount
  // and reveal again.
  const [switches, setSwitches] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const id = useId();

  useEffect(() => {
    const panel = panels.current[active];
    if (switches > 0 && panel) revealNow(panel);
  }, [active, switches]);

  function select(index: number) {
    if (index === active) return;
    setActive(index);
    setSwitches((n) => n + 1);
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = metricGroups.length - 1;
    const targets: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    const next = targets[event.key];
    if (next === undefined) return;
    event.preventDefault();
    select(next);
    tabs.current[next]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Impact by company"
        // Phones from 360px: both tabs side by side, sized to their content.
        className="mb-4 grid grid-cols-1 gap-2 min-[360px]:grid-cols-[auto_auto] min-[360px]:justify-start sm:flex sm:flex-wrap"
      >
        {metricGroups.map((group, i) => {
          const selected = i === active;
          return (
            <button
              key={group.org}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={selected}
              aria-controls={`${id}-panel-${i}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={onKeyDown}
              className={cn("tab", selected && "tab-active")}
            >
              <span className="block text-[0.9375rem] font-medium">{group.label}</span>
              <span className="block text-[0.8125rem] whitespace-nowrap text-muted">{getRole(group.org)?.dates}</span>
            </button>
          );
        })}
      </div>
      <div className="grid">
        {metricGroups.map((group, g) => {
          const selected = g === active;
          return (
            <div
              key={group.org}
              ref={(el) => {
                panels.current[g] = el;
              }}
              role="tabpanel"
              id={`${id}-panel-${g}`}
              aria-labelledby={`${id}-tab-${g}`}
              inert={!selected}
              data-active={selected ? "" : undefined}
              className="tab-panel col-start-1 row-start-1"
            >
              <ul className="grid gap-3 md:grid-cols-5 md:gap-4">
                {group.metrics.map((metric, i) => (
                  <li
                    key={selected ? `${metric.slug}-${switches}` : metric.slug}
                    className={SPANS[g % 2][i] === 3 ? "md:col-span-3" : "md:col-span-2"}
                  >
                    <MetricTile metric={metric} tone={TONES[g % 2][i]} index={i} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Keeps a number with its preposition or unit ("from 72 hours", "under 8",
// "3 weeks", "from 0 to 1") and "A/B tests" on one line, so a description
// never ends on a lone figure. Only spans are added; the text is unchanged.
const PAIRS =
  /(?:under|over|from|to) \d+(?:[.,]\d+)*%?(?: to \d+(?:[.,]\d+)*%?)?(?: (?:hours?|weeks?|days?))?|\d+(?:[.,]\d+)*(?: to \d+)? (?:hours?|weeks?|days?)|A\/B tests?/g;

function keepPairs(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(PAIRS)) {
    parts.push(
      text.slice(last, match.index),
      <span key={match.index} className="whitespace-nowrap">
        {match[0]}
      </span>,
    );
    last = match.index + match[0].length;
  }
  parts.push(text.slice(last));
  return parts;
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
        "group lift flex h-full flex-col gap-3 rounded-[var(--radius)] p-6",
        tone,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="t-numeral text-[clamp(2.5rem,3.5vw,4.25rem)]">
          <Numeral metric={metric} />
        </p>
        <span aria-hidden className={cn("round", dark ? "bg-white/15" : "bg-white/80")}>
          <ArrowUpRight className="size-4" />
        </span>
      </div>
      <div>
        <p className="t-lead">{metric.label}</p>
        <p
          className={cn(
            "mt-1.5 max-w-[52ch] text-base leading-relaxed text-pretty",
            dark ? "text-[var(--on-dark-muted)]" : "text-muted",
          )}
        >
          {keepPairs(metric.detail)}
        </p>
      </div>
    </Link>
  );
}
