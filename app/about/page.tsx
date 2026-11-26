import type { Metadata } from "next";
import { bio, timeline, principles } from "@/content/about";
import { site } from "@/content/site";
import { spec } from "@/content/home";
import { Reveal } from "@/components/ui/Reveal";
import { Clock } from "@/components/ui/Clock";
import { Icon, Diamonds } from "@/components/ui/Icon";
import { SectionHead } from "@/components/ui/SectionHead";
import { PageHero } from "@/components/layout/PageHero";
import { Timeline } from "@/components/about/Timeline";
import { JavaMap } from "@/components/about/JavaMap";

export const metadata: Metadata = {
  title: "About",
  description: `Bio, timeline, dan prinsip kerja ${site.name} — developer full-stack dari ${site.location.city}, ${site.location.province}.`,
};

const facts: [string, string][] = [
  ["Nama", site.name],
  ["Peran", site.role],
  ["Founder", `${site.founderOf} (${site.since})`],
  ["Basis", `${site.location.city}, ${site.location.province}`],
  ["Mode", "Solo developer"],
];

export default function AboutPage() {
  return (
    <>
      <PageHero status="Reading bio…" banner={String(site.since)} bannerLabel={`Ilustrasi di dalam angka ${site.since}, tahun JKT48Connect dimulai`} mirror />

      {/* bio: kartu fakta di kiri, paragraf di kanan */}
      <section aria-labelledby="bio-title" className="page-wrap pt-section">
        <SectionHead as="h1" id="bio-title" title="About" badge="02 / 05" meta="Bio, timeline, lokasi, dan aturan main" />
        <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-16">
          <aside className="md:sticky md:top-28 md:self-start">
            <div className="rounded-card border border-line">
              <div className="flex items-center justify-between border-b border-line px-4 py-3">
                <span className="text-sm font-extrabold">{site.name} {"//"}</span>
                <Diamonds size={22} />
              </div>
              <dl className="divide-y divide-hair">
                {facts.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 px-4 py-2.5">
                    <dt className="micro pt-0.5 text-mute">{k}</dt>
                    <dd className="text-sm font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="jp mt-5 text-sm font-bold leading-snug" lang="ja">
              {spec.jp.join("")}
            </p>
            <p className="micro mt-1 text-mute">{spec.jpCaption}</p>
          </aside>
          <Reveal className="max-w-2xl space-y-6">
            <h2 data-reveal className="text-[clamp(1.6rem,3.5vw,2.5rem)] font-extrabold leading-tight tracking-tight">
              Satu orang, satu ekosistem, banyak worker.
            </h2>
            {bio.map((p, i) => (
              <p key={i} data-reveal className="text-ink/85 md:text-lg">
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* timeline */}
      <section aria-labelledby="timeline-title" className="page-wrap pt-section">
        <SectionHead
          id="timeline-title"
          title="Timeline"
          badge={`${String(timeline.length).padStart(2, "0")} ENTRI`}
          meta="Tanggal ditulis hanya kalau ada sumbernya; “—” = belum terverifikasi"
        />
        <Timeline items={timeline} />
      </section>

      {/* lokasi */}
      <section aria-labelledby="loc-title" className="page-wrap pt-section">
        <SectionHead id="loc-title" title="Lokasi" badge="SMG.ID" meta="Peta ilustrasi, bukan skala sebenarnya" />
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          <JavaMap />
          <Reveal className="space-y-5">
            <h3 data-reveal className="text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-none tracking-tight">
              {site.location.city},
              <br />
              <span className="text-blue-ink">{site.location.province}</span>
            </h3>
            <dl data-reveal className="divide-y divide-hair border-y border-hair text-sm">
              <div className="flex justify-between py-2.5">
                <dt className="micro text-mute">Koordinat</dt>
                <dd className="font-mono text-xs tabular-nums">
                  {site.location.lat}, {site.location.lon}
                </dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="micro text-mute">Zona waktu</dt>
                <dd className="font-semibold">{site.location.tzLabel} (UTC+7)</dd>
              </div>
              <div className="flex justify-between py-2.5">
                <dt className="micro text-mute">Jam sekarang</dt>
                <dd className="font-semibold tabular-nums">
                  <Clock withZone={false} />
                </dd>
              </div>
            </dl>
            <p data-reveal className="micro flex items-center gap-2 text-mute">
              <Icon name="pin" size={14} className="text-blue-ink" /> titik = {site.location.city}
            </p>
          </Reveal>
        </div>
      </section>

      {/* prinsip */}
      <section aria-labelledby="principles-title" className="page-wrap pt-section">
        <SectionHead
          id="principles-title"
          title="Aturan main"
          badge={`${String(principles.length).padStart(2, "0")} RULES`}
          meta="Tiap poin ditarik dari sesuatu yang memang sudah dibangun"
        />
        <Reveal as="ol" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p) => (
            <li key={p.code} data-reveal className="flex flex-col gap-3 rounded-card border border-line p-5">
              <div className="flex items-center justify-between">
                <span className="rounded-xs bg-blue px-1.5 py-0.5 text-[0.6875rem] font-bold text-on-blue">{p.code}</span>
                <Icon name="spark" size={16} className="text-orange" />
              </div>
              <h3 className="text-xl font-extrabold tracking-tight">{p.title}</h3>
              <p className="text-sm text-mute">{p.body}</p>
              <p className="micro mt-auto border-t border-hair pt-3 text-ink/80">Bukti: {p.evidence}</p>
            </li>
          ))}
        </Reveal>
      </section>
    </>
  );
}
