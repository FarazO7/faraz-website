import { credibility, type CredibilityOrg } from "@/lib/content";
import LogoTile from "./LogoTile";

// Experience and Education as two labelled rows of white pills (the
// reference's tag style): logo or monogram, name, one-word descriptor.
// Static on purpose, so a skimming recruiter can read every name.
export default function Credibility() {
  return (
    <div className="grid gap-8 rounded-[var(--radius)] bg-surface-3 px-5 py-7 sm:px-8 lg:grid-cols-[1.6fr_1fr] lg:gap-10" data-reveal="up">
      <Cluster label="Experience" items={credibility.experience} />
      <Cluster label="Education" items={credibility.education} />
    </div>
  );
}

function Cluster({ label, items }: { label: string; items: CredibilityOrg[] }) {
  return (
    <div>
      <p className="kicker">{label}</p>
      <ul className="mt-4 flex flex-wrap gap-2.5">
        {items.map((org) => (
          <li key={org.name} className="pill gap-3 py-2 pr-5 pl-2">
            <LogoTile logo={org.logo} mark={org.mark} accent={org.accent} name={org.name} />
            <span className="min-w-0 text-left">
              <span className="block text-[0.9375rem] leading-tight font-medium">{org.name}</span>
              <span className="block text-[0.8125rem] leading-tight text-muted">{org.descriptor}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
