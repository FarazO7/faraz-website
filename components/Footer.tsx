import type { CSSProperties } from "react";
import { Download } from "lucide-react";
import ContactLinks from "./ContactLinks";
import Divider from "./Divider";
import Words from "./Words";
import { identity, navLinks } from "@/lib/content";
import { withBase } from "@/lib/utils";

// The reference's closing block: ink background, the closing headline with
// its actions, a giant name wordmark (decorative, 10% white) whose letters
// rise in, then the menu and the copyright line. `base` prefixes the section
// anchors on pages other than home.
export default function Footer({ base = "" }: { base?: string }) {
  return (
    <footer id="contact" tabIndex={-1} className="scroll-mt-24 overflow-hidden bg-ink text-white">
      <div className="wrap pt-16 pb-10 md:pt-24">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:items-end">
          <div>
            <h2 className="t-h1" data-reveal="words">
              <Words text="Get in touch" accent="in touch" />
            </h2>
            <p className="mt-4 text-[var(--on-dark-muted)]">
              {identity.title} · {identity.location}
            </p>
            <ContactLinks variant="dark" className="mt-8" />
          </div>
          <div className="md:justify-self-end" data-reveal="scale">
            <a href={withBase(identity.resumePath)} download className="btn btn-secondary">
              <Download className="size-4" aria-hidden />
              Download Resume
            </a>
          </div>
        </div>

        <p
          aria-hidden
          data-reveal="letters"
          className="mt-16 text-center leading-[0.8] font-medium tracking-[-0.04em] whitespace-nowrap text-white/10 uppercase select-none md:mt-24"
          style={{ fontSize: "calc(min(100vw - 2 * var(--gutter), var(--content-max)) / 5)" }}
        >
          {[...identity.name].map((ch, i, all) => (
            <span
              key={i}
              className="w"
              // Letters rise from the edges inward, as on the reference.
              style={{ "--wi": Math.min(i, all.length - 1 - i) } as CSSProperties}
            >
              {ch === " " ? "\u00a0" : ch}
            </span>
          ))}
        </p>

        <div className="mt-14 md:mt-20">
          <p className="text-sm text-[var(--on-dark-muted)]">Menu</p>
          <Divider className="mt-4 text-white/15" />
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={`${base}${link.href}`} className="dot-link py-1 text-lg">
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-12 text-[0.8125rem] text-[var(--on-dark-muted)]">
            <p>
              © {new Date().getFullYear()} {identity.name}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
