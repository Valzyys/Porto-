import type { Metadata } from "next";
import { bio, timeline, principles } from "@/content/about";
import { site } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { AsciiDivider } from "@/components/ui/AsciiDivider";
import { Scramble } from "@/components/ui/Scramble";
import { Clock } from "@/components/ui/Clock";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { Timeline } from "@/components/about/Timeline";
import { JavaMap } from "@/components/about/JavaMap";

export const metadata: Metadata = {
  title: "About",
  description: `Bio, timeline, dan prinsip kerja ${site.name} — developer full-stack dari ${site.location.city}, ${site.location.province}.`,
};

export default function AboutPage() {
  return (
    <>
      {/* header: judul besar rata kanan, indeks di kiri */}
      <header className="gutter pt-28 md:pt-36">
        <div className="grid gap-6 md:grid-cols-[10rem_minmax(0,1fr)]">
          <p className="label">02 / about</p>
          <h1 className="text-right font-display text-[clamp(2.6rem,10vw,8.5rem)] leading-[0.88]">
            <Scramble text="DI BELAKANG" trigger="mount" className="block" />
            <Scramble text="LAYAR." trigger="mount" delay={0.2} className="block text-pink" />
          </h1>
        </div>
      </header>

      {/* bio: jendela terminal sticky di kiri, paragraf di kanan */}
      <section aria-labelledby="bio-title" className="gutter py-section">
        <AsciiDivider index="A" label="bio.txt" />
        <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <div className="px-border bg-panel">
              <div className="flex items-center gap-2 border-b border-line px-3 py-2 font-mono text-[0.65rem] uppercase tracking-widest text-mute">
                <span className="h-2 w-2 bg-pink" />
                <span className="h-2 w-2 bg-lemon" />
                <span className="h-2 w-2 bg-mint" />
                <span className="ml-2">whoami</span>
              </div>
              <dl className="space-y-2 p-4 text-xs">
                {[
                  ["nama", site.name],
                  ["peran", site.role],
                  ["founder", `${site.founderOf} (${site.since})`],
                  ["basis", `${site.location.city}, ${site.location.province}`],
                  ["mode", "solo developer"],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-2">
                    <dt className="text-mute">{k}:</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <Reveal className="max-w-2xl space-y-6">
            <h2 id="bio-title" data-reveal className="font-display text-2xl leading-tight md:text-4xl">
              Satu orang, satu ekosistem, banyak worker.
            </h2>
            {bio.map((p, i) => (
              <p key={i} data-reveal className="text-paper/85 md:text-lg">
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* timeline: rel ASCII vertikal yang tergambar mengikuti scroll */}
      <section aria-labelledby="timeline-title" className="overflow-x-clip bg-stage py-section">
        <div className="gutter">
          <AsciiDivider index="B" label="timeline" />
          <h2 id="timeline-title" className="mt-8 font-display text-[clamp(1.9rem,5vw,3.8rem)] leading-none">
            Jejak <span className="text-mint">rilis</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm text-mute">
            Tanggal ditulis hanya kalau ada sumbernya. Entri bertanda “—” belum punya tanggal yang bisa diverifikasi.
          </p>
          <Timeline items={timeline} />
        </div>
      </section>

      {/* lokasi: peta pixel + koordinat */}
      <section aria-labelledby="loc-title" className="gutter py-section">
        <AsciiDivider index="C" label="lokasi" />
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,22rem)]">
          <JavaMap />
          <Reveal className="space-y-4">
            <h2 id="loc-title" data-reveal className="font-display text-3xl leading-tight md:text-5xl">
              {site.location.city},<br />
              <span className="text-lemon">{site.location.province}</span>
            </h2>
            <dl data-reveal className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-dashed border-line pb-2">
                <dt className="text-mute">koordinat</dt>
                <dd>
                  {site.location.lat}, {site.location.lon}
                </dd>
              </div>
              <div className="flex justify-between border-b border-dashed border-line pb-2">
                <dt className="text-mute">zona waktu</dt>
                <dd>{site.location.tzLabel} (UTC+7)</dd>
              </div>
              <div className="flex justify-between border-b border-dashed border-line pb-2">
                <dt className="text-mute">jam sekarang</dt>
                <dd className="text-mint">
                  <Clock withZone={false} />
                </dd>
              </div>
            </dl>
            <p data-reveal className="flex items-center gap-2 text-xs text-mute">
              <PixelIcon name="pin" size={12} className="text-pink" /> peta ilustrasi, bukan skala sebenarnya
            </p>
          </Reveal>
        </div>
      </section>

      {/* prinsip: baris berselang-seling kiri/kanan */}
      <section aria-labelledby="principles-title" className="gutter pb-section">
        <AsciiDivider index="D" label="prinsip kerja" />
        <h2 id="principles-title" className="mt-8 font-display text-[clamp(1.9rem,5vw,3.8rem)] leading-none">
          Aturan main
        </h2>
        <p className="mt-4 max-w-xl text-sm text-mute">Bukan slogan — tiap poin ditarik dari sesuatu yang memang sudah dibangun.</p>
        <Reveal as="ol" className="mt-12 space-y-10">
          {principles.map((p, i) => (
            <li
              key={p.code}
              data-reveal
              className={`grid max-w-3xl gap-3 md:grid-cols-[6rem_minmax(0,1fr)] ${i % 2 ? "md:ml-auto" : ""}`}
            >
              <span className="font-display text-5xl leading-none text-line">{p.code}</span>
              <div>
                <h3 className="font-display text-xl text-paper md:text-2xl">{p.title}</h3>
                <p className="mt-2 text-paper/85">{p.body}</p>
                <p className="mt-3 inline-block bg-stage px-2 py-1 text-xs text-mint">bukti: {p.evidence}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </section>
    </>
  );
}
