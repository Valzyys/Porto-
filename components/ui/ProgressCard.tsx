"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { readingWpm } from "@/design/tokens";
import { Icon } from "@/components/ui/Icon";

/**
 * Kartu "Uploading…" dari referensi, dibuat jujur: persen = progres scroll
 * halaman ini, "min left" = sisa kata di halaman ÷ kecepatan baca.
 */
export function ProgressCard({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const fill = root.querySelector<HTMLElement>("[data-fill]");
      const pct = root.querySelector<HTMLElement>("[data-pct]");
      const left = root.querySelector<HTMLElement>("[data-left]");
      const page = document.getElementById("page");
      const words = page ? (page.innerText.match(/\S+/g)?.length ?? 0) : 0;

      const render = (p: number) => {
        const v = Math.round(p * 100);
        if (fill) fill.style.transform = `scaleX(${p})`;
        if (pct) pct.textContent = `${v}%`;
        if (left) {
          const min = Math.ceil((words * (1 - p)) / readingWpm);
          left.textContent = p >= 0.995 ? "selesai dibaca" : `${Math.max(1, min)} min left`;
        }
      };

      render(0);
      const st = ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => render(self.progress) });
      // isi awal sedikit animasi supaya terasa "memuat"
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && fill) {
        gsap.fromTo(fill, { scaleX: 0 }, { scaleX: st.progress, duration: 0.9, ease: "power3.out", delay: 0.3 });
      }
      return () => st.kill();
    },
    { scope: ref, dependencies: [pathname] },
  );

  return (
    <div ref={ref} className="rounded-card border border-line bg-canvas px-5 py-4 md:px-8 md:py-5">
      <div className="flex items-baseline justify-between gap-4">
        <p className="truncate text-[0.9375rem] text-mute">{label}</p>
        <p data-pct className="shrink-0 text-sm tabular-nums text-ink" aria-live="off">
          0%
        </p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-pill bg-surface-2" aria-hidden="true">
        <div data-fill className="h-full origin-left rounded-pill bg-mute" style={{ transform: "scaleX(0)" }} />
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs text-mute">
        <Icon name="clock" size={14} />
        <span data-left className="tabular-nums">
          — min left
        </span>
      </p>
    </div>
  );
}
