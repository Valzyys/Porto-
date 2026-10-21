"use client";

import { usePathname } from "next/navigation";
import { nav, site } from "@/content/site";
import { TransitionLink } from "@/components/transition/TransitionLink";

/** Tanda kecil di pojok kiri atas — bukan navbar, hanya identitas + posisi halaman. */
export function CornerMark() {
  const pathname = usePathname();
  const i = nav.findIndex((n) => (n.href === "/" ? pathname === "/" : pathname.startsWith(n.href)));
  const label = i >= 0 ? nav[i].label : "404";
  return (
    <div className="pointer-events-none fixed left-[var(--s-gutter)] top-4 z-hud flex items-center gap-2">
      <TransitionLink
        href="/"
        aria-label={`${site.name} — ke beranda`}
        className="pointer-events-auto bg-paper px-2 py-1 font-pixel text-xs leading-none text-ink"
        data-cursor="HOME"
      >
        VZY/
      </TransitionLink>
      <span className="bg-ink/80 px-1.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-widest text-paper backdrop-blur-sm">
        {i >= 0 ? String(i + 1).padStart(2, "0") : "--"} · {label}
      </span>
    </div>
  );
}
