"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { metricGroups, type Metric } from "@/lib/content";
import { useCountUp, useInView, usePrefersReducedMotion } from "@/lib/hooks";

const metrics = metricGroups.flatMap((group) => group.metrics);

export default function Metrics() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();

  return (
    <div ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, i) => (
        <MetricTile
          key={metric.label}
          metric={metric}
          animate={inView && !reduced}
          delayMs={150 + i * 120}
        />
      ))}
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