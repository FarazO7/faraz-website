"use client";

import { metrics, type Metric } from "@/lib/content";
import { useCountUp, useInView, usePrefersReducedMotion } from "@/lib/hooks";

export default function Metrics() {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = usePrefersReducedMotion();

  return (
    <div ref={ref} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
    <article
      className="glass glass-nested rise rounded-2xl p-5"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <p className="font-mono text-3xl font-bold text-accent-c sm:text-4xl">
        {metric.prefix}
        {value}
        {metric.suffix}
      </p>
      <p className="mt-2 text-sm leading-snug font-medium">{metric.label}</p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
        {metric.detail}
      </p>
    </article>
  );
}
