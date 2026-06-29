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
import { identity } from "@/lib/content";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: identity.name,
  jobTitle: identity.title,
  email: `mailto:${identity.email}`,
  telephone: identity.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressCountry: "IN",
  },
  worksFor: { "@type": "Organization", name: identity.company },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </>
  );
}