"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { motion } from "@/design/tokens";

/**
 * Judul ala referensi: bagian pertama tinta, koma biru, lanjutan abu.
 * Animasi: kata demi kata naik dari balik masker saat pertama tampil.
 */
export function Headline({
  lead,
  rest,
  as: Tag = "h1",
  className = "",
  center = false,
}: {
  lead: string;
  rest: string;
  as?: "h1" | "h2";
  className?: string;
  center?: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-w]", {
          yPercent: 110,
          opacity: 0,
          duration: motion.dur.slow,
          ease: motion.ease.out,
          stagger: motion.stagger.base,
          scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const words = (s: string, cls: string) =>
    s.split(" ").map((w, i) => (
      <span key={`${cls}${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
        <span data-w className={`inline-block ${cls}`}>
          {w}
          {" "}
        </span>
      </span>
    ));

  return (
    <Tag ref={ref} className={`font-medium tracking-[-0.02em] text-balance ${center ? "text-center" : ""} ${className}`}>
      <span className="sr-only">{rest ? `${lead}, ${rest}` : lead}</span>
      <span aria-hidden="true">
        {words(lead, "text-ink").slice(0, -1)}
        <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span data-w className="inline-block text-ink">
            {lead.split(" ").slice(-1)[0]}
            {rest && <span className="text-blue">,</span>}
            {" "}
          </span>
        </span>
        {rest && words(rest, "text-mute")}
      </span>
    </Tag>
  );
}
