"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const DRIFT_PX_PER_S = 35; // drift speed: tune here
const RESUME_MS = 2000; // resume this long after an interaction ends
const EASE_S = 0.6; // time constant for easing back up to speed
const COPIES = 4; // one copy before the originals, two after: fills a 2560px screen

// A full-width row of cards that drifts left continuously, on native
// scrolling (trackpad and touch swipe just work). The original cards sit
// between aria-hidden, inert copies; the position wraps by one set's width,
// which is invisible because the copies are identical. The whole-pixel part
// of the position goes to scrollLeft and the fraction to a transform, so it
// moves in sub-pixel steps. The drift stops while the pointer is over the row,
// on touch, scroll or drag, while a card has focus or an open menu
// (aria-expanded="true"), off-screen and in a background tab, then eases back
// up about two seconds after the interaction ends. Arrows move one card and
// the drift carries on from there. Reduced motion: no drift, arrows and swipe
// only. Card widths use cqw, the column's width, so the row can bleed to the
// viewport edges without resizing them. data-lenis-prevent-horizontal lets
// sideways gestures reach the track while Lenis keeps vertical scrolling.
export default function Carousel({
  label,
  items,
  itemClassName,
}: {
  label: string;
  items: ReactNode[];
  itemClassName?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(true);
  const playingRef = useRef(playing);
  const stepRef = useRef<(direction: 1 | -1) => void>(() => {});

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const list = listRef.current;
    if (!root || !track || !list) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const s = { hover: false, focus: false, visible: false, holdUntil: 0, speed: 0, pos: 0, set: 0, start: 0 };
    let raf = 0;
    let last = 0;

    // Card offsets are from the list's start (its offsetParent). column: the
    // column's left edge within the track. set: one set's width. start: the
    // scroll position that puts the first original card on the column's edge.
    // The position stays in [start, start + set), with copies filling the
    // viewport on both sides.
    let column = 0;
    const cards = list.children as HTMLCollectionOf<HTMLElement>;
    const measure = () => {
      column = root.getBoundingClientRect().left - track.getBoundingClientRect().left;
      s.set = cards[items.length].offsetLeft;
      s.start = s.set - column;
      write(s.pos || s.start);
    };
    const wrap = (pos: number) => {
      if (!s.set) return pos;
      while (pos < s.start) pos += s.set;
      while (pos >= s.start + s.set) pos -= s.set;
      return pos;
    };
    const write = (pos: number) => {
      s.pos = wrap(pos);
      const whole = Math.floor(s.pos);
      track.scrollLeft = whole;
      list.style.transform = s.pos === whole ? "" : `translateX(${whole - s.pos}px)`;
    };
    const hold = () => (s.holdUntil = performance.now() + RESUME_MS);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(now - (last || now), 50) / 1000;
      last = now;
      // A scroll position we didn't write: swipe, wheel, an arrow or focus.
      if (Math.abs(track.scrollLeft - Math.floor(s.pos)) >= 1) {
        s.pos = track.scrollLeft;
        list.style.transform = "";
        hold();
      }
      if (s.hover || s.focus || root.querySelector('[aria-expanded="true"]')) hold();
      if (motion.matches || !playingRef.current || now < s.holdUntil) {
        s.speed = 0;
        return;
      }
      s.speed += (DRIFT_PX_PER_S - s.speed) * (1 - Math.exp(-dt / EASE_S));
      write(s.pos + s.speed * dt);
    };
    const run = () => {
      cancelAnimationFrame(raf);
      last = 0;
      if (s.visible) raf = requestAnimationFrame(tick);
    };

    stepRef.current = (direction) => {
      hold();
      write(track.scrollLeft);
      const x = track.scrollLeft;
      const lefts = [...cards].map((card) => card.offsetLeft - column);
      const target =
        direction === 1 ? lefts.find((left) => left > x + 4) : [...lefts].reverse().find((left) => left < x - 4);
      if (target !== undefined) track.scrollTo({ left: target, behavior: motion.matches ? "auto" : "smooth" });
    };

    const onReduced = () => setReduced(motion.matches);
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") hold();
    };
    const onEnter = (e: PointerEvent) => (s.hover = e.pointerType === "mouse");
    const onLeave = () => (s.hover = false);
    const onFocusIn = () => (s.focus = true);
    const onFocusOut = (e: FocusEvent) => {
      if (!root.contains(e.relatedTarget as Node | null)) s.focus = false;
    };
    const resize = new ResizeObserver(measure);
    resize.observe(root);
    resize.observe(list);
    const io = new IntersectionObserver(([entry]) => {
      s.visible = entry.isIntersecting;
      run();
    });
    io.observe(root);
    onReduced();
    motion.addEventListener("change", onReduced);
    track.addEventListener("wheel", hold, { passive: true });
    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      io.disconnect();
      motion.removeEventListener("change", onReduced);
      track.removeEventListener("wheel", hold);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
    };
  }, [items.length]);

  return (
    <div ref={rootRef} role="region" aria-roledescription="carousel" aria-label={label} className="carousel">
      <div ref={trackRef} className="carousel-track" data-lenis-prevent-horizontal>
        <ul ref={listRef} className="carousel-list">
          {Array.from({ length: COPIES }, (_, copy) =>
            items.map((item, i) => (
              <li
                key={`${copy}-${i}`}
                className={cn("carousel-item", itemClassName)}
                // Copy 1 is the real set; the others only fill the loop.
                aria-hidden={copy !== 1 || undefined}
                inert={copy !== 1}
              >
                {item}
              </li>
            )),
          )}
        </ul>
      </div>
      <div className="carousel-controls">
        {!reduced && (
          <button
            type="button"
            className="round carousel-button"
            aria-label={playing ? "Pause carousel" : "Play carousel"}
            onClick={() => setPlaying(!playing)}
          >
            {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
          </button>
        )}
        <button type="button" className="round carousel-button" aria-label="Previous" onClick={() => stepRef.current(-1)}>
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <button type="button" className="round carousel-button" aria-label="Next" onClick={() => stepRef.current(1)}>
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
