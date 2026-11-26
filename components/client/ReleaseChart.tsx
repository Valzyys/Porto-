"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { releases } from "@/content/pkg";

/** Rilis per bulan dari registry npm, dalam bentuk kolom pixel yang tumbuh saat di-scroll. */
export function ReleaseChart() {
  const ref = useRef<HTMLDivElement>(null);

  const byMonth = new Map<string, number>();
  for (const r of releases) byMonth.set(r.date.slice(0, 7), (byMonth.get(r.date.slice(0, 7)) ?? 0) + 1);
  // isi bulan kosong supaya sumbu waktu jujur
  const first = releases[0].date.slice(0, 7);
  const last = releases[releases.length - 1].date.slice(0, 7);
  const months: string[] = [];
  for (let d = new Date(`${first}-01T00:00:00Z`); d.toISOString().slice(0, 7) <= last; d.setUTCMonth(d.getUTCMonth() + 1)) months.push(d.toISOString().slice(0, 7));
  const max = Math.max(...byMonth.values());

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-px]", {
          scaleY: 0,
          opacity: 0,
          transformOrigin: "50% 100%",
          duration: motion.dur.base,
          ease: motion.ease.out,
          stagger: { each: 0.025, from: "start" },
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const label = (m: string) => new Date(`${m}-01T00:00:00Z`).toLocaleDateString("en-GB", { month: "short", year: "2-digit", timeZone: "UTC" });

  return (
    <div ref={ref} className="overflow-x-auto">
      <div className="flex min-w-[560px] items-end gap-3" style={{ height: `${max * 18 + 40}px` }} role="img" aria-label={`Grafik rilis per bulan, ${releases.length} rilis tercatat`}>
        {months.map((m) => {
          const n = byMonth.get(m) ?? 0;
          return (
            <div key={m} className="flex flex-1 flex-col items-center gap-1">
              <span className="micro tabular-nums text-mute">{n || ""}</span>
              <div className="flex w-full flex-col-reverse gap-[3px]">
                {Array.from({ length: n }, (_, i) => (
                  <span key={i} data-px className={`block h-[15px] w-full ${i === n - 1 && m === last ? "bg-blue" : i % 3 === 0 ? "bg-px4" : "bg-px3"}`} />
                ))}
                {n === 0 && <span className="block h-[3px] w-full bg-px1" />}
              </div>
              <span className="micro mt-1 whitespace-nowrap text-mute">{label(m)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
