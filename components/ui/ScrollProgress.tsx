"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";

const STEPS = 48;

/** Progress bar scroll pixel di tepi atas: naik per "blok", bukan mulus. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      const bar = ref.current?.querySelector<HTMLElement>("[data-fill]");
      const pct = ref.current?.querySelector<HTMLElement>("[data-pct]");
      if (!bar) return;
      const set = gsap.quickSetter(bar, "scaleX");
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const q = Math.round(self.progress * STEPS) / STEPS;
          set(q);
          if (pct) pct.textContent = String(Math.round(q * 100)).padStart(3, "0");
        },
      });
      set(0);
      return () => st.kill();
    },
    { scope: ref, dependencies: [pathname] },
  );

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-hud">
      <div className="h-1 w-full bg-ink/60">
        <div data-fill className="h-full origin-left bg-pink" style={{ transform: "scaleX(0)" }} />
      </div>
      <span className="absolute right-[calc(var(--s-gutter)+7.5rem)] top-5 hidden font-mono text-[0.65rem] tracking-widest text-mute md:block">
        SCROLL <span data-pct>000</span>%
      </span>
    </div>
  );
}
