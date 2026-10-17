import { Download } from "lucide-react";
import ContactRow from "./ContactRow";
import Words from "./Words";
import { identity } from "@/lib/content";
import { resumeLinkProps } from "@/lib/links";

// A compact closing block on ink: the closing headline with its subline and
// Download Resume, then the shared contact row, then the copyright line.
export default function Footer() {
  return (
    <footer id="contact" tabIndex={-1} className="scroll-mt-24 bg-ink text-white">
      <div className="wrap py-12 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="t-h2" data-reveal="words">
              <Words text="Get in touch" accent="in touch" />
            </h2>
            <p className="mt-3 text-[var(--on-dark-muted)]">
              {identity.title} · {identity.location}
            </p>
          </div>
          <a {...resumeLinkProps()} className="btn btn-secondary self-start md:self-auto">
            <Download className="size-4" aria-hidden />
            Download Resume
          </a>
        </div>
        <ContactRow tone="dark" className="mt-8 justify-start" />
        <p className="mt-10 text-[0.8125rem] text-[var(--on-dark-muted)]">
          © {new Date().getFullYear()} {identity.name}
        </p>
      </div>
    </footer>
  );
}
