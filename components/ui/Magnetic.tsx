"use client";

import { useRef } from "react";
import { gsap, useGSAP, FINE_POINTER, MOTION_OK } from "@/lib/gsap";
import { motion } from "@/design/tokens";

/**
 * Bungkus elemen interaktif supaya "tertarik" ke kursor.
 * Hanya aktif untuk pointer halus + motion diizinkan; di touch tidak ada efek.
 */
export function Magnetic({ children, strength = 0.35, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(`${FINE_POINTER} and ${MOTION_OK}`, () => {
        const xTo = gsap.quickTo(el, "x", { duration: motion.dur.slow, ease: "elastic.out(1, 0.4)" });
        const yTo = gsap.quickTo(el, "y", { duration: motion.dur.slow, ease: "elastic.out(1, 0.4)" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * strength);
          yTo((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
          gsap.set(el, { x: 0, y: 0 });
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className ?? ""}`}>
      {children}
    </span>
  );
}
