import ContactLinks from "./ContactLinks";
import { identity } from "@/lib/content";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="scroll-mt-24 border-t border-white/[0.07] px-4 py-14 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold">Get in touch</h2>
          <p className="mt-2 text-sm text-muted">
            {identity.title} · {identity.location}
          </p>
          <ContactLinks className="mt-5" />
          <div className="mt-10 border-t border-white/[0.06] pt-6 text-[13px] text-muted">
            <p>
              © {new Date().getFullYear()} {identity.name}
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}