import type { Metadata } from "next";
import { modules, methodCount } from "@/content/api";
import { pkg, releases } from "@/content/pkg";
import { Headline } from "@/components/ui/Headline";
import { PixelArt } from "@/components/art/PixelArt";
import { PixelBars } from "@/components/art/PixelBars";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { InstallBar } from "@/components/client/InstallBar";
import { TerminalDemo } from "@/components/client/TerminalDemo";
import { ReleaseChart } from "@/components/client/ReleaseChart";
import type { ArtName } from "@/lib/pixel";

export const metadata: Metadata = {
  title: "Client",
  description: "Tur JKT48Client: instalasi, anatomi request, tujuh layanan, priority token, error handling, dan riwayat rilis.",
};

const features: { art: ArtName; title: string; text: string; links: { href: string; label: string; dark?: boolean }[] }[] = [
  {
    art: "hexagon",
    title: "Jalan di mana saja",
    text: "ESM untuk bundler, CommonJS untuk Node.js lama, UMD untuk tag script dengan global JKT48Client. Contoh React ikut di docs.",
    links: [
      { href: "/docs/installation", label: "Installation", dark: true },
      { href: "/docs/browser", label: "Browser" },
    ],
  },
  {
    art: "blocks",
    title: `${modules.length - 1} layanan, ${methodCount} method`,
    text: "members, live, events, media, admin, changelog, dan garden — masing-masing properti di instance client.",
    links: [
      { href: "/modules", label: "Browse modules", dark: true },
      { href: "/docs/endpoints", label: "Endpoints" },
    ],
  },
  {
    art: "key",
    title: "Priority token",
    text: "Satu opsi, tiga tempat: header x-priority-token, query priority_token, dan body POST/PUT. Bisa diganti saat runtime.",
    links: [
      { href: "/docs/priority-token", label: "Priority token", dark: true },
      { href: "/access", label: "Access" },
    ],
  },
  {
    art: "warning",
    title: "Error yang terbaca",
    text: "Error axios dibungkus jadi pesan jelas: API Error (status), Network Error, atau Request Error.",
    links: [{ href: "/docs/error-handling", label: "Error handling", dark: true }],
  },
];

export default function ClientPage() {
  const firstDate = new Date(`${releases[0].date}T00:00:00Z`).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  return (
    <div className="page-wrap">
      {/* hero tengah */}
      <section className="mx-auto max-w-3xl pt-16 text-center md:pt-24">
        <h1 className="text-[40px] font-medium leading-tight tracking-[-0.03em] md:text-[56px]">
          Satu <span className="text-blue">client</span>, semua data.
        </h1>
        <p className="mt-3 text-mute">Kecil, satu dependensi, dan jalan di Node.js, browser, maupun React.</p>
        <div className="mx-auto mt-8 max-w-2xl text-left">
          <InstallBar />
        </div>
        <p className="micro mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-mute">
          <TransitionLink href="/docs/quickstart" className="hover:text-ink">
            Quickstart
          </TransitionLink>
          <TransitionLink href="/docs/configuration" className="hover:text-ink">
            Configuration
          </TransitionLink>
          <a href={pkg.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-ink">
            Source on GitHub <Icon name="arrowUpRight" size={11} />
          </a>
        </p>
        <a
          href={pkg.links.apiDocs}
          target="_blank"
          rel="noreferrer"
          className="group mx-auto mt-6 flex max-w-2xl items-center justify-between gap-4 border border-blue/40 bg-blue-soft px-4 py-3 text-left text-sm transition-colors duration-150 hover:border-blue"
        >
          <span className="flex items-center gap-3">
            <Icon name="key" size={18} className="text-blue" />
            <span>
              <span className="micro block text-blue">API key</span>
              Butuh API key? Dapatkan dari JKT48Connect.
            </span>
          </span>
          <span className="micro flex shrink-0 items-center gap-1 text-blue">
            docs.jkt48connect.com <Icon name="arrowUpRight" size={11} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </a>
      </section>

      {/* demo terminal */}
      <section className="mt-14 md:mt-20" aria-label="Demo anatomi request">
        <TerminalDemo />
      </section>

      {/* bingkai kedua */}
      <section className="mt-section border border-line">
        <div className="relative px-6 pt-8 md:px-9 md:pt-10">
          <Headline as="h2" lead="@jkt48/core" rest="ditulis khusus untuk JKT48Connect." className="max-w-2xl text-[28px] leading-[1.15] md:text-[40px]" />
          <div className="mt-5 flex flex-wrap gap-2">
            <TransitionLink href="/docs/installation" className="btn btn-dark">
              Install <Icon name="chevronRight" size={12} />
            </TransitionLink>
            <TransitionLink href="/docs" className="btn btn-light">
              Docs
            </TransitionLink>
          </div>
        </div>
        <div className="mt-6 h-28">
          <PixelBars />
        </div>

        <div className="grid border-t border-line md:grid-cols-2">
          {features.map((f, i) => (
            <Reveal key={f.title} className={`flex flex-col p-6 md:p-9 ${i % 2 === 0 ? "md:border-r md:border-line" : ""} ${i > 0 ? "border-t border-line" : ""} ${i === 1 ? "md:border-t-0" : ""}`}>
              <div className="mx-auto w-full max-w-xs py-4">
                <PixelArt name={f.art} label={`Ilustrasi pixel: ${f.title}`} />
              </div>
              <h3 data-reveal className="mt-6 text-[22px] font-medium tracking-[-0.02em]">
                {f.title}
              </h3>
              <p data-reveal className="mt-2 max-w-md text-mute">
                {f.text}
              </p>
              <div data-reveal className="mt-5 flex flex-wrap gap-2">
                {f.links.map((l) => (
                  <TransitionLink key={l.href} href={l.href} className={`btn ${l.dark ? "btn-dark" : "btn-light"}`}>
                    {l.label} {l.dark && <Icon name="chevronRight" size={12} />}
                  </TransitionLink>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* riwayat rilis */}
      <section className="mt-section border border-line p-6 md:p-9" aria-label="Riwayat rilis">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Headline as="h2" lead="Releases" rest="langsung dari registry npm." className="text-[28px] leading-tight md:text-[40px]" />
          <TransitionLink href="/docs/versions" className="btn btn-dark">
            All versions <Icon name="chevronRight" size={12} />
          </TransitionLink>
        </div>
        <div className="mt-10">
          <ReleaseChart />
        </div>
        <div className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-3">
          <div>
            <p className="text-[28px] font-medium tabular-nums">{releases.length}</p>
            <p className="micro text-mute">rilis tercatat</p>
          </div>
          <div>
            <p className="text-[28px] font-medium tabular-nums">{releases.filter((r) => r.available).length}</p>
            <p className="micro text-mute">masih tersedia di npm</p>
          </div>
          <div>
            <p className="text-[28px] font-medium">{firstDate}</p>
            <p className="micro text-mute">rilis pertama (v{releases[0].version})</p>
          </div>
        </div>
      </section>
    </div>
  );
}
