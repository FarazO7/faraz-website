import { type Role } from "@/lib/content";
import { cn } from "@/lib/utils";

// Shared vertical timeline used by Experience and Education. Renders gracefully
// when `dates` or `bullets` are empty — no orphan separators or blank rows.
export default function Timeline({
  roles,
  compact = false,
}: {
  roles: Role[];
  compact?: boolean;
}) {
  return (
    <ol className="relative ml-1.5 space-y-8 border-l border-white/10">
      {roles.map((role) => (
        <li
          key={`${role.company}-${role.title}`}
          className="relative pl-6 sm:pl-8"
        >
          <span
            aria-hidden
            className={cn(
              "absolute top-3 -left-[5.5px] size-2.5 rounded-full",
              role.current
                ? "bg-accent-a shadow-[0_0_12px_rgba(79,124,255,0.6)]"
                : "bg-white/25",
            )}
          />
          <div
            className={cn(
              compact ? "p-4 sm:p-5" : "p-5 sm:p-6",
              role.current ? "glass" : "rounded-[20px] border border-white/[0.07]",
            )}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3
                className={cn(
                  "font-display font-semibold",
                  compact ? "text-base" : "text-lg",
                )}
              >
                {role.title}
              </h3>
              {role.dates && (
                <p className="font-mono text-xs text-muted">{role.dates}</p>
              )}
            </div>
            <p className="mt-1 text-sm font-medium text-foreground/90">
              {role.company} · {role.location}
            </p>
            {role.bullets.length > 0 && (
              <ul className="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-muted marker:text-white/30">
                {role.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
