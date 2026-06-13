"use client";

import { useEffect, useRef, useState } from "react";
import { skills, type SkillHub, type SkillNode } from "@/lib/content";
import { desaturate, getBrandIcon } from "@/lib/skillIcons";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const NODE = 72; // child node diameter (spec: 56–72px)
const CELL_W = 576; // half of the max-w-6xl container at full width
const CELL_H = 500;

type Placed = { node: SkillNode; x: number; y: number };
type HubLayout = { hub: SkillHub; cx: number; cy: number; placed: Placed[] };

// Arrange a hub's children on one or two rings around its center.
function placeNodes(
  nodes: SkillNode[],
  cx: number,
  cy: number,
  scale: number,
): Placed[] {
  const n = nodes.length;
  const ring = (count: number, radius: number, offset: number) =>
    (i: number) => {
      const a = -Math.PI / 2 + offset + (i * 2 * Math.PI) / count;
      return { x: cx + radius * scale * Math.cos(a), y: cy + radius * scale * Math.sin(a) };
    };
  if (n <= 6) {
    const at = ring(n, 135, 0);
    return nodes.map((node, i) => ({ node, ...at(i) }));
  }
  const innerCount = Math.floor(n / 2);
  const outerCount = n - innerCount;
  const innerAt = ring(innerCount, 118, 0);
  const outerAt = ring(outerCount, 188, Math.PI / outerCount);
  return nodes.map((node, i) =>
    i < innerCount
      ? { node, ...innerAt(i) }
      : { node, ...outerAt(i - innerCount) },
  );
}

function buildLayout(width: number): { layouts: HubLayout[]; height: number } {
  const cellW = width / 2;
  const scale = Math.min(1, cellW / CELL_W);
  const cellH = CELL_H * Math.max(0.82, scale);
  const layouts = skills.map((hub, hi) => {
    const col = hi % 2;
    const row = Math.floor(hi / 2);
    const cx = col * cellW + cellW / 2;
    const cy = row * cellH + cellH / 2;
    return { hub, cx, cy, placed: placeNodes(hub.nodes, cx, cy, scale) };
  });
  return { layouts, height: cellH * 2 };
}

export default function SkillsConstellation() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<{ layouts: HubLayout[]; height: number } | null>(
    null,
  );
  const [active, setActive] = useState(false); // section in view → animate
  const reduced = usePrefersReducedMotion();

  // Measure container width; rebuild the constellation on resize.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setLayout(buildLayout(w));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pause the float field while the section is off-screen.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animate = active && !reduced;

  return (
    <div ref={wrapRef}>
      {/* Desktop: measured hub-and-spoke constellation */}
      <div
        className="relative hidden lg:block"
        style={{ height: layout?.height ?? CELL_H * 2 }}
        aria-hidden={layout ? undefined : true}
      >
        {layout && (
          <>
            <svg
              className="pointer-events-none absolute inset-0 size-full"
              width="100%"
              height={layout.height}
              aria-hidden
            >
              {layout.layouts.flatMap(({ hub, cx, cy, placed }) =>
                placed.map((p, i) => (
                  <g key={`${hub.name}-line-${i}`}>
                    <line
                      x1={cx}
                      y1={cy}
                      x2={p.x}
                      y2={p.y}
                      stroke="rgba(255,255,255,0.10)"
                      strokeWidth={1}
                    />
                    <circle cx={p.x} cy={p.y} r={2.5} fill={hub.accent} />
                  </g>
                )),
              )}
            </svg>
            {layout.layouts.map(({ hub, cx, cy, placed }) => (
              <div key={hub.name}>
                {/* Hub pill — the only live-blur glass in this section */}
                <div
                  className="glass absolute z-10 -translate-x-1/2 -translate-y-1/2 px-4 py-2"
                  style={{ left: cx, top: cy }}
                >
                  <span className="font-display text-sm font-semibold whitespace-nowrap">
                    {hub.name}
                  </span>
                </div>
                {placed.map((p, i) => (
                  <ConstellationNode
                    key={`${hub.name}-${p.node.label}`}
                    placed={p}
                    accent={hub.accent}
                    animate={animate}
                    index={i}
                  />
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Mobile: stacked glass category cards (also the SSR / no-JS layout) */}
      <div className="grid gap-5 lg:hidden">
        {skills.map((hub) => (
          <div key={hub.name} className="glass p-5">
            <div className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ background: hub.accent }}
                aria-hidden
              />
              <h3 className="font-display text-base font-semibold">{hub.name}</h3>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {hub.nodes.map((node, i) => (
                <NodeCircle
                  key={node.label}
                  node={node}
                  accent={hub.accent}
                  animate={animate}
                  index={i}
                  amp={3}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConstellationNode({
  placed,
  accent,
  animate,
  index,
}: {
  placed: Placed;
  accent: string;
  animate: boolean;
  index: number;
}) {
  return (
    <div
      className={cn("absolute z-[5]", animate && "float-node")}
      style={{
        left: placed.x - NODE / 2,
        top: placed.y - NODE / 2,
        width: NODE,
        height: NODE,
        ["--float-amp" as string]: "6px",
        ["--float-dur" as string]: `${4 + (index % 4) * 0.8}s`,
        animationDelay: `${(index % 6) * 0.25}s`,
      }}
    >
      <NodeCircle node={placed.node} accent={accent} fill />
    </div>
  );
}

// The circular glass node itself. `fill` makes it fill its absolute wrapper
// (desktop); otherwise it's a fixed-size inline circle (mobile cards).
function NodeCircle({
  node,
  accent,
  fill = false,
  animate,
  index = 0,
  amp,
}: {
  node: SkillNode;
  accent: string;
  fill?: boolean;
  animate?: boolean;
  index?: number;
  amp?: number;
}) {
  const icon = getBrandIcon(node.slug);
  const inner = (
    <div
      tabIndex={0}
      className={cn(
        "skill-node-inner glass-solid group relative grid place-items-center rounded-full text-center outline-none",
        fill ? "size-full" : "size-[72px]",
      )}
      style={{ borderColor: `${accent}33` }}
    >
      {icon ? (
        <>
          <svg
            viewBox="0 0 24 24"
            className="size-7"
            fill={desaturate(icon.hex)}
            aria-hidden
          >
            <path d={icon.path} />
          </svg>
          <span className="sr-only">{node.label}</span>
          {/* Tooltip for logo-only nodes */}
          <span
            role="tooltip"
            className="pointer-events-none absolute -bottom-7 left-1/2 z-20 -translate-x-1/2 rounded-md border border-white/10 bg-[#0d1220] px-2 py-1 font-mono text-[10px] whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          >
            {node.label}
          </span>
        </>
      ) : (
        <span className="px-2 font-mono text-[9px] leading-tight text-foreground/90">
          {node.label}
        </span>
      )}
    </div>
  );

  if (fill) return inner;

  // Mobile inline circle with its own float wrapper.
  return (
    <div
      className={cn("relative", animate && "float-node")}
      style={{
        ["--float-amp" as string]: `${amp ?? 6}px`,
        ["--float-dur" as string]: `${4 + (index % 4) * 0.8}s`,
        animationDelay: `${(index % 6) * 0.2}s`,
      }}
    >
      {inner}
    </div>
  );
}
