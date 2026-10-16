import type { CSSProperties } from "react";
import type { Metric } from "@/lib/content";

// A metric figure with each digit wrapped for the odometer roll (globals.css
// .odo). The DOM text is exactly prefix + value + suffix, so the figure is
// right for copy, screen readers, no-JS and reduced motion; the roll is a
// pseudo-element that ends on the same digit.
export default function Numeral({ metric }: { metric: Metric }) {
  let digit = 0;
  return [...`${metric.prefix ?? ""}${metric.value}${metric.suffix ?? ""}`].map((ch, i) =>
    /\d/.test(ch) ? (
      <span key={i} className="odo" style={{ "--d": ch, "--di": digit++ } as CSSProperties}>
        {ch}
      </span>
    ) : (
      ch
    ),
  );
}
