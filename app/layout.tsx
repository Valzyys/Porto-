import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Silkscreen } from "next/font/google";
import "./globals.css";
import { tokensToCss, color, colorDark } from "@/design/tokens";
import { site } from "@/content/site";
import { headScript } from "@/lib/head";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { TransitionProvider } from "@/components/transition/TransitionProvider";
import { TopBar } from "@/components/site/TopBar";
import { Footer } from "@/components/site/Footer";
import { SearchDialog } from "@/components/site/SearchDialog";

// Font di-self-host oleh next/font saat build → tidak ada fetch font saat runtime.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const silkscreen = Silkscreen({ weight: "400", subsets: ["latin"], variable: "--font-silkscreen", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  authors: [{ name: site.maker }],
  openGraph: { title: site.title, description: site.description, type: "website", locale: "id_ID" },
  twitter: { card: "summary", title: site.title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: color.canvas },
    { media: "(prefers-color-scheme: dark)", color: colorDark.canvas },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geist.variable} ${geistMono.variable} ${silkscreen.variable}`} suppressHydrationWarning>
      <head>
        <style id="design-tokens" dangerouslySetInnerHTML={{ __html: tokensToCss() }} />
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-svh antialiased">
        <a href="#main" className="btn btn-dark sr-only z-dialog focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          Lompat ke konten
        </a>
        <SmoothScroll />
        <TransitionProvider>
          <TopBar />
          <main id="main">{children}</main>
          <Footer />
          <SearchDialog />
        </TransitionProvider>
      </body>
    </html>
  );
}
