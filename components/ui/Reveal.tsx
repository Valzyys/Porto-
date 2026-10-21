"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { motion } from "@/design/tokens";

type Props = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "ul" | "ol" | "header" | "article";
  /** posisi trigger ScrollTrigger */
  start?: string;
  id?: string;
};

/**
 * Semua turunan dengan atribut `data-reveal` muncul berurutan (stagger)
 * saat container masuk viewport. Reduced motion → fade sederhana.
 */
export function Reveal({ children, className, as: Tag = "div", start = "top 85%", id }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current);
      if (!items.length) return;
      const mm = gsap.matchMedia();
      mm.add(
        { reduce: "(prefers-reduced-motion: reduce)", ok: "(prefers-reduced-motion: no-preference)" },
        (ctx) => {
          const { reduce } = ctx.conditions as { reduce: boolean };
          ScrollTrigger.batch(items, {
            start,
            once: true,
            onEnter: (batch) =>
              gsap.fromTo(
                batch,
                reduce ? { autoAlpha: 0 } : { autoAlpha: 0, y: 28, clipPath: "inset(0 0 100% 0)" },
                {
                  autoAlpha: 1,
                  y: 0,
                  clipPath: "inset(0 0 0% 0)",
                  duration: reduce ? motion.dur.base : motion.dur.slow,
                  ease: reduce ? motion.ease.none : motion.ease.out,
                  stagger: reduce ? 0 : motion.stagger.base,
                  clearProps: "clipPath,transform",
                },
              ),
          });
        },
      );
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} id={id}>
      {children}
    </Tag>
  );
}
