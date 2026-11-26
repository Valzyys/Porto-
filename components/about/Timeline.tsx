"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import type { TimelineEntry } from "@/content/about";

const KIND: Record<TimelineEntry["kind"], { label: string; cls: string }> = {
  proyek: { label: "Proyek", cls: "bg-blue text-on-blue" },
  rilis: { label: "Rilis", cls: "bg-orange text-ink" },
  kerja: { label: "Kerja", cls: "bg-bar text-on-bar" },
};

/** Timeline vertikal: kolom tanggal, rel tipis yang terisi mengikuti scroll, kartu entri. */
export function Timeline({ items }: { items: TimelineEntry[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-rail-fill]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 60%", scrub: true } },
        );
        gsap.utils.toArray<HTMLElement>("[data-entry]", ref.current).forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: 20,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className="relative mt-10 space-y-4 pl-7 md:pl-0">
      <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-hair md:left-[calc(9rem+7px)]" />
      <span
        data-rail-fill
        aria-hidden="true"
        className="absolute bottom-0 left-[6px] top-0 w-[3px] origin-top rounded-pill bg-blue md:left-[calc(9rem+6px)]"
      />
      {items.map((t, i) => (
        <li key={i} data-entry className="relative grid gap-2 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-10">
          <span className="micro pt-4 tabular-nums text-mute md:pr-6 md:text-right">{t.when ?? "—"}</span>
          <span aria-hidden="true" className="absolute -left-7 top-4 h-[15px] w-[15px] rounded-pill border-2 border-line bg-canvas md:left-36" />
          <div className="min-w-0 rounded-card border border-line p-4 md:ml-8 md:p-5">
            <span className={`micro inline-block rounded-xs px-1.5 py-0.5 ${KIND[t.kind].cls}`}>{KIND[t.kind].label}</span>
            <h3 className="mt-2 text-lg font-extrabold leading-snug tracking-tight [overflow-wrap:anywhere] md:text-xl">{t.title}</h3>
            <p className="mt-1 text-sm text-mute">{t.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
