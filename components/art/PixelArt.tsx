"use client";

import { useMemo, useRef } from "react";
import { gsap, useGSAP, MOTION_OK, FINE_POINTER } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { ARTS, PIXEL_PALETTE, rng, type ArtName } from "@/lib/pixel";

/**
 * Ilustrasi pixel (SVG). Animasi:
 * 1. Rakit — tiap pixel terbang dari posisi acak lalu mengunci saat masuk viewport.
 * 2. Kedip — beberapa pixel acak meredup/menyala bergantian (loop GSAP).
 * 3. Kursor — ilustrasi sedikit bergeser mengikuti pointer (pointer halus saja).
 */
export function PixelArt({ name, label, className = "", seed }: { name: ArtName; label: string; className?: string; seed?: number }) {
  const art = useMemo(() => ARTS[name](seed), [name, seed]);
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg) return;
      const rects = gsap.utils.toArray<SVGRectElement>("rect", svg);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const rand = rng(art.cells.length);
        gsap.set(rects, {
          x: () => (rand() - 0.5) * art.w * 0.9,
          y: () => (rand() - 0.5) * art.h * 0.9,
          opacity: 0,
        });
        gsap.to(rects, {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: motion.ease.out,
          stagger: { amount: 0.9, from: "random" },
          scrollTrigger: { trigger: svg, start: "top 85%", once: true },
          onComplete: twinkle,
        });

        let tw: gsap.core.Tween | null = null;
        function twinkle() {
          const pick = gsap.utils.shuffle(rects.slice()).slice(0, Math.max(6, Math.round(rects.length * 0.02)));
          tw = gsap.to(pick, {
            opacity: 0.25,
            duration: 0.6,
            yoyo: true,
            repeat: 1,
            ease: motion.ease.smooth,
            stagger: 0.05,
            onComplete: twinkle,
          });
        }
        return () => tw?.kill();
      });

      mm.add(`${FINE_POINTER} and ${MOTION_OK}`, () => {
        const host = (svg.parentElement ?? svg) as HTMLElement;
        const xTo = gsap.quickTo(svg, "x", { duration: motion.dur.slow, ease: motion.ease.out });
        const yTo = gsap.quickTo(svg, "y", { duration: motion.dur.slow, ease: motion.ease.out });
        const move = (e: PointerEvent) => {
          const r = host.getBoundingClientRect();
          xTo(((e.clientX - r.left) / r.width - 0.5) * 14);
          yTo(((e.clientY - r.top) / r.height - 0.5) * 10);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        host.addEventListener("pointermove", move);
        host.addEventListener("pointerleave", leave);
        return () => {
          host.removeEventListener("pointermove", move);
          host.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [art] },
  );

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${art.w} ${art.h}`}
      className={`block h-auto w-full ${className}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={label}
    >
      {art.cells.map((c, i) => (
        <rect key={i} x={c.x + 0.08} y={c.y + 0.08} width="0.84" height="0.84" fill={PIXEL_PALETTE[c.c]} />
      ))}
    </svg>
  );
}
