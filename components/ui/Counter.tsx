"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/design/tokens";

/** Angka yang menghitung naik hanya ketika masuk viewport. Nilai asli ada di DOM. */
export function Counter({ value, pad = 2, className }: { value: number; pad?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => String(Math.round(n)).padStart(pad, "0");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const obj = { v: 0 };
      el.textContent = fmt(0);
      gsap.to(obj, {
        v: value,
        duration: motion.dur.slow * 1.6,
        ease: motion.ease.out,
        onUpdate: () => {
          el.textContent = fmt(obj.v);
        },
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    },
    { scope: ref, dependencies: [value] },
  );

  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      {fmt(value)}
    </span>
  );
}
