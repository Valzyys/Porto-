"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { site } from "@/content/site";
import { useIntroDone } from "@/lib/stores";
import { Scramble } from "@/components/ui/Scramble";
import { PixelIcon } from "@/components/pixel/PixelIcon";
import { Clock } from "@/components/ui/Clock";

// canvas di-lazy-load: tidak ikut bundle awal, tidak dirender di server
const AsciiStage = dynamic(() => import("@/components/ascii/AsciiStage"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 dither [--dither-c:var(--c-stage)]" />,
});

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef({ v: 0 });
  const frameRef = useRef<HTMLSpanElement>(null);
  const ready = useIntroDone();
  const getProgress = useCallback(() => progress.current.v, []);
  const onFrame = useCallback((n: number) => {
    if (frameRef.current) frameRef.current.textContent = String(n).padStart(6, "0");
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // scroll: lampu meredup (via progress), lapisan bergerak beda kecepatan
        gsap.to(progress.current, {
          v: 1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-layer='stage']", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-layer='name']", {
          yPercent: -35,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-layer='meta']", {
          yPercent: -80,
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top top", end: "60% top", scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  // detail mikro muncul setelah intro selesai
  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-hud-in]", {
          autoAlpha: 0,
          y: 12,
          duration: motion.dur.base,
          ease: motion.ease.out,
          stagger: motion.stagger.base,
          delay: 0.25,
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [ready] },
  );

  return (
    <section
      ref={ref}
      aria-labelledby="hero-title"
      className="relative isolate flex h-[100svh] min-h-[600px] flex-col overflow-hidden bg-ink"
    >
      <div data-layer="stage" className="absolute inset-0 -z-10">
        <AsciiStage getProgress={getProgress} onFrame={onFrame} />
        {/* vignette supaya teks tetap terbaca di atas canvas */}
        <div
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(to top, var(--c-ink) 4%, transparent 40%), linear-gradient(to right, color-mix(in srgb, var(--c-ink) 70%, transparent), transparent 55%)",
          }}
        />
        {/* mobile: teks memenuhi lebar layar → redam bagian bawah lebih kuat */}
        <div
          className="pointer-events-none absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(to top, var(--c-ink) 22%, color-mix(in srgb, var(--c-ink) 78%, transparent) 42%, transparent 68%)",
          }}
        />
      </div>

      {/* HUD atas */}
      <div className="gutter flex items-start justify-end gap-4 pt-14 text-[0.68rem] md:pt-16">
        <div data-layer="meta" className="flex flex-col items-end gap-1 text-right font-mono uppercase tracking-widest text-mute">
          <span data-hud-in className="flex items-center gap-2 text-mint">
            <span className="blink inline-block h-2 w-2 bg-mint" aria-hidden="true" /> stage online
          </span>
          <span data-hud-in>
            frm <span ref={frameRef}>000000</span> · 30fps
          </span>
          <span data-hud-in>
            lat {site.location.lat} / lon {site.location.lon}
          </span>
          <span data-hud-in>
            <Clock />
          </span>
        </div>
      </div>

      {/* label vertikal di tepi kanan (desktop) */}
      <p
        aria-hidden="true"
        className="absolute right-[calc(var(--s-gutter)*0.4)] top-1/2 hidden -translate-y-1/2 rotate-90 font-mono text-[0.65rem] uppercase tracking-[0.4em] text-line lg:block"
      >
        stage 01 — lights up — {site.location.city}
      </p>

      {/* blok nama: kiri-bawah, asimetris */}
      <div data-layer="name" className="gutter mt-auto pb-24 md:pb-20">
        <p data-hud-in className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mute md:text-sm">
          <span className="bg-pink px-1.5 font-pixel text-[0.65rem] leading-5 text-ink">No.001</span>
          <span>{site.role.toLowerCase()}</span>
          <span className="text-line">/</span>
          <span>
            {site.location.city}, {site.location.province}
          </span>
        </p>

        <h1 id="hero-title" className="font-display leading-[0.8] text-paper">
          <Scramble
            text="VALZYY"
            trigger="mount"
            ready={ready}
            duration={1.4}
            className="block text-[clamp(4rem,21vw,19rem)] font-extrabold tracking-[-0.055em] [text-shadow:0.03em_0.03em_0_var(--c-pink)]"
          />
        </h1>

        <div className="mt-5 grid gap-4 md:mt-8 md:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] md:items-end">
          <p data-hud-in className="max-w-[34rem] text-sm text-paper/90 md:text-base">
            Bikin infrastruktur buat fandom — API, worker di edge, live streaming, dan bot.
            Founder <span className="text-pink">{site.founderOf}</span>, dikerjakan solo sejak {site.since}.
          </p>
          <p data-hud-in className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-mute md:justify-end">
            <PixelIcon name="penlight" size={14} className="text-lemon" />
            gerakkan kursor / tap panggung
            <span className="blink text-lemon" aria-hidden="true">
              ▼
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
