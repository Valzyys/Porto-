"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { introStore, readIntroSeen, writeIntroSeen } from "@/lib/stores";
import { site } from "@/content/site";
import { lockScroll } from "@/components/providers/SmoothScroll";
import { usePageTransition } from "@/components/transition/TransitionProvider";
import { Icon, LogoMark } from "@/components/ui/Icon";

/** Baris status yang bergantian di bawah kartu (bukan klaim, hanya suasana boot). */
const STEPS = [
  "mount /edge (cloudflare-workers)",
  "load palette [blue · orange · peach]",
  `locate ${site.location.city.toLowerCase()}, ${site.location.province.toLowerCase()}`,
  `cue performer: ${site.name.toLowerCase()}`,
];

/**
 * Loader pertama: kartu "Loading…" ala referensi (persen, bar, sisa detik),
 * lalu tirai tile membuka halaman. Tampil sekali per sesi, bisa di-skip.
 * Overlay ikut dirender di server; script <head> menyembunyikannya kalau
 * sudah pernah tampil supaya tidak berkedip.
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

      const fill = root.querySelector<HTMLElement>("[data-fill]");
      const pct = root.querySelector<HTMLElement>("[data-pct]");
      const left = root.querySelector<HTMLElement>("[data-left]");
      const step = root.querySelector<HTMLElement>("[data-step]");
      const card = root.querySelector<HTMLElement>("[data-card]");
      let finished = false;

      const render = (p: number) => {
        if (fill) fill.style.transform = `scaleX(${p})`;
        if (pct) pct.textContent = `${Math.round(p * 100)}%`;
        if (left) left.textContent = `${Math.max(0, Math.ceil(motion.dur.intro * (1 - p)))} sec left`;
        if (step) step.textContent = `> ${STEPS[Math.min(STEPS.length - 1, Math.floor(p * STEPS.length))]}`;
      };

      const finish = () => {
        if (finished) return;
        finished = true;
        tl.kill();
        writeIntroSeen();
        lockScroll(false);
        if (reduced) {
          gsap.to(root, { autoAlpha: 0, duration: motion.dur.base, onComplete: () => void gsap.set(root, { display: "none" }) });
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
        render(1);
        tl.to({}, { duration: 0.8 });
      } else {
        tl.fromTo(card, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: motion.dur.base, ease: motion.ease.out });
        tl.to(progress, { v: 1, duration: motion.dur.intro, ease: "power1.inOut", onUpdate: () => render(progress.v) }, 0.1);
        tl.to(card, { scale: 0.96, autoAlpha: 0, duration: motion.dur.fast, ease: motion.ease.in });
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
      aria-label="Memuat situs"
      className="fixed inset-0 z-intro flex cursor-pointer flex-col items-center justify-center gap-6 bg-canvas px-gutter text-ink"
    >
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-gutter py-5">
        <LogoMark size={32} />
        <button type="button" className="micro rounded-pill border border-line px-3 py-1.5 hover:bg-ink hover:text-canvas" onClick={(e) => e.currentTarget.blur()}>
          Skip [Esc]
        </button>
      </div>

      <div data-card className="w-full max-w-xl rounded-card border border-line bg-canvas px-5 py-4 md:px-8 md:py-5">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[0.9375rem] text-mute">Loading portfolio…</p>
          <p data-pct className="text-sm tabular-nums">
            0%
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-pill bg-surface-2" aria-hidden="true">
          <div data-fill className="h-full origin-left rounded-pill bg-mute" style={{ transform: "scaleX(0)" }} />
        </div>
        <p className="mt-3 flex items-center gap-2 text-xs text-mute">
          <Icon name="clock" size={14} />
          <span data-left className="tabular-nums">
            {Math.ceil(motion.dur.intro)} sec left
          </span>
        </p>
      </div>

      <p data-step className="w-full max-w-xl truncate font-mono text-[0.6875rem] text-mute" aria-hidden="true">
        &gt; {STEPS[0]}
      </p>
      <p className="micro absolute bottom-6 text-mute">klik di mana saja atau tekan Enter / Esc untuk lewati</p>
    </div>
  );
}
