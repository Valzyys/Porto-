import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { tokensToCss, color, colorDark } from "@/design/tokens";
import { site } from "@/content/site";
import { introHeadScript, themeHeadScript } from "@/lib/intro";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { TransitionProvider } from "@/components/transition/TransitionProvider";
import { Intro } from "@/components/layout/Intro";
import { TopBar } from "@/components/layout/TopBar";
import { Footer } from "@/components/layout/Footer";

// Font di-self-host oleh next/font saat build → tidak ada fetch font saat runtime.
// Archivo variable: sumbu berat + lebar (wdth 62–125) dipakai banner & judul.
const archivo = Archivo({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  authors: [{ name: site.name }],
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    locale: "id_ID",
  },
  twitter: { card: "summary", title: site.title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: color.canvas },
    { media: "(prefers-color-scheme: dark)", color: colorDark.canvas },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const headScript = `document.documentElement.classList.add("js");${introHeadScript}${themeHeadScript}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${archivo.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <style id="design-tokens" dangerouslySetInnerHTML={{ __html: tokensToCss() }} />
        <script dangerouslySetInnerHTML={{ __html: headScript }} />
        <noscript>
          <style>{`[data-intro]{display:none!important}[data-reveal]{opacity:1!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-svh antialiased">
        <a
          href="#main"
          className="sr-only z-intro rounded-pill bg-blue px-4 py-2 text-xs font-bold text-on-blue focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Lompat ke konten
        </a>
        <SmoothScroll />
        <TransitionProvider>
          <Intro />
          <TopBar />
          <main id="main">{children}</main>
          <Footer />
        </TransitionProvider>
      </body>
    </html>
  );
}
