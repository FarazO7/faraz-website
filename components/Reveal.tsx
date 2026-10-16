"use client";

import { useInView, usePrefersReducedMotion } from "@/lib/hooks";

// Wraps any block and eases it in (fade + small rise) the first time its top
// edge scrolls 20% above the bottom of the viewport. Keyed to the edge, not a
// share of the block, so very tall blocks (Experience on a phone) still reveal.
// Under prefers-reduced-motion it renders immediately with no transform.
// `delay` lets callers stagger a header before its body.
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0, "0px 0px -20% 0px");
  const reduced = usePrefersReducedMotion();
  const shown = reduced || inView;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(24px)",
        transition: reduced
          ? "none"
          : `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
        willChange: reduced ? undefined : "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}