"use client";

import { usePathname } from "next/navigation";
import { nav, site } from "@/content/site";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { LogoMark } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function activeNavIndex(pathname: string): number {
  return nav.findIndex((n) => (n.href === "/" ? pathname === "/" : pathname.startsWith(n.href)));
}

/**
 * Topbar ala menu game: logo kotak biru, menu teks (aktif = bold italic),
 * toggle tema tersegmen di kanan. Mobile: menu turun ke baris kedua.
 */
export function TopBar() {
  const pathname = usePathname();
  const current = activeNavIndex(pathname);

  return (
    <header className="sticky top-0 z-nav bg-canvas/90 backdrop-blur-md">
      <div className="page-wrap flex flex-wrap items-center gap-x-8 gap-y-3 py-4 md:flex-nowrap md:py-6">
        <TransitionLink href="/" aria-label={`${site.name} — beranda`} className="shrink-0 rounded-inner">
          <LogoMark size={36} />
        </TransitionLink>

        <nav aria-label="Utama" className="order-3 w-full md:order-none md:w-auto md:flex-1">
          <ul className="flex items-center justify-between gap-2 md:justify-start md:gap-10">
            {nav.map((item, i) => {
              const active = i === current;
              return (
                <li key={item.href}>
                  <TransitionLink
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative inline-block py-1 text-[0.8125rem] uppercase tracking-tight transition-colors duration-150 md:text-sm ${
                      active ? "font-extrabold italic text-ink" : "font-medium text-ink/80 hover:text-ink"
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-0.5 left-0 h-0.5 bg-blue transition-[width] duration-200 ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </TransitionLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto md:ml-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
