"use client";

import { useEffect, useState } from "react";
import { pkg } from "@/content/pkg";
import { site } from "@/content/site";
import { modules, methodCount } from "@/content/api";
import { lenisRef } from "@/components/providers/SmoothScroll";
import { MotionToggle } from "@/components/ui/MotionToggle";

/** Bar status ala editor kode di paling bawah: info paket, posisi scroll, saklar animasi, ke atas. */
export function StatusBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      setPct(max > 0 ? Math.round((scrollY / max) * 100) : 100);
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  const top = () => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sep = <span aria-hidden="true" className="hidden opacity-30 sm:inline">|</span>;

  return (
    <div className="bg-button text-on-button">
      <div className="page-wrap micro flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2.5">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping bg-green opacity-70" />
              <span className="relative h-2 w-2 bg-green" />
            </span>
            ready
          </span>
          {sep}
          <span>
            {pkg.name}@{pkg.version}
          </span>
          {sep}
          <span>{pkg.license}</span>
          {sep}
          <span className="tabular-nums">
            {methodCount} methods · {modules.length} modules
          </span>
          {sep}
          <span>
            {site.org} · {site.place}
          </span>
        </p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>© 2025–2026 {site.maker}</span>
          {sep}
          <span className="opacity-70">tidak berafiliasi resmi dengan JKT48</span>
          {sep}
          <MotionToggle bare />
          {sep}
          <button type="button" onClick={top} className="flex items-center gap-1.5 uppercase tabular-nums hover:opacity-70">
            <span aria-hidden="true">↑</span> top <span className="opacity-60">{String(pct).padStart(3, " ")}%</span>
          </button>
        </p>
      </div>
    </div>
  );
}
