import { Hero } from "@/components/home/Hero";
import { ProfileCard } from "@/components/home/ProfileCard";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Reveal } from "@/components/ui/Reveal";
import { AsciiDivider } from "@/components/ui/AsciiDivider";
import { Marquee } from "@/components/ui/Marquee";
import { Magnetic } from "@/components/ui/Magnetic";
import { Scramble } from "@/components/ui/Scramble";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { marqueeStack } from "@/content/stack";
import { site } from "@/content/site";

export default function HomePage() {
  const half = Math.ceil(marqueeStack.length / 2);
  return (
    <>
      <Hero />

      {/* 01 — siapa: kartu member di kiri (miring), teks di kanan */}
      <section aria-labelledby="who-title" className="gutter relative py-section">
        <AsciiDivider index="01" label="siapa" />
        <div className="mt-12 grid items-center gap-12 md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20">
          <div className="flex justify-center md:-rotate-2 md:justify-start">
            <ProfileCard />
          </div>
          <Reveal className="max-w-2xl">
            <h2 id="who-title" data-reveal className="font-display text-[clamp(1.9rem,5vw,3.8rem)] leading-[1.05]">
              Kerja di <span className="text-mint">belakang layar</span>, buat yang nonton di depan.
            </h2>
            <p data-reveal className="mt-6 text-paper/85">
              Valzyy itu developer full-stack independen dari {site.location.city}. Mulai pertengahan {site.since}, dia
              membangun <strong className="font-normal text-pink">{site.founderOf}</strong> sendirian: API data, live
              streaming yang dikunci token, payment gateway QRIS, sistem partner, aplikasi mobile, sampai bot di X,
              WhatsApp, dan Telegram.
            </p>
            <p data-reveal className="mt-4 text-paper/85">
              Hampir semuanya jalan di Cloudflare Workers. Datanya di CockroachDB lewat Hyperdrive, atau KV/R2/D1 kalau
              cukup. Di luar itu, dia bantu urusan IT lintas divisi di fanbase Cavallery, FritzyForce, dan Nayrakuen.
            </p>
            <div data-reveal className="mt-8">
              <TransitionLink
                href="/about"
                className="inline-flex items-center gap-2 border-b-2 border-pink pb-1 font-display text-sm hover:text-pink"
                data-cursor="BIO"
              >
                <Scramble text="baca bio lengkap" trigger="hover" duration={0.5} />
                <PixelIcon name="arrow" size={12} />
              </TransitionLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 02 — proyek unggulan: section pinned horizontal */}
      <FeaturedProjects />

      {/* 03 — stack: banner panggung dua arah */}
      <section aria-labelledby="stack-title" className="relative overflow-hidden py-section">
        <div className="gutter mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <AsciiDivider index="03" label="yang paling sering diputar" className="mb-6 w-[min(80vw,40rem)]" />
            <h2 id="stack-title" className="font-display text-[clamp(1.9rem,5vw,3.8rem)] leading-none">
              Stack
            </h2>
          </div>
          <TransitionLink href="/stack" className="flex items-center gap-2 text-sm text-mute hover:text-lemon" data-cursor="STACK">
            lihat setlist lengkap <PixelIcon name="arrow" size={12} />
          </TransitionLink>
        </div>
        <div className="-rotate-2 scale-[1.04]">
          <Marquee
            label="Stack utama bagian 1"
            className="border-y-4 border-ink bg-pink py-3 text-ink"
            itemClassName="font-display text-xl md:text-4xl"
            separator={<PixelIcon name="star" size={18} className="mx-6" />}
            items={marqueeStack.slice(0, half)}
          />
          <Marquee
            label="Stack utama bagian 2"
            direction={-1}
            speed={0.85}
            className="border-b-4 border-ink bg-mint py-3 text-ink"
            itemClassName="font-mono text-lg md:text-3xl"
            separator={<PixelIcon name="penlight" size={18} className="mx-6" />}
            items={marqueeStack.slice(half)}
          />
        </div>
      </section>

      {/* 04 — CTA: spotlight tunggal di tengah panggung */}
      <section aria-labelledby="cta-title" className="gutter relative isolate overflow-hidden py-section text-center">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 mx-auto h-full max-w-3xl"
          style={{
            background:
              "conic-gradient(from 180deg at 50% -10%, transparent 160deg, color-mix(in srgb, var(--c-lemon) 16%, transparent) 172deg, color-mix(in srgb, var(--c-lemon) 22%, transparent) 180deg, color-mix(in srgb, var(--c-lemon) 16%, transparent) 188deg, transparent 200deg)",
          }}
        />
        <Reveal>
          <p data-reveal className="label">— 04 / encore —</p>
          <h2 id="cta-title" data-reveal className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2.6rem,10vw,8rem)] leading-[0.9]">
            <Scramble text="ENCORE?" />
          </h2>
          <p data-reveal className="mx-auto mt-6 max-w-xl text-paper/85">
            Butuh API, bot, atau sesuatu yang jalan di edge? Ngobrol dulu aja — mulai dari GitHub.
          </p>
          <div data-reveal className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Magnetic>
              <TransitionLink
                href="/contact"
                className="inline-flex items-center gap-3 bg-pink px-6 py-4 font-display text-sm text-ink shadow-[6px_6px_0_0_var(--c-paper)] hover:bg-paper"
                data-cursor="HI!"
              >
                <PixelIcon name="mail" size={16} /> kontak
              </TransitionLink>
            </Magnetic>
            <Magnetic strength={0.25}>
              <TransitionLink
                href="/projects"
                className="inline-flex items-center gap-3 border-2 border-paper px-6 py-4 font-display text-sm hover:border-mint hover:text-mint"
                data-cursor="LIST"
              >
                <PixelIcon name="folder" size={16} /> semua proyek
              </TransitionLink>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </>
  );
}
