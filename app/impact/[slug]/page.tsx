import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { LinkedInMark } from "@/components/icons";
import {
  confidentiality,
  getImpactDetail,
  getRole,
  identity,
  impactDetails,
} from "@/lib/content";

// Pre-render one page per metric for the static export; reject unknown slugs.
export function generateStaticParams() {
  return impactDetails.map((d) => ({ slug: d.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = getImpactDetail(slug);
  if (!detail) return {};
  const title = `${detail.metric} — ${identity.name}`;
  const url = `/impact/${slug}/`;
  return {
    title,
    description: detail.outcome,
    alternates: { canonical: url },
    openGraph: { title, description: detail.outcome, url, type: "article" },
    twitter: {
      card: "summary_large_image",
      title,
      description: detail.outcome,
    },
  };
}

export default async function ImpactPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = getImpactDetail(slug);
  if (!detail) notFound();

  // Tenure comes from the organisation's timeline entry, never a hardcoded row.
  const role = getRole(detail.org);
  const meta = role
    ? [...detail.meta, { label: "Tenure", value: role.dates }]
    : detail.meta;

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-24">
      <Link
        href="/#work"
        className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to portfolio
      </Link>

      {/* Hero: the metric + one-line outcome */}
      <header className="mt-10">
        <h1 className="numeral-gradient font-display text-4xl font-bold tracking-tight sm:text-5xl">
          {detail.metric}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-foreground/90">
          {detail.outcome}
        </p>
      </header>

      {/* Metadata grid */}
      <dl className="glass mt-10 grid grid-cols-1 gap-x-8 gap-y-5 p-6 sm:grid-cols-2">
        {meta.map((m) => (
          <div key={m.label}>
            <dt className="font-mono text-xs tracking-wider uppercase text-accent-b">
              {m.label}
            </dt>
            <dd className="mt-1 text-sm text-foreground/90">{m.value}</dd>
          </div>
        ))}
      </dl>

      {/* Narrative sections */}
      <div className="mt-12 space-y-10">
        {detail.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-xl font-semibold tracking-tight">
              {section.heading}
            </h2>
            <p className="mt-3 leading-relaxed text-muted">{section.body}</p>
          </section>
        ))}
      </div>

      {/* Confidentiality-aware footer */}
      <footer className="mt-14 rounded-[20px] border border-white/[0.08] bg-white/[0.02] p-6">
        <p className="text-sm leading-relaxed text-muted">
          {confidentiality[detail.org]}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
          <a
            href={`mailto:${identity.email}`}
            className="inline-flex items-center gap-2 text-sm text-accent-a hover:underline"
          >
            <Mail className="size-4" aria-hidden />
            {identity.email}
          </a>
          <a
            href={identity.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-accent-a hover:underline"
          >
            <LinkedInMark className="size-4" />
            LinkedIn
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </footer>
    </main>
  );
}
