"use client";

import { useEffect, useRef, useState } from "react";
import { identity, navLinks } from "@/lib/content";
import { cn, withBase } from "@/lib/utils";

// The reference's floating navbar strip: a centred glass pill that drops in on
// load, hides while scrolling down past the first viewport and returns on the
// way up. Below lg it is a full-width pill whose menu opens in place (clip-path
// reveal). Menu links stay in the DOM when closed (inert), so they remain in
// the HTML for crawlers and no-JS visitors. `base` prefixes the section
// anchors on pages other than home ("/" → "/#impact").
export default function Nav({ base = "" }: { base?: string }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > window.innerHeight && y > last);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("no-scroll", open);
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const href = (anchor: string) => `${base}${anchor}`;

  return (
    <header
      className={cn(
        // The header box is wider and taller than the pill (and holds the
        // hidden menu), so it passes clicks through; only the pill and the open
        // menu take them.
        "pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] focus-within:translate-y-0 motion-reduce:transition-none lg:pt-6",
        hidden && !open && "-translate-y-[150%]",
      )}
    >
      <div className="nav-drop mx-auto w-full lg:w-fit">
        <nav
          aria-label="Primary"
          className="glass pointer-events-auto relative mx-auto flex h-14 items-center justify-between rounded-[1.75rem] pr-2 pl-3 lg:h-[3.25rem] lg:gap-10 lg:pr-1.5 lg:pl-2"
        >
          <a
            href={href("#top")}
            aria-label={`${identity.name}, back to top`}
            className="grid size-10 place-items-center rounded-full bg-ink text-sm font-medium tracking-wide text-white"
          >
            FA
          </a>
          <ul className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={href(link.href)} className="text-[0.9375rem] font-medium">
                  <span className="roll">
                    <span data-text={link.label}>{link.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a
              href={withBase(identity.resumePath)}
              download
              className="btn btn-primary hidden h-10 min-w-0 px-5 text-sm sm:inline-flex"
            >
              Download Resume
            </a>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen(!open)}
              className="relative grid size-10 place-items-center lg:hidden"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute h-0.5 w-6 rounded-full bg-ink transition-transform duration-300",
                  open ? "rotate-45" : "-translate-y-1",
                )}
              />
              <span
                aria-hidden
                className={cn(
                  "absolute h-0.5 w-6 rounded-full bg-ink transition-transform duration-300",
                  open ? "-rotate-45" : "translate-y-1",
                )}
              />
            </button>
          </div>
        </nav>
        <div
          id="mobile-menu"
          inert={!open}
          className={cn(
            "glass mx-auto mt-2 rounded-[1.5rem] px-6 pt-4 pb-6 transition-[clip-path,opacity,visibility] duration-500 ease-[cubic-bezier(.2,0,0,1)] lg:hidden",
            open
              ? "pointer-events-auto visible opacity-100 [clip-path:inset(0_0_0_0_round_1.5rem)]"
              : "invisible opacity-0 [clip-path:inset(0_0_100%_0_round_1.5rem)]",
          )}
        >
          <ul className="flex flex-col">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={href(link.href)}
                  onClick={() => setOpen(false)}
                  className="dot-link block py-1.5 text-[2rem] leading-tight tracking-[-0.02em]"
                >
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={withBase(identity.resumePath)}
            download
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-6 w-full"
          >
            Download Resume
          </a>
        </div>
      </div>
    </header>
  );
}
