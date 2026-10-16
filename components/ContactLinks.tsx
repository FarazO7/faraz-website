import { Mail, Phone } from "lucide-react";
import { GitHubMark, LinkedInMark } from "./icons";
import { identity } from "@/lib/content";
import { cn } from "@/lib/utils";

// Phone, email, LinkedIn, GitHub. "light": a compact row of underlined links
// (hero); "dark": large footer rows with the reference's pink-dot hover.
export default function ContactLinks({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";
  const linkClass = dark
    ? "dot-link py-1 text-[clamp(1.25rem,1.6vw,1.75rem)] tracking-[-0.02em] text-white"
    : "inline-flex items-center gap-2 text-[0.9375rem] underline decoration-1 underline-offset-[0.25em] hover:no-underline";
  const iconClass = dark ? "hidden" : "size-4 text-muted";
  // The dark rows wrap their label in a span so it can slide on hover.
  const label = (text: string) => (dark ? <span>{text}</span> : text);

  return (
    <ul className={cn("flex flex-wrap", dark ? "flex-col gap-1" : "items-center gap-x-6 gap-y-3", className)}>
      <li>
        <a className={linkClass} href={identity.phoneHref}>
          <Phone className={iconClass} aria-hidden />
          {label(identity.phone)}
        </a>
      </li>
      <li>
        <a className={linkClass} href={`mailto:${identity.email}`}>
          <Mail className={iconClass} aria-hidden />
          {label(identity.email)}
        </a>
      </li>
      <li>
        <a className={linkClass} href={identity.linkedin} target="_blank" rel="noopener noreferrer">
          <LinkedInMark className={iconClass} />
          {label("LinkedIn")}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </li>
      <li>
        <a className={linkClass} href={identity.github} target="_blank" rel="noopener noreferrer">
          <GitHubMark className={iconClass} />
          {label("GitHub")}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </li>
    </ul>
  );
}
