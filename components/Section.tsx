import { cn } from "@/lib/utils";
import Words from "./Words";

// Kicker (sparkle label) + h2 whose words rise out of masks on first view.
export function SectionHead({
  id,
  kicker,
  title,
  accent,
  center = false,
  className,
}: {
  id: string;
  kicker: string;
  title: string;
  accent?: string;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(center && "text-center", className)}>
      <p className="kicker" data-reveal="fade">
        {kicker}
      </p>
      <h2 id={`${id}-title`} className="t-h2 mt-4" data-reveal="words">
        <Words text={title} accent={accent} />
      </h2>
    </div>
  );
}

export default function Section({
  id,
  kicker,
  title,
  accent,
  center = false,
  children,
  className,
}: {
  id: string;
  kicker: string;
  title: string;
  accent?: string;
  center?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} tabIndex={-1} className={cn("section", className)}>
      <div className="wrap">
        <SectionHead id={id} kicker={kicker} title={title} accent={accent} center={center} />
        <div className="mt-10 md:mt-14">{children}</div>
      </div>
    </section>
  );
}
