"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  currentRole,
  getRole,
  metricGroups,
  type Metric,
} from "@/lib/content";
import { useCountUp, useInView, usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

// Role-segmented impact metrics: a WAI-ARIA tablist (roving tabindex, arrow
// keys, Home/End) over one four-tile grid per role, current role first. Both
// panels share one grid cell, so the section is always as tall as the taller
// panel and switching never shifts layout. The inactive panel is
// visibility:hidden + inert: never painted (its glass costs no blur) and out
// of the accessibility tree.
const DEFAULT_TAB = Math.max(
  0,
  metricGroups.findIndex((group) => group.org === currentRole.id),
);

export default function Metrics() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(DEFAULT_TAB);
  // Bumped on every switch; it keys the active panel's tiles so the count-up
  // (and the rise-in) replays for the newly selected role.
  const [switches, setSwitches] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();

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
      {metricGroups.length > 1 && (
        <div
          role="tablist"
          aria-label="Impact by role"
          className="mb-6 flex flex-wrap gap-2"
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
                className={cn(
                  "flex flex-col items-start rounded-xl border px-4 py-2 text-left transition-colors",
                  selected
                    ? "border-white/25 bg-white/10 text-foreground"
                    : "border-white/10 text-muted hover:border-white/20 hover:text-foreground",
                )}
              >
                <span className="text-sm font-semibold">{group.label}</span>
                <span className="font-mono text-[11px] text-muted">
                  {getRole(group.org)?.dates}
                </span>
              </button>
            );
          })}
        </div>
      )}
      <div ref={ref} className="grid">
        {metricGroups.map((group, i) => {
          const selected = i === active;
          return (
            <div
              key={group.org}
              role={metricGroups.length > 1 ? "tabpanel" : undefined}
              id={`${id}-panel-${i}`}
              aria-labelledby={
                metricGroups.length > 1 ? `${id}-tab-${i}` : undefined
              }
              inert={!selected}
              className={cn(
                "col-start-1 row-start-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
                !selected && "invisible",
              )}
            >
              {group.metrics.map((metric, j) => (
                <MetricTile
                  key={selected ? `${metric.slug}-${switches}` : metric.slug}
                  metric={metric}
                  animate={selected && inView && !reduced}
                  delayMs={150 + j * 120}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetricTile({
  metric,
  animate,
  delayMs,
}: {
  metric: Metric;
  animate: boolean;
  delayMs: number;
}) {
  const value = useCountUp(metric.value, animate);

  return (
    <Link
      href={`/impact/${metric.slug}`}
      aria-label={`${metric.prefix ?? ""}${metric.value}${metric.suffix ?? ""} — ${metric.label}. Read the full story.`}
      className="glass glass-hover rise group relative block rounded-2xl p-5"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <ArrowUpRight
        aria-hidden
        className="absolute top-4 right-4 size-4 text-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      <p className="numeral-gradient font-mono text-3xl font-bold sm:text-4xl">
        {metric.prefix}
        {value}
        {metric.suffix}
      </p>
      <p className="mt-2 text-sm leading-snug font-medium">{metric.label}</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
        {metric.detail}
      </p>
    </Link>
  );
}
