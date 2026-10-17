import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { bulletParts, getImpactDetail, type Bullet, type Role } from "@/lib/content";
import { cn } from "@/lib/utils";

// Numbered timeline shared by Experience and Education: outlined circles with
// italic numerals (a CSS counter, not DOM text) joined by a thin blue line,
// after the reference's step list. Renders gracefully when `dates` or
// `bullets` are empty: no orphan separators or blank rows. A role's domains
// sit under its company line on phones; from lg they are sr-only, because
// Experience pins the active role's set beside the timeline (DomainPills).
export default function Timeline({
  id,
  roles,
  compact = false,
  className,
}: {
  id?: string;
  roles: Role[];
  compact?: boolean;
  className?: string;
}) {
  return (
    <ol id={id} className={cn("timeline", className)}>
      {roles.map((role) => (
        <li
          key={`${role.company}-${role.title}`}
          className="timeline-item"
          data-current={role.current ? "" : undefined}
          data-reveal="up"
        >
          <span aria-hidden className="timeline-num" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className={compact ? "text-[1.375rem] leading-snug tracking-[-0.02em]" : "t-h3"}>
                {role.title}
              </h3>
              {role.dates && <p className="t-label">{role.dates}</p>}
            </div>
            <p className="mt-2 font-medium">
              {role.company}
              {role.descriptor && `, ${role.descriptor}`} · {role.location}
            </p>
            {role.domains && role.domains.length > 0 && (
              <ul aria-label="Domains" className="mt-3 flex flex-wrap gap-2 lg:sr-only">
                {role.domains.map((domain) => (
                  <li key={domain} className="pill bg-surface-3 text-[0.875rem]">
                    {domain}
                  </li>
                ))}
              </ul>
            )}
            {role.summary && <p className="t-lead prose-measure mt-4">{role.summary}</p>}
            {role.bullets.length > 0 && (
              <ul className="prose-measure mt-5 space-y-3 leading-relaxed text-muted">
                {role.bullets.map((bullet) => (
                  <BulletItem key={bulletParts(bullet).text} bullet={bullet} />
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

// A bullet with an impact slug ends in a "Read the case" link; the aria-label
// names the page's metric so every link has a unique accessible name.
function BulletItem({ bullet }: { bullet: Bullet }) {
  const { text, impact } = bulletParts(bullet);
  const detail = impact ? getImpactDetail(impact) : undefined;

  return (
    <li className="flex gap-3">
      <span aria-hidden className="sparkle mt-[0.45em] [--sparkle:var(--primary)]" />
      <span>
        {text}
        {detail && (
          <>
            {" "}
            <Link
              href={`/impact/${detail.slug}`}
              aria-label={`Read the case: ${detail.metric}`}
              className="link inline-flex items-center gap-0.5 font-medium whitespace-nowrap text-ink"
            >
              Read the case
              <ArrowUpRight className="size-3.5" aria-hidden />
            </Link>
          </>
        )}
      </span>
    </li>
  );
}
