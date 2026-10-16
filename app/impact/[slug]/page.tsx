import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import Divider from "@/components/Divider";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import Words from "@/components/Words";
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

// Meta tiles cycle the reference's bento surfaces.
const TONES = ["bg-blue-50", "bg-pink-50", "bg-surface-3", "bg-surface-2"];

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
  // A heading that opens with a figure ("61%", "~120", "100 → 30") sets that
  // figure in the serif italic, like the reference's stat numerals.
  const lead = detail.metric.split(" ")[0];
  const accent = /^[~−+\-\d]/.test(lead) ? lead : undefined;

  return (
    <>
      <Nav base="/" />
      <main id="main" className="wrap pt-28 pb-20 md:pt-40 md:pb-28">
        <Link href="/#work" className="dot-link text-[0.9375rem]">
          <span className="inline-flex items-center gap-2">
            <ArrowLeft className="size-4" aria-hidden />
            Back to portfolio
          </span>
        </Link>

        <header className="mt-10 md:mt-14">
          <h1 className="t-h1 enter-words max-w-[22ch]">
            <Words text={detail.metric} accent={accent} />
          </h1>
          <p className="t-lead prose-measure enter-fade mt-6 text-muted" style={{ "--d": "0.35s" } as CSSProperties}>
            {detail.outcome}
          </p>
        </header>

        <dl className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
          {meta.map((m, i) => (
            <div
              key={m.label}
              className={`rounded-[var(--radius)] p-6 ${TONES[i % TONES.length]}`}
              data-reveal="up"
              style={{ "--i": i } as CSSProperties}
            >
              <dt className="t-label">{m.label}</dt>
              <dd className="mt-2 text-[1.0625rem] leading-snug">{m.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 md:mt-24">
          {detail.sections.map((section) => (
            <section key={section.heading}>
              <Divider />
              <div className="grid gap-4 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-12 md:py-14" data-reveal="up">
                <h2 className="t-h3">{section.heading}</h2>
                <p className="prose-measure leading-relaxed text-muted">{section.body}</p>
              </div>
            </section>
          ))}
        </div>

        {/* Confidentiality-aware close */}
        <footer className="mt-6 rounded-[var(--radius)] bg-ink p-7 text-white md:p-12" data-reveal="up">
          <p className="prose-measure leading-relaxed text-[var(--on-dark-muted)]">
            {confidentiality[detail.org]}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`mailto:${identity.email}`} className="btn btn-primary">
              <Mail className="size-4" aria-hidden />
              {identity.email}
            </a>
            <a
              href={identity.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-on-dark"
            >
              <LinkedInMark className="size-4" />
              LinkedIn
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </footer>
      </main>
      <Footer base="/" />
    </>
  );
}
