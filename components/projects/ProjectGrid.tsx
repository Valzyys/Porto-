"use client";

import { useRef, useState } from "react";
import { gsap, Flip, useGSAP } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { categories, type Project, type ProjectCategory } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";

type Filter = "Semua" | ProjectCategory;
const FILTERS: Filter[] = ["Semua", ...categories];

/**
 * Grid proyek + filter tersegmen (gaya toggle tema). Perpindahan kartu
 * dianimasikan GSAP Flip; tombol filter memakai aria-pressed.
 */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("Semua");
  const ref = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const visible = (p: Project) => filter === "Semua" || p.categories.includes(filter);
  const count = projects.filter(visible).length;

  const choose = (f: Filter) => {
    if (f === filter) return;
    flipState.current = Flip.getState(gsap.utils.toArray<HTMLElement>("[data-card]", ref.current));
    setFilter(f);
  };

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
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: motion.dur.base, ease: motion.ease.out }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: motion.dur.fast }),
      });
    },
    { scope: ref, dependencies: [filter] },
  );

  return (
    <div ref={ref}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filter kategori proyek" className="flex max-w-full gap-1 overflow-x-auto rounded-inner bg-bar p-1">
          {FILTERS.map((f) => {
            const n = f === "Semua" ? projects.length : projects.filter((p) => p.categories.includes(f)).length;
            const active = f === filter;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => choose(f)}
                className={`flex shrink-0 items-center gap-2 rounded-xs px-3 py-1.5 text-xs font-bold uppercase transition-colors duration-150 ${
                  active ? "border border-line bg-surface text-ink" : "border border-transparent text-on-bar hover:bg-on-bar/10"
                }`}
              >
                {f}
                <span className={`tabular-nums ${active ? "text-blue-ink" : "text-on-bar-mute"}`}>{String(n).padStart(2, "0")}</span>
              </button>
            );
          })}
        </div>
        <p className="micro text-mute" aria-live="polite">
          menampilkan <span className="tabular-nums">{count}</span> dari <span className="tabular-nums">{projects.length}</span> proyek
        </p>
      </div>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <li key={p.slug} data-card data-flip-id={p.slug} className={`min-w-0 ${visible(p) ? "" : "hidden"}`}>
            <ProjectCard project={p} index={i} />
          </li>
        ))}
      </ul>
    </div>
  );
}
