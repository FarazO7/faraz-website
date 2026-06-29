import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";
import BackgroundFX from "@/components/BackgroundFX";
import SmoothScroll from "@/components/SmoothScroll";
import { identity } from "@/lib/content";

// display: swap → text paints immediately in the fallback and swaps when the
// webfont arrives, so the hero copy (the LCP element) never blocks on fonts.
const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const title = `${identity.name} — ${identity.title}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://faraz-website.vercel.app"),
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
  themeColor: "#070B14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="bg-ink font-sans text-foreground antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <BackgroundFX />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}