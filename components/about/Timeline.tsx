"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import type { TimelineEntry } from "@/content/about";

const KIND_COLOR: Record<TimelineEntry["kind"], string> = {
  proyek: "bg-pink",
  rilis: "bg-mint",
  kerja: "bg-lemon",
};

/** Timeline vertikal dengan rel ASCII; rel terisi mengikuti scroll. */
export function Timeline({ items }: { items: TimelineEntry[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-rail-fill]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 60%", scrub: true },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-entry]", ref.current).forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            x: 24,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className="relative mt-12 space-y-10 pl-8 md:pl-0">
      {/* rel: garis putus-putus ASCII + isi yang tumbuh */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-[7px] top-0 w-[2px] md:left-[calc(9rem+7px)]"
        style={{ backgroundImage: "repeating-linear-gradient(to bottom, var(--c-line) 0 6px, transparent 6px 12px)" }}
      />
      <span data-rail-fill aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-[2px] origin-top bg-mint md:left-[calc(9rem+7px)]" />

      {items.map((t, i) => (
        <li key={i} data-entry className="relative grid gap-1 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-10">
          <span className="font-mono text-xs uppercase tracking-widest text-mute md:pt-1 md:text-right">{t.when ?? "—"}</span>
          <span
            aria-hidden="true"
            className={`absolute -left-8 top-1 h-4 w-4 md:left-[9rem] ${KIND_COLOR[t.kind]}`}
            style={{ clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)" }}
          />
          <div className="wrap-any min-w-0 md:pl-10">
            <h3 className="font-display text-lg leading-snug md:text-2xl">{t.title}</h3>
            <p className="mt-1 max-w-xl text-sm text-paper/80">{t.body}</p>
            <span className="mt-2 inline-block font-mono text-[0.6rem] uppercase tracking-widest text-mute">#{t.kind}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
