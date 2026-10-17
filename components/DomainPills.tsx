"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const MS = 300;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)"; // --ease-out
const PILL = "pill bg-surface-3 text-[0.875rem]";

type Ghost = { key: number; name: string; x: number; y: number };

// Desktop only (lg and up): the pinned Domains block beside the timeline. It
// shows the pills of the role crossing a line 40% down the viewport (the first
// role's before the timeline, the last one's after it) and animates each
// change with FLIP on the Web Animations API: leaving pills fade and shrink,
// new ones grow in, shared ones glide to their new place. An invisible copy of
// every set shares the grid cell, so the block keeps the tallest set's height.
// Every role also lists its own pills in the timeline (visible on phones,
// sr-only on desktop), so this block is aria-hidden.
export default function DomainPills({ sets, timelineId }: { sets: string[][]; timelineId: string }) {
  const [active, setActive] = useState(0);
  const [ghosts, setGhosts] = useState<Ghost[]>([]);
  const listRef = useRef<HTMLUListElement>(null);
  // Pill positions before a change; null means swap without animating.
  const before = useRef<Map<string, DOMRect> | null>(null);

  useEffect(() => {
    const timeline = document.getElementById(timelineId);
    const list = listRef.current;
    if (!timeline || !list) return;
    const items = [...timeline.children] as HTMLElement[];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    timeline.setAttribute("data-tracked", "");
    let current = -1;
    let ghostKey = 0;

    const pick = () => {
      const line = window.innerHeight * 0.4;
      let next = 0;
      items.forEach((item, i) => {
        if (item.getBoundingClientRect().top <= line) next = i;
      });
      if (next === current) return;
      items.forEach((item, i) => item.toggleAttribute("data-active", i === next));
      before.current = null;
      if (current >= 0 && !reduce.matches) {
        // Fast scrolling: settle whatever is running, so nothing queues.
        list.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
        const origin = list.getBoundingClientRect();
        const rects = new Map<string, DOMRect>();
        list.querySelectorAll<HTMLElement>("[data-name]").forEach((el) => {
          rects.set(el.dataset.name!, el.getBoundingClientRect());
        });
        before.current = rects;
        const leaving = sets[current].filter((name) => !sets[next].includes(name));
        setGhosts((all) => [
          ...all,
          ...leaving.map((name) => {
            const rect = rects.get(name)!;
            return { key: ghostKey++, name, x: rect.left - origin.left, y: rect.top - origin.top };
          }),
        ]);
      }
      current = next;
      setActive(next);
    };

    const observer = new IntersectionObserver(pick, { rootMargin: "-40% 0px -60% 0px" });
    items.forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
      timeline.removeAttribute("data-tracked");
    };
  }, [sets, timelineId]);

  useLayoutEffect(() => {
    const list = listRef.current;
    const rects = before.current;
    before.current = null;
    if (!list || !rects) return;
    list.querySelectorAll<HTMLElement>("[data-name]").forEach((el) => {
      const was = rects.get(el.dataset.name!);
      if (!was) {
        el.animate([{ opacity: 0, transform: "scale(0.8)" }, { opacity: 1, transform: "none" }], { duration: MS, easing: EASE });
        return;
      }
      const now = el.getBoundingClientRect();
      const dx = was.left - now.left;
      const dy = was.top - now.top;
      if (dx || dy) {
        el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: MS, easing: EASE });
      }
    });
  }, [active]);

  // Leaving pills stay where they were, absolutely placed, until they fade out.
  const fadeOut = (el: HTMLLIElement | null, key: number) => {
    if (!el || el.getAnimations().length) return;
    const animation = el.animate([{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(0.8)" }], {
      duration: MS,
      easing: EASE,
      fill: "forwards",
    });
    animation.onfinish = () => setGhosts((all) => all.filter((ghost) => ghost.key !== key));
  };

  return (
    <div aria-hidden className="mt-10 hidden lg:block" data-reveal="fade">
      <p className="kicker">Domains</p>
      <div className="mt-4 grid">
        {sets.map((set, i) => (
          <ul key={i} className="invisible col-start-1 row-start-1 flex flex-wrap content-start gap-2">
            {set.map((name) => (
              <li key={name} className={PILL}>
                {name}
              </li>
            ))}
          </ul>
        ))}
        <ul ref={listRef} className="relative col-start-1 row-start-1 flex flex-wrap content-start gap-2">
          {sets[active].map((name) => (
            <li key={name} data-name={name} className={PILL}>
              {name}
            </li>
          ))}
          {ghosts.map((ghost) => (
            <li
              key={ghost.key}
              ref={(el) => fadeOut(el, ghost.key)}
              className={`${PILL} pointer-events-none absolute`}
              style={{ left: ghost.x, top: ghost.y }}
            >
              {ghost.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
