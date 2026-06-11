import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Sora } from "next/font/google";
import "./globals.css";
import BackgroundFX from "@/components/BackgroundFX";
import { identity } from "@/lib/content";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const title = `${identity.name} — ${identity.title}`;

export const metadata: Metadata = {
  title,
  description: identity.positioning,
  openGraph: {
    title,
    description: identity.positioning,
    type: "website",
    siteName: `${identity.name} — Portfolio`,
  },
  twitter: {
    card: "summary",
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
        {children}
      </body>
    </html>
  );
}
