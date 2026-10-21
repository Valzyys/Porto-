import type { Metadata, Viewport } from "next";
import { Silkscreen, Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { tokensToCss, color, colorLight } from "@/design/tokens";
import { site } from "@/content/site";
import { introHeadScript, themeHeadScript } from "@/lib/intro";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { TransitionProvider } from "@/components/transition/TransitionProvider";
import { Intro } from "@/components/layout/Intro";
import { HudMenu } from "@/components/nav/HudMenu";
import { CornerMark } from "@/components/layout/CornerMark";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/ui/Cursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// Font di-self-host oleh next/font saat build → tidak ada fetch font saat runtime.
const silkscreen = Silkscreen({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-silkscreen",
  display: "swap",
});
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

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
    { media: "(prefers-color-scheme: dark)", color: color.ink },
    { media: "(prefers-color-scheme: light)", color: colorLight.ink },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const headScript = `document.documentElement.classList.add("js");${introHeadScript}${themeHeadScript}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${silkscreen.variable} ${bricolage.variable} ${jetbrains.variable}`} suppressHydrationWarning>
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
          className="sr-only z-cursor bg-lemon px-3 py-2 font-display text-xs text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Lompat ke konten
        </a>
        <SmoothScroll />
        <TransitionProvider>
          <Intro />
          <ScrollProgress />
          <CornerMark />
          <ThemeToggle floating />
          <main id="main">{children}</main>
          <Footer />
          <HudMenu />
        </TransitionProvider>
        <Cursor />
      </body>
    </html>
  );
}
