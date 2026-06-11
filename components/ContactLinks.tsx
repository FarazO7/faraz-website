import { Mail, Phone } from "lucide-react";
import { GitHubMark, LinkedInMark } from "./icons";
import { identity } from "@/lib/content";
import { cn } from "@/lib/utils";

const linkClass =
  "inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground";

export default function ContactLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-5 gap-y-3", className)}>
      <li>
        <a className={linkClass} href={identity.phoneHref}>
          <Phone className="size-4 text-accent-a" aria-hidden />
          {identity.phone}
        </a>
      </li>
      <li>
        <a className={linkClass} href={`mailto:${identity.email}`}>
          <Mail className="size-4 text-accent-a" aria-hidden />
          {identity.email}
        </a>
      </li>
      <li>
        <a
          className={linkClass}
          href={identity.linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkedInMark className="size-4 text-accent-a" />
          LinkedIn
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </li>
      <li>
        <a
          className={linkClass}
          href={identity.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubMark className="size-4 text-accent-a" />
          GitHub
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </li>
    </ul>
  );
}
