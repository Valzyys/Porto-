"use client";

import { Fragment, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { navGroups } from "@/content/site";
import { menuStore, searchStore, useMenuOpen } from "@/lib/stores";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { Wordmark } from "@/components/ui/Wordmark";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Icon } from "@/components/ui/Icon";

const isActive = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

function NavItem({ href, label, external, active }: { href: string; label: string; external?: boolean; active: boolean }) {
  const cls = `micro relative flex h-full items-center gap-1 px-1 transition-colors duration-150 ${active ? "text-ink" : "text-ink/80 hover:text-ink"}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={cls}>
        {label} <Icon name="arrowUpRight" size={11} />
        <span className="sr-only">(tab baru)</span>
      </a>
    );
  }
  return (
    <TransitionLink href={href} aria-current={active ? "page" : undefined} className={cls}>
      {label}
      <span aria-hidden="true" className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-blue transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0"}`} />
    </TransitionLink>
  );
}

/**
 * Topbar ala referensi: wordmark pixel, menu mono uppercase berkelompok dengan
 * pemisah, pencarian ⌘K, tombol INSTALL gelap, toggle tema. Mobile: drawer.
 */
export function TopBar() {
  const pathname = usePathname();
  const open = useMenuOpen();
  const drawer = useRef<HTMLDivElement>(null);

  // tutup drawer saat pindah halaman
  useEffect(() => menuStore.set(false), [pathname]);

  useGSAP(
    () => {
      const el = drawer.current;
      if (!el) return;
      if (open) {
        gsap.set(el, { display: "block" });
        gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: motion.dur.fast });
        gsap.fromTo(
          "[data-di]",
          { x: -16, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: motion.dur.base,
            ease: motion.ease.out,
            stagger: motion.stagger.tight,
          },
        );
      } else {
        gsap.to(el, {
          autoAlpha: 0,
          duration: motion.dur.fast,
          onComplete: () => void gsap.set(el, { display: "none" }),
        });
      }
    },
    { dependencies: [open], scope: drawer },
  );

  return (
    <>
      <header className="sticky top-0 z-nav border-b border-line bg-canvas/85 backdrop-blur-md">
        <div className="page-wrap flex h-bar items-center gap-4 xl:gap-6">
          <TransitionLink href="/" aria-label="@jkt48/core — beranda" className="shrink-0">
            <Wordmark />
          </TransitionLink>

          <nav aria-label="Utama" className="ml-auto hidden h-full items-stretch lg:flex">
            {navGroups.map((g, gi) => (
              <Fragment key={gi}>
                {gi > 0 && <span aria-hidden="true" className="mx-3 my-auto h-5 w-px bg-line xl:mx-5" />}
                <ul className="flex items-stretch gap-5 xl:gap-7">
                  {g.map((l) => (
                    <li key={l.href} className="flex">
                      <NavItem {...l} active={!l.external && isActive(pathname, l.href)} />
                    </li>
                  ))}
                </ul>
              </Fragment>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-4 xl:ml-6">
            <button
              type="button"
              onClick={() => searchStore.set(true)}
              className="micro hidden h-9 items-center gap-2 border border-line px-3 text-mute transition-colors duration-150 hover:border-strong hover:text-ink sm:flex"
            >
              <Icon name="search" size={13} /> Search <kbd className="rounded-tag bg-sunken px-1 text-[10px] lg:max-xl:hidden">⌘K</kbd>
            </button>
            <button type="button" onClick={() => searchStore.set(true)} aria-label="Cari" className="grid h-9 w-9 place-items-center border border-line sm:hidden">
              <Icon name="search" size={15} />
            </button>
            <TransitionLink href="/docs/installation" className="btn btn-dark hidden h-9 md:inline-flex">
              Install
            </TransitionLink>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <button
              type="button"
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => menuStore.set(!open)}
              className="grid h-9 w-9 place-items-center border border-line lg:hidden"
            >
              <Icon name={open ? "close" : "menu"} size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* drawer mobile — di luar <header>: backdrop-filter membuat header jadi containing block untuk `fixed` */}
      <div ref={drawer} id="mobile-menu" className="fixed inset-x-0 top-bar bottom-0 z-drawer hidden bg-canvas lg:hidden" style={{ display: "none" }}>
        <nav aria-label="Mobile" className="page-wrap flex flex-col gap-1 py-6">
          {navGroups.flat().map((l) => (
            <div key={l.href} data-di className="border-b border-line">
              <NavItem {...l} active={!l.external && isActive(pathname, l.href)} />
              <span className="block h-3" />
            </div>
          ))}
          <div data-di className="mt-6 flex items-center justify-between">
            <TransitionLink href="/docs/installation" className="btn btn-dark">
              Install
            </TransitionLink>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </>
  );
}
