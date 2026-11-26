import type { Project } from "@/content/projects";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { Icon } from "@/components/ui/Icon";

const ACCENT_BG: Record<Project["accent"], string> = {
  blue: "bg-blue",
  orange: "bg-orange",
  peach: "bg-peach",
  bar: "bg-bar",
};

/**
 * Kartu proyek: bingkai 1px tegas, badge indeks biru, strip aksen halftone,
 * judul tebal rapat, meta uppercase kecil. Seluruh kartu = satu link.
 */
export function ProjectCard({ project: p, index, className = "" }: { project: Project; index: number; className?: string }) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <TransitionLink
      href={`/projects/${p.slug}`}
      className={`group flex h-full min-w-0 flex-col overflow-hidden rounded-card border border-line bg-canvas transition-colors duration-150 hover:bg-surface ${className}`}
    >
      <div className={`relative h-16 shrink-0 border-b border-line ${ACCENT_BG[p.accent]}`} aria-hidden="true">
        <span className="halftone absolute inset-0 opacity-40 [--dot-c:var(--c-line)]" />
        <span className="absolute bottom-2 right-3 text-[2.5rem] font-black leading-none tracking-tighter text-canvas tabular-nums [-webkit-text-stroke:1px_var(--c-line)]">
          {num}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-xs bg-blue px-1.5 py-0.5 text-[0.6875rem] font-bold tabular-nums text-on-blue">M{num}</span>
            {p.categories.map((c) => (
              <span key={c} className="micro rounded-pill border border-hair px-2 py-0.5 text-mute">
                {c}
              </span>
            ))}
          </div>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-pill border border-line transition-colors duration-150 group-hover:bg-ink group-hover:text-canvas">
            <Icon name="arrowUpRight" size={16} />
          </span>
        </div>

        <h3 className="text-2xl font-extrabold leading-tight tracking-tight [overflow-wrap:anywhere]">{p.name}</h3>
        <p className="line-clamp-3 text-sm text-mute">{p.tagline}</p>

        <div className="mt-auto border-t border-hair pt-3">
          <p className="micro text-mute">Peran</p>
          <p className="truncate text-xs font-semibold">{p.role}</p>
          <p className="micro mt-2 truncate text-ink/70">{p.stack.slice(0, 4).join(" · ")}</p>
        </div>
      </div>
    </TransitionLink>
  );
}
