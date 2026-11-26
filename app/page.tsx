import { ProgressCard } from "@/components/ui/ProgressCard";
import { MaskedBanner } from "@/components/art/MaskedBanner";
import { SpecGrid } from "@/components/home/SpecGrid";
import { StatBar } from "@/components/home/StatBar";
import { FeaturedProjects } from "@/components/home/FeaturedProjects";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      <section aria-label="Pembuka" className="page-wrap flex flex-col gap-10 pt-4 md:gap-14 md:pt-8">
        <ProgressCard label="Loading stage…" />
        <MaskedBanner text="2026" label={`Ilustrasi panggung di dalam angka 2026 — portofolio ${site.name}`} />
        <SpecGrid />
        <StatBar />
      </section>

      <FeaturedProjects />

      {/* ajakan kontak */}
      <section aria-labelledby="cta-title" className="page-wrap">
        <Reveal className="grid items-end gap-8 rounded-card border border-line p-6 md:grid-cols-[1fr_auto] md:p-10">
          <div className="min-w-0">
            <span data-reveal className="inline-block rounded-xs bg-blue px-1.5 py-0.5 text-[0.6875rem] font-bold text-on-blue">
              NEXT
            </span>
            <h2 id="cta-title" data-reveal className="mt-3 text-[clamp(2rem,6vw,4.5rem)] font-extrabold leading-[0.95] tracking-tight">
              Butuh API, bot, atau sesuatu di edge? <span className="text-mute">{"//"}</span>
            </h2>
            <p data-reveal className="mt-4 max-w-xl text-mute">
              Ngobrol dulu aja. GitHub paling cepat dicek; kanal lain ada di halaman kontak.
            </p>
          </div>
          <div data-reveal className="flex flex-wrap gap-3">
            <Magnetic>
              <TransitionLink
                href="/contact"
                className="inline-flex items-center gap-2 rounded-pill bg-blue px-6 py-3.5 text-sm font-bold text-on-blue transition-colors duration-150 hover:bg-ink hover:text-canvas"
              >
                <Icon name="mail" size={16} /> Kontak
              </TransitionLink>
            </Magnetic>
            <Magnetic strength={0.25}>
              <TransitionLink
                href="/projects"
                className="inline-flex items-center gap-2 rounded-pill border border-line px-6 py-3.5 text-sm font-bold transition-colors duration-150 hover:bg-ink hover:text-canvas"
              >
                Semua proyek <Icon name="arrowUpRight" size={16} />
              </TransitionLink>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </>
  );
}
