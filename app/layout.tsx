import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";
import RevealController from "@/components/RevealController";
import SmoothScroll from "@/components/SmoothScroll";
import { identity } from "@/lib/content";

// display: swap → text paints immediately in the fallback and swaps when the
// webfont arrives, so the hero copy (the LCP element) never blocks on fonts.
// Geist and Instrument Serif stand in for the reference's commercial Suisse
// Intl and PP Eiko Italic (docs/redesign/SPEC.md §3.1).
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
  display: "swap",
});

const title = `${identity.name} — ${identity.title}`;

export const metadata: Metadata = {
  metadataBase: new URL(identity.siteUrl),
  title,
  description: identity.positioning,
  openGraph: {
    title,
    description: identity.positioning,
    type: "website",
    siteName: `${identity.name} — Portfolio`,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: identity.positioning,
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${instrument.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Before first paint: marks JS as available so load animations can
            start from their hidden frame. Without JS nothing is ever hidden. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="bg-bg font-sans text-ink antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <RevealController />
        {children}
      </body>
    </html>
  );
}
