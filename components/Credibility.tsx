import { credibility, type CredibilityOrg } from "@/lib/content";
import LogoTile from "./LogoTile";

// Experience and Education, each a labelled row of white pills (the
// reference's tag style): logo or monogram, name, one-word descriptor. From
// xl the two rows sit side by side, split by a thin rule, every pill on one
// line: the panel takes its content's width (about 1,210px), centred in the
// viewport rather than the column. Below xl they stack, one line per group
// from lg; tablets wrap; two per row from 520px; one per row below, so every
// name and descriptor reads on one line (descriptors never break, even at
// the hyphen in "E-commerce"). Static on purpose, so a skimming recruiter can
// read every name.
export default function Credibility() {
  return (
    <div className="xl:mx-[calc(50%-50vw)] xl:flex xl:justify-center">
      <div
        className="space-y-7 rounded-[var(--radius)] bg-surface-3 px-5 py-7 sm:px-8 xl:grid xl:w-max xl:grid-cols-[auto_1px_auto] xl:gap-x-8 xl:space-y-0"
        data-reveal="up"
      >
        <Cluster label="Experience" items={credibility.experience} />
        <div aria-hidden className="hidden bg-line xl:block" />
        <Cluster label="Education" items={credibility.education} />
      </div>
    </div>
  );
}

function Cluster({ label, items }: { label: string; items: CredibilityOrg[] }) {
  return (
    <div>
      <p className="kicker">{label}</p>
      <ul className="mt-4 grid grid-cols-1 gap-2.5 min-[520px]:grid-cols-2 sm:flex sm:flex-wrap lg:flex-nowrap">
        {items.map((org) => (
          <li key={org.name} className="pill min-w-0 gap-2.5 py-2 pr-4 pl-2 sm:gap-3 sm:pr-5">
            <LogoTile logo={org.logo} mark={org.mark} accent={org.accent} name={org.name} />
            <span className="min-w-0 text-left">
              <span className="block text-[0.9375rem] leading-tight font-medium">{org.name}</span>
              <span className="block text-[0.8125rem] leading-tight whitespace-nowrap text-muted">{org.descriptor}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
