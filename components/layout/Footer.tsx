"use client";

import { site, contacts, nav } from "@/content/site";
import { SlashBar } from "@/components/ui/SlashBar";
import { Icon, LogoMark } from "@/components/ui/Icon";
import { Clock } from "@/components/ui/Clock";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { scrollToTop, lenisRef } from "@/components/providers/SmoothScroll";

const YEAR = 2026;
const links = contacts.filter((c) => c.href && c.value);

/** Footer = bar gelap bersudut miring (motif bawah referensi) berisi fakta. */
export function Footer() {
  return (
    <footer className="page-wrap pb-10 pt-section">
      <SlashBar>
        <div className="grid gap-8 px-5 py-6 sm:grid-cols-2 md:px-8 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div className="min-w-0">
            <p className="micro text-on-bar-mute">Credits</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">{site.name} {"//"}</p>
            <p className="mt-1 text-xs text-on-bar-mute">
              {site.role} · {site.location.city}, {site.location.province}
            </p>
            <p className="micro mt-3 text-on-bar-mute">Situs pribadi. Tidak berafiliasi resmi dengan JKT48.</p>
          </div>

          <nav aria-label="Footer">
            <p className="micro text-on-bar-mute">Menu</p>
            <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-semibold">
              {nav.map((n) => (
                <li key={n.href}>
                  <TransitionLink href={n.href} className="hover:text-blue-ink">
                    {n.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            <p className="micro text-on-bar-mute">Kontak</p>
            <ul className="mt-2 space-y-1 text-sm font-semibold">
              {links.map((c) => (
                <li key={c.id} className="truncate">
                  <a href={c.href!} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-blue-ink">
                    {c.label}: {c.value}
                    <Icon name="arrowUpRight" size={12} />
                    <span className="sr-only">(tab baru)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-on-bar/15 px-5 py-3 md:px-8">
          <p className="micro flex items-center gap-2 text-on-bar-mute">
            <LogoMark size={16} /> © {YEAR} {site.name}
          </p>
          <p className="micro tabular-nums text-on-bar-mute">
            Local <Clock />
          </p>
          <button
            type="button"
            onClick={() => (lenisRef.current ? lenisRef.current.scrollTo(0, { duration: 1.4 }) : scrollToTop())}
            className="micro flex items-center gap-1 text-on-bar hover:text-blue-ink"
          >
            <Icon name="arrowUp" size={12} /> Balik ke atas
          </button>
        </div>
      </SlashBar>
    </footer>
  );
}
