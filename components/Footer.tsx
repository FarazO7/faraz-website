import ContactLinks from "./ContactLinks";
import { architectureMap, identity } from "@/lib/content";
import { withBasePath } from "@/lib/utils";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="scroll-mt-24 border-t border-white/[0.07] px-4 py-14 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-2xl font-semibold">Get in touch</h2>
        <p className="mt-2 text-sm text-muted">
          {identity.title} · {identity.location}
        </p>
        <ContactLinks className="mt-5" />
        <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {identity.name}
          </p>
          <a
            href={withBasePath(architectureMap.href)}
            className="transition-colors hover:text-foreground"
          >
            {architectureMap.label}
          </a>
        </div>
      </div>
    </footer>
  );
}
