"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { featuredProjects } from "@/content/projects";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { AsciiDivider } from "@/components/ui/AsciiDivider";

const ACCENT = {
  pink: "text-pink",
  mint: "text-mint",
  lemon: "text-lemon",
  peach: "text-peach",
} as const;

/**
 * Cerita proyek unggulan dalam section yang di-pin:
 * desktop (≥1024px) bergulir horizontal mengikuti scroll vertikal,
 * mobile/tablet tetap tumpukan vertikal biasa.
 */
export function FeaturedProjects() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const track = ref.current?.querySelector<HTMLElement>("[data-track]");
      const counter = ref.current?.querySelector<HTMLElement>("[data-count]");
      const bar = ref.current?.querySelector<HTMLElement>("[data-bar]");
      if (!track) return;
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", track);
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            pin: true,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const i = Math.min(panels.length, Math.floor(self.progress * panels.length) + 1);
              if (counter) counter.textContent = String(i).padStart(2, "0");
              if (bar) bar.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
        // tiap panel: isi muncul saat masuk area pandang horizontal
        panels.forEach((panel) => {
          gsap.from(panel.querySelectorAll("[data-in]"), {
            autoAlpha: 0,
            y: 30,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 75%", toggleActions: "play none none reverse" },
          });
        });
      });

      mm.add("(max-width: 1023px), (prefers-reduced-motion: reduce)", () => {
        panels.forEach((panel) => {
          gsap.from(panel, {
            autoAlpha: 0,
            y: 40,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: panel, start: "top 85%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="featured-title" className="relative overflow-hidden bg-stage py-16 lg:flex lg:h-[100svh] lg:flex-col lg:py-0">
      <div className="gutter lg:pt-20">
        <AsciiDivider index="02" label="setlist proyek" />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <h2 id="featured-title" className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-none">
            Setlist <span className="text-pink">utama</span>
          </h2>
          <p className="hidden items-center gap-3 font-mono text-xs uppercase tracking-widest text-mute lg:flex">
            track <span data-count className="text-paper">01</span>/{String(featuredProjects.length).padStart(2, "0")}
            <span className="relative block h-1 w-32 bg-line">
              <span data-bar className="absolute inset-0 origin-left bg-pink" style={{ transform: "scaleX(0)" }} />
            </span>
          </p>
        </div>
      </div>

      <div className="mt-10 lg:mt-auto lg:mb-auto">
        <ol data-track className="gutter flex flex-col gap-6 lg:w-max lg:flex-row lg:gap-10 lg:pr-[30vw]">
          {featuredProjects.map((p, i) => (
            <li
              key={p.slug}
              data-panel
              className="px-border relative flex flex-col bg-ink p-5 md:p-7 lg:h-[62svh] lg:w-[min(72vw,56rem)]"
            >
              <div data-in className="flex items-start justify-between gap-4">
                <span className={`font-display text-[clamp(3rem,8vw,6rem)] leading-none ${ACCENT[p.accent]}`}>
                  M{String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex flex-wrap justify-end gap-1">
                  {p.categories.map((c) => (
                    <span key={c} className="chip">
                      {c}
                    </span>
                  ))}
                </span>
              </div>

              <div className="mt-4 grid gap-6 lg:mt-auto lg:grid-cols-[1.1fr_minmax(0,1fr)]">
                <div>
                  <h3 data-in className="font-display text-2xl leading-tight md:text-4xl">
                    {p.name}
                  </h3>
                  <p data-in className="mt-3 text-sm text-paper/85 md:text-base">
                    {p.tagline}
                  </p>
                  <p data-in className="mt-3 text-xs text-mute">
                    <span className="label">peran</span> {p.role}
                  </p>
                  <ul data-in className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
                    {p.stack.slice(0, 6).map((s) => (
                      <li key={s} className="chip">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
                {p.diagram ? (
                  <pre
                    data-in
                    aria-hidden="true"
                    className="hidden self-end overflow-hidden bg-stage p-3 text-[0.62rem] leading-[1.35] text-mint/80 lg:block"
                  >
                    {p.diagram}
                  </pre>
                ) : (
                  <p data-in className="hidden self-end font-mono text-xs uppercase leading-relaxed tracking-widest text-line lg:block">
                    {p.challenges[0]}
                  </p>
                )}
              </div>

              <TransitionLink
                data-in
                href={`/projects/${p.slug}`}
                className="group mt-6 inline-flex w-fit items-center gap-3 bg-paper px-4 py-2 font-display text-xs text-ink hover:bg-pink focus-visible:bg-pink"
                data-cursor="CASE"
              >
                studi kasus
                <PixelIcon name="arrow" size={14} className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1" />
              </TransitionLink>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
