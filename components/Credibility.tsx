import { credibility, type CredibilityOrg } from "@/lib/content";
import LogoTile from "./LogoTile";

// Replaces the old "Worked With" chips and the capabilities card with one
// framed proof strip: Experience and Education as two labelled clusters,
// each org a monogram tile + name + one-word descriptor (not a logo wall).
export default function Credibility() {
  return (
    <div className="glass mt-10 p-5 sm:p-6">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-stretch lg:gap-8">
        <Cluster label="Experience" items={credibility.experience} />
        <div className="hidden w-px self-stretch bg-white/10 lg:block" aria-hidden />
        <Cluster label="Education" items={credibility.education} />
      </div>
    </div>
  );
}

function Cluster({ label, items }: { label: string; items: CredibilityOrg[] }) {
  return (
    <div className="lg:flex-1">
      <p className="font-mono text-xs tracking-[0.2em] text-muted/70 uppercase">
        {label}
      </p>
      <span className="mt-2 block h-px w-8 bg-accent-a/60" aria-hidden />
      <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3 lg:flex lg:flex-wrap lg:gap-x-7">
        {items.map((org) => (
          <li key={org.name} className="flex items-center gap-3">
            <LogoTile
              logo={org.logo}
              mark={org.mark}
              accent={org.accent}
              name={org.name}
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-foreground">
                {org.name}
              </span>
              <span className="block text-xs text-muted">{org.descriptor}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}