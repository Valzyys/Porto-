import { footerCols, site } from "@/content/site";
import { pkg } from "@/content/pkg";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { Wordmark } from "@/components/ui/Wordmark";
import { Icon } from "@/components/ui/Icon";
import { MotionToggle } from "@/components/ui/MotionToggle";

/** Footer ala referensi: wordmark + pernyataan besar di kiri, kolom mono di kanan. */
export function Footer() {
  return (
    <footer className="mt-section border-t border-line bg-sunken/60">
      <div className="page-wrap grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <Wordmark size="lg" />
          <p className="mt-8 text-[28px] font-medium tracking-[-0.02em]">Satu client, semua data JKT48Connect.</p>
          <p className="mt-2 text-mute">
            {pkg.description}. Versi {pkg.version}, lisensi {pkg.license}.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-16">
          {footerCols.map((col) => (
            <div key={col.title}>
              <p className="micro text-mute">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    {l.external ? (
                      <a href={l.href} target="_blank" rel="noreferrer" className="micro flex items-center gap-1 text-ink hover:text-blue">
                        {l.label} <Icon name="arrowUpRight" size={11} />
                        <span className="sr-only">(tab baru)</span>
                      </a>
                    ) : (
                      <TransitionLink href={l.href} className="micro text-ink hover:text-blue">
                        {l.label}
                      </TransitionLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="page-wrap flex flex-wrap items-center justify-between gap-4 pb-8">
        <p className="micro text-mute">
          {site.org} · {site.place} · © 2025–2026 {site.maker} · {pkg.license} license · Tidak berafiliasi resmi dengan JKT48
        </p>
        <MotionToggle />
      </div>
    </footer>
  );
}
