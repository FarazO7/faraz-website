import { ArrowUpRight } from "lucide-react";
import Section from "./Section";
import ContributionCalendar from "./ContributionCalendar";
import RepoCards from "./RepoCards";
import { identity } from "@/lib/content";

export default function GitHubSection() {
  return (
    <Section id="github" kicker="GitHub" title="Building in public">
      <ContributionCalendar />
      <div className="mt-6">
        <RepoCards />
      </div>
      <a
        href={identity.github}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent-a hover:underline"
      >
        All repositories on GitHub
        <ArrowUpRight className="size-4" aria-hidden />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </Section>
  );
}
