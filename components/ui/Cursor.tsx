"use client";

import { useRef } from "react";
import { gsap, useGSAP, FINE_POINTER, MOTION_OK } from "@/lib/gsap";
import { motion } from "@/design/tokens";

/**
 * Kursor pixel + spotlight panggung yang mengikuti kursor.
 * Hanya untuk pointer halus (mouse/trackpad) dan motion diizinkan;
 * di perangkat sentuh komponen ini tidak melakukan apa-apa.
 */
export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const box = root.querySelector<HTMLElement>("[data-box]")!;
      const tag = root.querySelector<HTMLElement>("[data-tag]")!;
      const sq = root.querySelector<HTMLElement>("[data-sq]")!;
      const spot = root.querySelector<HTMLElement>("[data-spot]")!;
      const mm = gsap.matchMedia();

      mm.add(`${FINE_POINTER} and ${MOTION_OK}`, () => {
        document.documentElement.classList.add("has-cursor");
        gsap.set(root, { autoAlpha: 1 });
        const bx = gsap.quickTo(box, "x", { duration: motion.dur.instant, ease: motion.ease.out });
        const by = gsap.quickTo(box, "y", { duration: motion.dur.instant, ease: motion.ease.out });
        const sx = gsap.quickTo(spot, "x", { duration: motion.dur.slow, ease: motion.ease.out });
        const sy = gsap.quickTo(spot, "y", { duration: motion.dur.slow, ease: motion.ease.out });

        const move = (e: PointerEvent) => {
          bx(e.clientX);
          by(e.clientY);
          sx(e.clientX);
          sy(e.clientY);
        };
        const over = (e: PointerEvent) => {
          const t = (e.target as HTMLElement).closest<HTMLElement>("a,button,[data-cursor]");
          const label = t?.dataset.cursor ?? (t ? "OPEN" : "");
          tag.textContent = label;
          gsap.to(sq, { scale: t ? 2.2 : 1, duration: motion.dur.fast, ease: motion.ease.out });
          gsap.to(tag, { autoAlpha: t ? 1 : 0, duration: motion.dur.instant });
        };
        const down = () => gsap.to(sq, { scale: 0.7, duration: motion.dur.instant, ease: motion.ease.out });
        const up = () => gsap.to(sq, { scale: 1, duration: motion.dur.fast, ease: motion.ease.out });
        const leave = () => gsap.to(root, { autoAlpha: 0, duration: motion.dur.fast });
        const enter = () => gsap.to(root, { autoAlpha: 1, duration: motion.dur.fast });

        window.addEventListener("pointermove", move);
        window.addEventListener("pointerover", over);
        window.addEventListener("pointerdown", down);
        window.addEventListener("pointerup", up);
        document.documentElement.addEventListener("pointerleave", leave);
        document.documentElement.addEventListener("pointerenter", enter);
        return () => {
          document.documentElement.classList.remove("has-cursor");
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerover", over);
          window.removeEventListener("pointerdown", down);
          window.removeEventListener("pointerup", up);
          document.documentElement.removeEventListener("pointerleave", leave);
          document.documentElement.removeEventListener("pointerenter", enter);
        };
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none invisible fixed inset-0 z-cursor opacity-0">
      {/* spotlight: cahaya lembut yang mengikuti kursor */}
      <div
        data-spot
        className="absolute left-0 top-0 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in srgb, var(--c-pink) 7%, transparent), color-mix(in srgb, var(--c-lemon) 3%, transparent) 55%, transparent)",
        }}
      />
      <div data-box className="absolute left-0 top-0">
        <span data-sq className="absolute -left-[7px] -top-[7px] block h-3.5 w-3.5 rounded-full border-2 border-pink bg-transparent" />
        <span
          data-tag
          className="invisible absolute left-4 top-4 whitespace-nowrap bg-paper px-1.5 font-mono text-[0.6rem] leading-4 text-ink opacity-0"
        />
      </div>
    </div>
  );
}
