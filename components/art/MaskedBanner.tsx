"use client";

import { useId, useRef } from "react";
import { gsap, useGSAP, FINE_POINTER, MOTION_OK } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { useIntroDone } from "@/lib/stores";
import { StageArt } from "./StageArt";

type Props = {
  /** teks/angka raksasa yang jadi "jendela" ilustrasi, mis. "2026" */
  text: string;
  /** label aksesibel untuk ilustrasi */
  label: string;
  tone?: "blue" | "orange";
  /** cerminkan ilustrasi supaya tiap halaman terasa beda */
  mirror?: boolean;
};

const W = 1200;
const H = 460;

/**
 * Banner bertopeng teks raksasa (clip-path SVG) berisi ilustrasi.
 * Gerak: outline tergambar + ilustrasi masuk saat load, parallax per lapisan
 * mengikuti kursor (pointer halus saja) dan scroll. Reduced motion → statis.
 */
export function MaskedBanner({ text, label, tone = "blue", mirror = false }: Props) {
  const uid = "mb" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const ready = useIntroDone();

  const textProps = {
    x: W / 2,
    y: H - 10,
    textAnchor: "middle" as const,
    // teks pendek tidak ditarik selebar banner supaya glyph tidak gepeng
    textLength: Math.min(W - 48, text.length * 330),
    lengthAdjust: "spacingAndGlyphs" as const,
    fontSize: 610,
    fontWeight: 900,
    style: { fontFamily: "var(--font-archivo)", fontStretch: "125%", letterSpacing: "-0.03em" },
  };

  // parallax kursor + scroll
  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const layers = gsap.utils.toArray<SVGGElement>("[data-depth]", root);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.to(layers, {
          y: (_i: number, el: SVGGElement) => Number(el.dataset.depth) * -900,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 70%", end: "bottom top", scrub: 0.6 },
        });
      });

      mm.add(`${FINE_POINTER} and ${MOTION_OK}`, () => {
        const setters = layers.map((el) => ({
          x: gsap.quickTo(el, "x", { duration: motion.dur.slow, ease: motion.ease.out }),
          d: Number(el.dataset.depth),
        }));
        const move = (e: PointerEvent) => {
          const r = root.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          setters.forEach((s) => s.x(px * s.d * -1400));
        };
        const leave = () => setters.forEach((s) => s.x(0));
        root.addEventListener("pointermove", move);
        root.addEventListener("pointerleave", leave);
        return () => {
          root.removeEventListener("pointermove", move);
          root.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  // animasi masuk, menunggu intro selesai
  useGSAP(
    () => {
      if (!ready) return;
      const root = ref.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const art = root.querySelector("[data-art]");
        const outline = root.querySelector("[data-outline]");
        const tl = gsap.timeline({ delay: 0.1 });
        tl.fromTo(art, { scale: 1.18, transformOrigin: "50% 60%" }, { scale: 1, duration: 1.4, ease: motion.ease.out });
        if (outline) {
          tl.fromTo(
            outline,
            { strokeDasharray: 2600, strokeDashoffset: 2600 },
            { strokeDashoffset: 0, duration: 1.6, ease: motion.ease.smooth },
            0,
          );
        }
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [ready] },
  );

  return (
    <div ref={ref} className="relative w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="img" aria-label={label}>
        <defs>
          <clipPath id={`${uid}-clip`}>
            <text {...textProps}>{text}</text>
          </clipPath>
        </defs>
        <g clipPath={`url(#${uid}-clip)`}>
          <g data-art>
            <g transform={mirror ? `translate(${W} 0) scale(-1 1)` : undefined}>
              <StageArt uid={uid} tone={tone} />
            </g>
          </g>
        </g>
        <text {...textProps} data-outline fill="none" stroke="var(--c-line)" strokeWidth="3" strokeLinejoin="round">
          {text}
        </text>
      </svg>
    </div>
  );
}
