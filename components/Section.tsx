import { cn } from "@/lib/utils";

export default function Section({
  id,
  kicker,
  title,
  children,
  className,
}: {
  id: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-24 px-4 py-14 sm:px-6 md:py-20", className)}
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-xs font-medium tracking-[0.2em] uppercase text-accent-b">
          {kicker}
        </p>
        <h2
          id={`${id}-title`}
          className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {title}
        </h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
