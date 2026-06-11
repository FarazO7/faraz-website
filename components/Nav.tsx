"use client";

import { useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { identity, navLinks } from "@/lib/content";
import { withBasePath } from "@/lib/utils";

const resumeButtonClass =
  "inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-sm font-medium transition-colors hover:border-white/[0.18] hover:bg-white/15";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6">
      <nav
        aria-label="Primary"
        className="glass mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-5"
      >
        <a
          href="#top"
          aria-label="Faraz Ali — back to top"
          className="grid size-9 place-items-center rounded-xl border border-white/15 font-display text-sm font-bold tracking-wide"
        >
          FA
        </a>
        <ul className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <a
            href={withBasePath(identity.resumePath)}
            download
            className={`hidden sm:inline-flex ${resumeButtonClass}`}
          >
            <Download className="size-4" aria-hidden />
            Download Resume
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className="grid size-9 place-items-center rounded-xl border border-white/15 md:hidden"
          >
            {open ? (
              <X className="size-5" aria-hidden />
            ) : (
              <Menu className="size-5" aria-hidden />
            )}
          </button>
        </div>
      </nav>
      {open && (
        <div
          id="mobile-menu"
          className="mx-auto mt-2 max-w-6xl rounded-2xl border border-white/10 bg-[#0d1220]/95 p-3 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-white/5 hover:text-foreground"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-1 border-t border-white/10 pt-2">
              <a
                href={withBasePath(identity.resumePath)}
                download
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium"
              >
                <Download className="size-4" aria-hidden />
                Download Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
