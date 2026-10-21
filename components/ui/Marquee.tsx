"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { motion } from "@/design/tokens";

type Props = {
  items: React.ReactNode[];
  /** 1 = ke kiri, -1 = ke kanan */
  direction?: 1 | -1;
  speed?: number;
  className?: string;
  itemClassName?: string;
  separator?: React.ReactNode;
  label: string;
};

/**
 * Marquee banner panggung. Loop GSAP tanpa sambungan, dan kecepatannya
 * ikut velocity scroll (scroll cepat = banner ngebut, arah bisa berbalik).
 */
export function Marquee({ items, direction = 1, speed = 1, className = "", itemClassName = "", separator, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = ref.current?.querySelector<HTMLElement>("[data-track]");
      if (!track) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const loop = gsap.fromTo(
          track,
          { xPercent: direction === 1 ? 0 : -50 },
          { xPercent: direction === 1 ? -50 : 0, duration: motion.dur.marquee / speed, ease: motion.ease.none, repeat: -1 },
        );
        // beri "ruang mundur" supaya timeScale negatif tidak mentok di awal
        loop.totalTime(loop.duration() * 1000);
        const st = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 300);
            gsap.to(loop, {
              timeScale: (self.direction || 1) * (1 + Math.abs(v)),
              duration: motion.dur.fast,
              overwrite: true,
            });
          },
        });
        // kembali ke kecepatan normal saat scroll berhenti
        const settle = () => {
          const ts = loop.timeScale();
          const target = ts < 0 ? -1 : 1;
          if (Math.abs(ts - target) > 0.01) loop.timeScale(ts + (target - ts) * 0.04);
        };
        gsap.ticker.add(settle);
        return () => {
          gsap.ticker.remove(settle);
          st.kill();
          loop.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const row = items.map((item, i) => (
    <span key={i} className={`flex shrink-0 items-center ${itemClassName}`}>
      {item}
      {separator}
    </span>
  ));

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} role="marquee" aria-label={label}>
      <div data-track className="flex w-max">
        <div className="flex shrink-0">{row}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {row}
        </div>
      </div>
    </div>
  );
}
