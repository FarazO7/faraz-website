import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Metrics from "@/components/Metrics";
import Section from "@/components/Section";
import CaseStudies from "@/components/CaseStudies";
import BuiltProjects from "@/components/BuiltProjects";
import Experience from "@/components/Experience";
import Achievements from "@/components/Achievements";
import GitHubSection from "@/components/GitHubSection";
import Skills from "@/components/Skills";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import { currentRole, identity } from "@/lib/content";

// Home-specific canonical + og:url (resolved against metadataBase in layout).
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  url: identity.siteUrl,
  jobTitle: currentRole.title,
  email: `mailto:${identity.email}`,
  telephone: identity.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressCountry: "IN",
  },
  worksFor: { "@type": "Organization", name: currentRole.company },
  sameAs: [identity.linkedin, identity.github],
};

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Section id="impact" kicker="Impact" title="Proof in the numbers">
          <Metrics />
        </Section>
        <CaseStudies />
        <BuiltProjects />
        <Experience />
        <Achievements />
        <GitHubSection />
        <Skills />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Escape "<" so no string can close the script tag (Next JSON-LD guide).
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </>
  );
}