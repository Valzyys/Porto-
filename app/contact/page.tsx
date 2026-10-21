import type { Metadata } from "next";
import { contacts, site } from "@/content/site";
import { Scramble } from "@/components/ui/Scramble";
import { Reveal } from "@/components/ui/Reveal";
import { PixelIcon, type IconName } from "@/components/pixel/PixelIcon";
import { CopyButton } from "@/components/ui/CopyButton";

export const metadata: Metadata = {
  title: "Contact",
  description: `Kontak ${site.name}: GitHub, npm, email, dan Telegram.`,
};

const ICON: Record<string, IconName> = {
  github: "code",
  "github-org": "code",
  npm: "box",
  email: "mail",
  telegram: "plane",
};

export default function ContactPage() {
  return (
    <div className="gutter pb-section pt-28 md:pt-36">
      <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,40rem)] lg:gap-16">
        <header>
          <p className="label">05 / contact</p>
          <h1 className="mt-4 font-display text-[clamp(3rem,13vw,10rem)] leading-[0.85]">
            <Scramble text="ENCORE" trigger="mount" className="block" />
            <span className="block text-pink">!</span>
          </h1>
          <p className="mt-6 max-w-md text-paper/85">
            Tidak ada form di sini — situs ini tidak punya backend. Pakai salah satu jalur di daftar ini. GitHub paling cepat
            dicek.
          </p>
          <p className="mt-6 flex items-center gap-2 text-xs text-mute">
            <PixelIcon name="pin" size={12} className="text-pink" />
            {site.location.city}, {site.location.province} · {site.location.tzLabel}
          </p>
        </header>

        {/* jendela terminal berisi daftar kontak */}
        <section aria-labelledby="contact-list" className="px-border self-start bg-panel">
          <div className="flex items-center justify-between border-b border-line px-4 py-2 font-mono text-[0.65rem] uppercase tracking-widest text-mute">
            <span id="contact-list">~/contacts</span>
            <span>{contacts.length} entri</span>
          </div>
          <Reveal as="ul" className="divide-y divide-line">
            {contacts.map((c) => (
              <li key={c.id} data-reveal className="p-4 md:p-5">
                <p className="text-xs text-mute">
                  <span className="text-mint">$</span> open {c.id}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-3">
                    <PixelIcon name={ICON[c.id] ?? "external"} size={20} className={c.verified ? "text-lemon" : "text-line"} />
                    <span className="min-w-0">
                      <span className="label block">{c.label}</span>
                      {c.href && c.value ? (
                        <a
                          href={c.href}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all font-display text-base hover:text-pink md:text-lg"
                          data-cursor="OPEN"
                        >
                          {c.value}
                          <span className="sr-only"> (tab baru)</span>
                        </a>
                      ) : (
                        <span className="font-display text-base text-mute md:text-lg">[ belum diisi ]</span>
                      )}
                    </span>
                  </span>
                  {c.href && <CopyButton value={c.href} label={`Salin tautan ${c.label}`} />}
                </div>
                <p className="mt-2 text-xs text-mute">{c.note}</p>
              </li>
            ))}
          </Reveal>
        </section>
      </div>
    </div>
  );
}
