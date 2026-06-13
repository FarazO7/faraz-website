"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionTemplate,
  type MotionValue,
} from "framer-motion";
import { Award, ExternalLink, FileBadge, Trophy } from "lucide-react";
import { achievements, type Achievement } from "@/lib/content";

const ICONS = { trophy: Trophy, award: Award, fileBadge: FileBadge } as const;

// Each achievement reveals across its own window of the section's scroll
// progress, leaving a lead-in and lead-out so the first/last don't clip.
const WINDOWS: [number, number][] = [
  [0.08, 0.3],
  [0.34, 0.56],
  [0.6, 0.82],
];

export default function Achievements() {
  const reduced = useReducedMotion();

  return (
    <section
      id="achievements"
      aria-labelledby="achievements-title"
      className="relative"
    >
      <h2 id="achievements-title" className="sr-only">
        Achievements
      </h2>
      {reduced ? <AchievementsStatic /> : <AchievementsScroll />}
      {/* Mobile always plays simple in-view fades, never the pinned scroll. */}
    </section>
  );
}

/* ---- Static fallback (prefers-reduced-motion): fully visible, no motion ---- */
function AchievementsStatic() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Kicker />
      <ul className="mt-10 space-y-8">
        {achievements.map((a) => (
          <li key={a.title}>
            <AchievementRow achievement={a} />
            <div className="mt-3 h-px w-40 bg-gradient-to-r from-[var(--accent-c)] to-[var(--solar-gold)]" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---- Desktop: sticky-pinned, scroll-driven reveals ---- */
function AchievementsScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // The orchid/violet wash deepens while the section is pinned (opacity only).
  const washOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, 0.55, 0.35],
  );

  return (
    <>
      {/* Desktop pinned version */}
      <div ref={ref} className="relative hidden h-[150vh] md:block">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <motion.div
            aria-hidden
            style={{ opacity: washOpacity }}
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute left-1/4 top-1/3 size-[60vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(180,92,207,0.22)_0%,transparent_60%)]" />
          </motion.div>
          <div className="mx-auto w-full max-w-6xl px-6">
            <Kicker />
            <ul className="mt-12 space-y-10">
              {achievements.map((a, i) => (
                <ScrollLine
                  key={a.title}
                  achievement={a}
                  progress={scrollYProgress}
                  window={WINDOWS[i] ?? WINDOWS[WINDOWS.length - 1]}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile: simple in-view fades, no pinning */}
      <div className="mx-auto max-w-6xl px-4 py-16 md:hidden">
        <Kicker />
        <ul className="mt-8 space-y-8">
          {achievements.map((a) => (
            <motion.li
              key={a.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <AchievementRow achievement={a} />
              <div className="mt-3 h-px w-32 bg-gradient-to-r from-[var(--accent-c)] to-[var(--solar-gold)]" />
            </motion.li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Kicker() {
  return (
    <p className="font-mono text-xs font-medium tracking-[0.2em] uppercase text-accent-b">
      Recognition
    </p>
  );
}

function ScrollLine({
  achievement,
  progress,
  window: [start, end],
}: {
  achievement: Achievement;
  progress: MotionValue<number>;
  window: [number, number];
}) {
  const opacity = useTransform(progress, [start, start + 0.1], [0, 1]);
  const y = useTransform(progress, [start, start + 0.14], [24, 0]);
  const insetTop = useTransform(progress, [start, start + 0.16], [100, 0]);
  const clipPath = useMotionTemplate`inset(${insetTop}% 0 0 0)`;
  const underlineScaleX = useTransform(progress, [start + 0.1, end], [0, 1]);
  const iconScale = useTransform(progress, [start, start + 0.12], [0.9, 1]);

  return (
    <li>
      <motion.div style={{ opacity, y, clipPath }}>
        <AchievementRow achievement={achievement} iconScale={iconScale} large />
      </motion.div>
      <motion.div
        style={{ scaleX: underlineScaleX }}
        className="mt-4 h-[3px] w-48 origin-left rounded-full bg-gradient-to-r from-[var(--accent-c)] to-[var(--solar-gold)]"
      />
    </li>
  );
}

function AchievementRow({
  achievement,
  iconScale,
  large = false,
}: {
  achievement: Achievement;
  iconScale?: MotionValue<number>;
  large?: boolean;
}) {
  const Icon = ICONS[achievement.icon];
  const titleNode = achievement.href ? (
    <a
      href={achievement.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 transition-colors hover:text-accent-a"
    >
      {achievement.title}
      <ExternalLink className="size-[0.5em] shrink-0" aria-hidden />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  ) : (
    achievement.title
  );

  return (
    <div className="flex items-start gap-4">
      <motion.span
        style={iconScale ? { scale: iconScale } : undefined}
        className="mt-1 shrink-0 text-accent-c"
      >
        <Icon className={large ? "size-8 sm:size-10" : "size-6"} aria-hidden />
      </motion.span>
      <div className="min-w-0">
        <h3
          className={
            large
              ? "font-display font-bold leading-[1.05] tracking-tight text-[clamp(2rem,5vw,4.5rem)]"
              : "font-display text-2xl font-bold tracking-tight"
          }
        >
          {titleNode}
        </h3>
        {achievement.year && (
          <span className="mt-2 inline-block font-mono text-sm text-muted">
            {achievement.year}
          </span>
        )}
      </div>
    </div>
  );
}
