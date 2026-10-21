"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { introStore, readIntroSeen, writeIntroSeen } from "@/lib/stores";
import { site } from "@/content/site";
import { blockText } from "@/lib/ascii";
import { lockScroll } from "@/components/providers/SmoothScroll";
import { usePageTransition } from "@/components/transition/TransitionProvider";

const SEGMENTS = 24;
const NAME = blockText("VALZYY", "█", "·");

const BOOT_LINES: [string, string][] = [
  ["VZY-BIOS 2.6 · stage controller", ""],
  ["> power on lighting rig", "ok"],
  ["> load penlight palette [pink mint lemon peach]", "ok"],
  ["> mount /edge (cloudflare-workers)", "ok"],
  ["> calibrate spotlight → cursor", "ok"],
  [`> locate ${site.location.city.toLowerCase()}, ${site.location.province.toLowerCase()}`, `${site.location.lat}, ${site.location.lon}`],
  ["> cue performer: VALZYY", "ready"],
];

/**
 * Boot sequence ASCII ~2.6 detik → tirai tile membuka hero.
 * Tampil sekali per sesi (sessionStorage), bisa di-skip dengan klik/tombol/keyboard.
 * Overlay ikut dirender di server supaya tidak ada kedipan konten sebelum intro;
 * script di <head> menyembunyikannya kalau sudah pernah tampil.
 */
export function Intro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { revealFromCovered } = usePageTransition();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      if (readIntroSeen()) {
        gsap.set(root, { display: "none" });
        introStore.set(true);
        return;
      }

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      lockScroll(true);

      const lines = gsap.utils.toArray<HTMLElement>("[data-line]", root);
      const segs = gsap.utils.toArray<HTMLElement>("[data-seg]", root);
      const pct = root.querySelector<HTMLElement>("[data-pct]");
      let finished = false;

      const finish = () => {
        if (finished) return;
        finished = true;
        tl.kill();
        writeIntroSeen();
        lockScroll(false);
        if (reduced) {
          gsap.to(root, {
            autoAlpha: 0,
            duration: motion.dur.base,
            onComplete: () => {
              gsap.set(root, { display: "none" });
            },
          });
        } else {
          revealFromCovered();
          gsap.set(root, { display: "none" });
        }
        introStore.set(true);
        cleanupInputs();
      };

      const progress = { v: 0 };
      const tl = gsap.timeline({ onComplete: finish });

      if (reduced) {
        gsap.set(lines, { autoAlpha: 1 });
        gsap.set(segs, { backgroundColor: "var(--c-mint)" });
        if (pct) pct.textContent = "100";
        tl.to({}, { duration: 0.9 });
      } else {
        const step = (motion.dur.intro - 0.4) / lines.length;
        lines.forEach((line, i) => {
          tl.fromTo(
            line,
            { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" },
            { autoAlpha: 1, clipPath: "inset(0 0% 0 0)", duration: step * 0.7, ease: "steps(12)" },
            i * step,
          );
        });
        tl.to(
          progress,
          {
            v: 1,
            duration: motion.dur.intro,
            ease: "power1.inOut",
            onUpdate: () => {
              const filled = Math.round(progress.v * SEGMENTS);
              segs.forEach((s, i) => {
                s.dataset.on = i < filled ? "1" : "0";
              });
              if (pct) pct.textContent = String(Math.round(progress.v * 100)).padStart(3, "0");
            },
          },
          0,
        );
        tl.fromTo(
          "[data-name]",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "steps(10)", stagger: 0.12 },
          0.2,
        );
        tl.to("[data-name]", { color: "var(--c-pink)", duration: 0.1, stagger: 0.05 }, motion.dur.intro - 0.6);
        tl.to({}, { duration: 0.25 });
      }

      const onKey = (e: KeyboardEvent) => {
        if (["Escape", "Enter", " ", "Spacebar"].includes(e.key)) {
          e.preventDefault();
          finish();
        }
      };
      const onClick = () => finish();
      window.addEventListener("keydown", onKey);
      root.addEventListener("click", onClick);
      function cleanupInputs() {
        window.removeEventListener("keydown", onKey);
        root?.removeEventListener("click", onClick);
      }

      return () => {
        tl.kill();
        cleanupInputs();
        if (!finished) lockScroll(false);
      };
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      data-intro
      role="dialog"
      aria-modal="true"
      aria-label="Intro: boot sequence"
      className="fixed inset-0 z-intro flex cursor-pointer flex-col justify-between bg-ink gutter py-6 text-paper md:py-10"
    >
      <div className="flex items-start justify-between gap-4 text-xs text-mute">
        <span className="font-mono tracking-widest">VZY://BOOT</span>
        <button
          type="button"
          className="px-border bg-stage px-3 py-2 font-display text-[0.7rem] text-lemon"
          onClick={(e) => e.currentTarget.blur()}
        >
          SKIP [ESC]
        </button>
      </div>

      {/* nama blok ASCII besar di sisi kanan (desktop) */}
      <pre
        aria-hidden="true"
        className="pointer-events-none absolute right-[var(--s-gutter)] top-1/2 hidden -translate-y-1/2 text-[1.05vw] leading-[1.05] text-line lg:block"
      >
        {NAME.map((row, i) => (
          <span key={i} data-name className="block">
            {row}
          </span>
        ))}
      </pre>

      <pre className="max-w-full overflow-hidden whitespace-pre-wrap break-words text-[0.72rem] leading-6 sm:text-sm sm:leading-7">
        {BOOT_LINES.map(([cmd, res], i) => (
          <span key={i} data-line className="flex gap-3 [html.js_&]:opacity-0">
            <span className={i === 0 ? "text-pink" : "text-paper"}>{cmd}</span>
            {res && <span className="ml-auto shrink-0 text-mint">[{res}]</span>}
          </span>
        ))}
      </pre>

      <div>
        <div className="mb-2 flex items-baseline justify-between font-display text-xs">
          <span className="text-mute">LOADING STAGE</span>
          <span>
            <span data-pct>000</span>%
          </span>
        </div>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${SEGMENTS}, 1fr)` }} aria-hidden="true">
          {Array.from({ length: SEGMENTS }, (_, i) => (
            <span
              key={i}
              data-seg
              data-on="0"
              className="h-4 bg-panel data-[on='1']:bg-mint md:h-5"
              style={{ transitionDuration: "0s" }}
            />
          ))}
        </div>
        <p className="mt-3 text-[0.7rem] text-mute">klik di mana saja atau tekan Enter / Esc untuk lewati</p>
      </div>
    </div>
  );
}
