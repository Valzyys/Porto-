"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { pkg } from "@/content/pkg";
import { modules, methodCount } from "@/content/api";
import { PixelBars } from "@/components/art/PixelBars";
import { InstallBox } from "@/components/ui/InstallBox";
import { Counter } from "@/components/ui/Counter";
import { MethodMarquee } from "./MethodMarquee";

const LEAD = "@jkt48/core";
const REST = "client JavaScript untuk semua data JKT48Connect.";
const GLYPHS = "!<>-_\\/[]{}=+*^?#01ABCDEFJKT48";

/**
 * Hero beranda. Urutan masuk (sekali per kunjungan halaman):
 * bingkai digambar dari sudut → meta turun → judul "@jkt48/core" didekode dari
 * karakter acak → koma biru meletup → lanjutan judul naik per kata → bar pixel
 * merakit (canvas) → marquee & kotak install muncul. Setelah itu yang terus
 * bergerak: canvas, marquee, kursor ketik, titik live, sudut pixel berkedip,
 * dan package manager di kotak install berganti sendiri.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);
  const leadRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const lead = leadRef.current!;
        const scramble = { p: 0 };
        const tl = gsap.timeline({ defaults: { ease: motion.ease.out } });

        tl.set(lead, { autoAlpha: 0 }, 0)
          .from("[data-edge=x]", { scaleX: 0, duration: 0.9, ease: motion.ease.inOut }, 0)
          .from("[data-edge=y]", { scaleY: 0, duration: 0.9, ease: motion.ease.inOut }, 0)
          .from("[data-corner]", { scale: 0, rotate: 90, duration: 0.5, stagger: 0.06 }, 0.35)
          .from("[data-meta]", { y: -12, autoAlpha: 0, duration: 0.5, stagger: 0.08 }, 0.3)
          .fromTo(
            scramble,
            { p: 0 },
            {
              p: 1,
              duration: 1.1,
              ease: "none",
              onStart: () => void gsap.set(lead, { autoAlpha: 1 }),
              onUpdate: () => {
                const n = Math.floor(scramble.p * LEAD.length);
                let out = LEAD.slice(0, n);
                for (let i = n; i < LEAD.length; i++) out += LEAD[i] === "/" ? "/" : GLYPHS[(Math.random() * GLYPHS.length) | 0];
                lead.textContent = out;
              },
              onComplete: () => void (lead.textContent = LEAD),
            },
            0.45,
          )
          .from("[data-comma]", { scale: 0, y: -20, duration: 0.6, ease: "back.out(3)" }, 1.4)
          .from("[data-w]", { yPercent: 110, autoAlpha: 0, duration: 0.8, stagger: 0.05 }, 1.45)
          .from("[data-sub]", { autoAlpha: 0, y: 10, duration: 0.6 }, 1.9)
          .from("[data-bars]", { autoAlpha: 0, duration: 0.4 }, 0.6)
          .from("[data-marquee]", { autoAlpha: 0, y: 16, duration: 0.7 }, 1.6)
          .from("[data-install]", { autoAlpha: 0, y: 24, scale: 0.98, duration: 0.8 }, 1.75)
          .from("[data-chip]", { autoAlpha: 0, y: 8, duration: 0.4, stagger: 0.06 }, 2.1);

        // sudut pixel berkedip bergantian
        gsap.to("[data-corner]", { opacity: 0.2, duration: 0.6, ease: "steps(1)", delay: 1.2, stagger: { each: 0.4, repeat: -1, yoyo: true } });

        // parallax kecil saat hero di-scroll keluar
        gsap.to("[data-title]", { yPercent: -18, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
        gsap.to("[data-bars]", { yPercent: 12, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const words = REST.split(" ");

  return (
    <section ref={root} className="relative" aria-label="Pembuka">
      {/* bingkai: 4 garis + 4 sudut pixel */}
      <span aria-hidden="true" data-edge="x" className="absolute inset-x-0 top-0 h-px origin-left bg-line" />
      <span aria-hidden="true" data-edge="x" className="absolute inset-x-0 bottom-0 h-px origin-right bg-line" />
      <span aria-hidden="true" data-edge="y" className="absolute inset-y-0 left-0 w-px origin-top bg-line" />
      <span aria-hidden="true" data-edge="y" className="absolute inset-y-0 right-0 w-px origin-bottom bg-line" />
      {["-left-1 -top-1", "-right-1 -top-1", "-left-1 -bottom-1", "-right-1 -bottom-1"].map((pos) => (
        <span key={pos} aria-hidden="true" data-corner className={`absolute z-raised h-2 w-2 bg-blue ${pos}`} />
      ))}

      <div className="relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-6 md:px-9">
          <p data-meta className="micro flex items-center gap-2 text-mute">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping bg-blue opacity-60" />
              <span className="relative h-2 w-2 bg-blue" />
            </span>
            npm package · v{pkg.version}
          </p>
          <p data-meta className="micro flex items-center gap-3 tabular-nums text-mute">
            <span>
              <Counter value={methodCount} /> methods
            </span>
            <span aria-hidden="true">·</span>
            <span>
              <Counter value={modules.length} /> modules
            </span>
            <span aria-hidden="true">·</span>
            <span>{pkg.license}</span>
          </p>
        </div>

        <div data-title className="px-6 pt-8 md:px-9 md:pt-10">
          <h1 className="max-w-3xl text-[28px] font-medium leading-[1.15] tracking-[-0.02em] text-balance md:text-[44px]">
            <span className="sr-only">
              {LEAD}, {REST}
            </span>
            <span aria-hidden="true">
              <span className="whitespace-nowrap">
                <span ref={leadRef} className="font-medium text-ink">
                  {LEAD}
                </span>
                <span data-comma className="inline-block text-blue">
                  ,
                </span>
              </span>{" "}
              {words.map((w, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span data-w className="inline-block text-mute">
                    {w}&nbsp;
                  </span>
                </span>
              ))}
            </span>
          </h1>
          <p data-sub className="mt-4 max-w-xl text-[15px] text-mute">
            Satu class <code className="ic">JKT48Client</code>, tujuh layanan, ESM · CJS · UMD. Gerakkan kursor atau klik/tap bar di bawah.
          </p>
        </div>

        <div data-bars className="mt-6 h-40 cursor-crosshair md:mt-4 md:h-52">
          <PixelBars />
        </div>
      </div>

      <div data-marquee className="border-t border-line">
        <MethodMarquee />
      </div>

      <div className="border-t border-line px-4 py-10 md:py-12">
        <div data-install>
          <InstallBox className="mx-auto max-w-3xl" autoCycle />
        </div>
        <p className="micro mx-auto mt-4 flex max-w-3xl flex-wrap justify-center gap-x-3 gap-y-1 text-center text-mute">
          {[`v${pkg.version}`, pkg.license, "Node.js & browser", `1 dependensi (${pkg.dependency.name})`].map((t, i) => (
            <span key={t} data-chip className="flex items-center gap-3">
              {i > 0 && <span aria-hidden="true">·</span>}
              {t}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
