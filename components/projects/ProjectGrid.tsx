"use client";

import { useRef, useState } from "react";
import { gsap, Flip, useGSAP } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { categories, type Project, type ProjectCategory } from "@/content/projects";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { PixelIcon } from "@/components/pixel/PixelIcon";

type Filter = "Semua" | ProjectCategory;
const FILTERS: Filter[] = ["Semua", ...categories];

const ACCENT_BG = { pink: "bg-pink", mint: "bg-mint", lemon: "bg-lemon", peach: "bg-peach" } as const;
const ACCENT_TX = { pink: "text-pink", mint: "text-mint", lemon: "text-lemon", peach: "text-peach" } as const;

/**
 * Grid proyek dengan filter kategori. Perpindahan kartu dianimasikan
 * dengan GSAP Flip; tombol filter memakai aria-pressed.
 */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("Semua");
  const ref = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const visible = (p: Project) => filter === "Semua" || p.categories.includes(filter);
  const count = projects.filter(visible).length;

  const choose = (f: Filter) => {
    if (f === filter) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-card]", ref.current);
    flipState.current = Flip.getState(cards);
    setFilter(f);
  };

  // setelah DOM berubah: animasikan dari posisi lama ke posisi baru
  useGSAP(
    () => {
      const state = flipState.current;
      if (!state) return;
      flipState.current = null;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      Flip.from(state, {
        duration: motion.dur.base,
        ease: motion.ease.out,
        absolute: true,
        stagger: motion.stagger.tight,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: motion.dur.base, ease: motion.ease.out }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.9, duration: motion.dur.fast }),
      });
    },
    { scope: ref, dependencies: [filter] },
  );

  return (
    <div ref={ref}>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter kategori proyek">
        <span className="label mr-2">filter:</span>
        {FILTERS.map((f) => {
          const n = f === "Semua" ? projects.length : projects.filter((p) => p.categories.includes(f)).length;
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => choose(f)}
              className={`flex items-center gap-2 px-3 py-2 font-display text-xs transition-colors duration-[var(--dur-fast)] ${
                active ? "bg-paper text-ink shadow-[3px_3px_0_0_var(--c-pink)]" : "bg-stage text-paper hover:bg-panel"
              }`}
              data-cursor="FILTER"
            >
              {f}
              <span className={active ? "text-pink" : "text-mute"}>{String(n).padStart(2, "0")}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-mute" aria-live="polite">
        menampilkan {count} dari {projects.length} proyek
      </p>

      <ul className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-flow-dense xl:grid-cols-[repeat(6,minmax(0,1fr))]">
        {projects.map((p, i) => {
          const show = visible(p);
          // ritme ukuran kartu: tidak seragam supaya tidak terasa template
          const span = i % 5 === 0 ? "xl:col-span-4" : i % 5 === 1 ? "xl:col-span-2" : "xl:col-span-2";
          return (
            <li key={p.slug} data-card data-flip-id={p.slug} className={`min-w-0 ${show ? "" : "hidden"} ${span}`}>
              <TransitionLink
                href={`/projects/${p.slug}`}
                className="group relative flex h-full flex-col bg-stage p-5 outline-offset-4 transition-colors duration-[var(--dur-fast)] hover:bg-panel md:p-6"
                data-cursor="CASE"
              >
                <span aria-hidden="true" className={`absolute left-0 top-0 h-1 w-0 transition-[width] duration-[var(--dur-base)] group-hover:w-full group-focus-visible:w-full ${ACCENT_BG[p.accent]}`} />
                <div className="flex items-start justify-between gap-3">
                  <span className={`font-display text-sm ${ACCENT_TX[p.accent]}`}>#{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex flex-wrap justify-end gap-1">
                    {p.categories.map((c) => (
                      <span key={c} className="chip">
                        {c}
                      </span>
                    ))}
                  </span>
                </div>
                <h2 className="wrap-any mt-6 font-display text-xl leading-tight md:text-2xl">{p.name}</h2>
                <p className="mt-2 text-sm text-paper/80">{p.tagline}</p>
                <p className="mt-auto flex items-center justify-between gap-3 pt-6 text-xs text-mute">
                  <span className="truncate">{p.stack.slice(0, 3).join(" · ")}</span>
                  <PixelIcon name="arrow" size={14} className="shrink-0 text-paper transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1" />
                </p>
              </TransitionLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
