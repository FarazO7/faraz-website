import { cn } from "@/lib/utils";
import Reveal from "./Reveal";

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
        <Reveal>
          <p className="font-mono text-xs font-medium tracking-[0.2em] text-accent-b uppercase">
            {kicker}
          </p>
          <h2
            id={`${id}-title`}
            className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-8">
          {children}
        </Reveal>
      </div>
    </section>
  );
}