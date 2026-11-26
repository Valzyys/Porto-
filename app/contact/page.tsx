import type { Metadata } from "next";
import { contacts, site } from "@/content/site";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ChatLog, type ChatItem } from "@/components/ui/ChatLog";
import { CopyButton } from "@/components/ui/CopyButton";
import { SectionHead } from "@/components/ui/SectionHead";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: `Kontak ${site.name}: GitHub, npm, email, dan Telegram.`,
};

const ICON: Record<string, IconName> = {
  github: "code",
  "github-org": "code",
  npm: "box",
  email: "mail",
  telegram: "send",
};

const verified = contacts.filter((c) => c.href && c.value);

/** Kontak disajikan sebagai obrolan, plus daftar lengkap di bawahnya. */
const conversation: ChatItem[] = [
  { key: "q1", from: "visitor", content: "Mau ngobrol soal proyek, lewat mana?" },
  { key: "a1", from: "valzyy", content: "GitHub paling cepat dicek." },
  ...verified.map<ChatItem>((c) => ({
    key: c.id,
    from: "valzyy",
    content: (
      <a href={c.href!} target="_blank" rel="noreferrer" className="underline decoration-1 underline-offset-2 [overflow-wrap:anywhere]">
        {c.label}: {c.value} <Icon name="arrowUpRight" size={12} className="inline align-[-2px]" />
        <span className="sr-only">(tab baru)</span>
      </a>
    ),
  })),
  { key: "q2", from: "visitor", content: "Email? Telegram?" },
  { key: "a2", from: "valzyy", content: "Belum dipublikasikan — segera." },
  { key: "sys", from: "system", content: "— tidak ada form di sini: situs ini tidak punya backend —" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero status="Opening channel…" banner="HI!" bannerLabel="Ilustrasi di dalam tulisan HI!" tone="orange" mirror />

      <section aria-labelledby="contact-title" className="page-wrap pt-section">
        <SectionHead
          as="h1"
          id="contact-title"
          title="Contact"
          badge="05 / 05"
          meta={`${site.location.city}, ${site.location.province} · ${site.location.tzLabel}`}
        />

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="rounded-card border border-line p-5 md:p-6">
            <p className="micro mb-4 flex items-center justify-between text-mute">
              <span>Chat // {site.name}</span>
              <span className="flex items-center gap-1.5">
                <span className="blink h-2 w-2 rounded-pill bg-blue" /> Contoh obrolan
              </span>
            </p>
            <ChatLog label="Obrolan kontak" items={conversation} />
          </div>

          <Reveal as="ul" className="divide-y divide-hair self-start rounded-card border border-line">
            {contacts.map((c) => (
              <li key={c.id} data-reveal className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <span className="flex min-w-0 items-center gap-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-pill border border-line ${c.verified ? "bg-blue text-on-blue" : "text-mute"}`}>
                    <Icon name={ICON[c.id] ?? "arrowUpRight"} size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="micro block text-mute">{c.label}</span>
                    {c.href && c.value ? (
                      <a href={c.href} target="_blank" rel="noreferrer" className="block truncate text-base font-extrabold tracking-tight hover:text-blue-ink">
                        {c.value}
                        <span className="sr-only"> (tab baru)</span>
                      </a>
                    ) : (
                      <span className="block text-base font-bold text-mute">[ belum diisi ]</span>
                    )}
                    <span className="block truncate text-xs text-mute">{c.note}</span>
                  </span>
                </span>
                {c.href && <CopyButton value={c.href} label={`Salin tautan ${c.label}`} />}
              </li>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
