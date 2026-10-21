"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/design/tokens";
import { nav, site } from "@/content/site";
import { menuStore, useMenuOpen } from "@/lib/stores";
import { scrambleTo } from "@/lib/scramble";
import { lockScroll } from "@/components/providers/SmoothScroll";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { PixelIcon, type IconName } from "@/components/pixel/PixelIcon";
import { Clock } from "@/components/ui/Clock";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const ICON: Record<string, IconName> = {
  "/": "home",
  "/about": "idol",
  "/projects": "folder",
  "/stack": "stack",
  "/contact": "mail",
};

function activeIndex(pathname: string): number {
  const i = nav.findIndex((n) => (n.href === "/" ? pathname === "/" : pathname.startsWith(n.href)));
  return i;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Navigasi utama: tombol melayang di kanan-bawah (jangkauan jempol) yang
 * membuka overlay HUD pixel dengan indeks halaman 01/05.
 */
export function HudMenu() {
  const open = useMenuOpen();
  const pathname = usePathname();
  const current = activeIndex(pathname);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const wasOpen = useRef(false);

  // Timeline dibangun sekali; buka = play, tutup = reverse cepat.
  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const bars = gsap.utils.toArray<HTMLElement>("[data-bar]", panel);
      const items = gsap.utils.toArray<HTMLElement>("[data-item]", panel);
      const hud = gsap.utils.toArray<HTMLElement>("[data-hud]", panel);
      const mm = gsap.matchMedia();

      mm.add(
        { reduce: "(prefers-reduced-motion: reduce)", ok: "(prefers-reduced-motion: no-preference)" },
        (ctx) => {
          const { reduce } = ctx.conditions as { reduce: boolean };
          const tl = gsap.timeline({ paused: true });
          tl.set(panel, { autoAlpha: 1 });
          if (reduce) {
            tl.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: motion.dur.fast });
          } else {
            tl.fromTo(
              bars,
              { scaleX: 0 },
              { scaleX: 1, duration: motion.dur.fast, ease: motion.ease.smooth, stagger: motion.stagger.tight, transformOrigin: "left center" },
            )
              .fromTo(
                items,
                { xPercent: -12, opacity: 0 },
                { xPercent: 0, opacity: 1, duration: motion.dur.base, ease: motion.ease.out, stagger: motion.stagger.base },
                "-=0.1",
              )
              .fromTo(hud, { opacity: 0 }, { opacity: 1, duration: motion.dur.fast, stagger: motion.stagger.tight }, "<");
          }
          tlRef.current = tl;
          return () => {
            tl.kill();
            tlRef.current = null;
          };
        },
      );
      return () => mm.revert();
    },
    { scope: panelRef },
  );

  useEffect(() => {
    const panel = panelRef.current;
    const tl = tlRef.current;
    if (!panel) return;
    if (open) {
      wasOpen.current = true;
      lockScroll(true);
      panel.removeAttribute("inert");
      tl?.timeScale(1).play();
      // scramble label tiap item saat menu terbuka
      const cancels = gsap.utils.toArray<HTMLElement>("[data-label]", panel).map((el, i) =>
        scrambleTo(el, el.dataset.label ?? "", { duration: 0.5 + i * 0.08 }),
      );
      // panel baru terlihat setelah frame berikutnya; fokus elemen hidden akan gagal
      gsap.set(panel, { autoAlpha: 1 });
      const raf = requestAnimationFrame(() => {
        const first = panel.querySelector<HTMLElement>("[aria-current='page']") ?? panel.querySelector<HTMLElement>("a");
        first?.focus({ preventScroll: true });
      });
      return () => {
        cancelAnimationFrame(raf);
        cancels.forEach((c) => c());
      };
    }
    if (wasOpen.current) {
      panel.setAttribute("inert", "");
      lockScroll(false);
      if (tl) tl.timeScale(2.2).reverse();
      else gsap.set(panel, { autoAlpha: 0 });
      buttonRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  // Esc menutup, Tab dikurung di dalam dialog
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") menuStore.set(false);
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = [
        ...panelRef.current.querySelectorAll<HTMLElement>("a[href]"),
        buttonRef.current,
      ].filter(Boolean) as HTMLElement[];
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div
        ref={panelRef}
        id="hud-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu navigasi"
        inert
        className="invisible fixed inset-0 z-menu flex flex-col overflow-y-auto bg-ink opacity-0"
      >
        {/* latar: bar-bar pixel yang menyapu masuk */}
        <div className="pointer-events-none absolute inset-0 flex flex-col" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <span key={i} data-bar className="flex-1 bg-ink" />
          ))}
        </div>

        <div className="relative flex min-h-full flex-col justify-between gutter pb-32 pt-6 md:pb-12 md:pt-10">
          <div data-hud className="flex flex-wrap items-start justify-between gap-3 text-xs text-mute">
            <span className="font-mono tracking-widest text-paper">
              HUD // NAVIGASI <span className="text-pink">{pad(current + 1)}</span>/{pad(nav.length)}
            </span>
            <span className="font-mono tracking-widest">
              {site.location.lat}, {site.location.lon} · <Clock />
            </span>
          </div>

          <nav aria-label="Utama" className="my-8">
            <ol className="flex flex-col gap-1 md:gap-2">
              {nav.map((item, i) => {
                const isCurrent = i === current;
                return (
                  <li key={item.href} data-item>
                    <TransitionLink
                      href={item.href}
                      aria-current={isCurrent ? "page" : undefined}
                      className="group flex items-center gap-3 py-1 outline-offset-4 md:gap-6"
                      data-cursor="GO"
                    >
                      <span className={`w-8 shrink-0 font-display text-xs md:w-12 md:text-sm ${isCurrent ? "text-pink" : "text-mute"}`}>
                        {pad(i + 1)}
                      </span>
                      <PixelIcon
                        name={ICON[item.href]}
                        size={22}
                        className={`shrink-0 transition-colors duration-[var(--dur-fast)] ${isCurrent ? "text-pink" : "text-line group-hover:text-mint group-focus-visible:text-mint"}`}
                      />
                      <span
                        data-label={item.label.toUpperCase()}
                        className={`font-display text-[clamp(2.2rem,9vw,6.5rem)] leading-[0.95] transition-colors duration-[var(--dur-fast)] ${
                          isCurrent ? "text-pink" : "text-paper group-hover:text-lemon group-focus-visible:text-lemon"
                        }`}
                      >
                        {item.label.toUpperCase()}
                      </span>
                      <span className="hidden self-end pb-2 text-xs text-mute lg:inline">{item.hint}</span>
                      {isCurrent && <span className="blink ml-auto hidden font-display text-xs text-pink sm:inline">◀ KAMU DI SINI</span>}
                    </TransitionLink>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div data-hud className="flex flex-wrap items-end justify-between gap-3 text-xs text-mute">
            <span className="flex flex-wrap items-center gap-4">
              <ThemeToggle />
              <span className="hidden sm:inline">[ESC] tutup · [TAB] pindah</span>
            </span>
            <span className="font-mono">{site.name.toUpperCase()} · {site.location.city.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* tombol melayang: kanan-bawah, dalam jangkauan jempol */}
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="hud-menu"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        onClick={() => menuStore.set(!open)}
        data-cursor={open ? "CLOSE" : "MENU"}
        className="group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[var(--s-gutter)] z-menu flex items-center gap-3 bg-paper px-4 py-3 text-ink shadow-[4px_4px_0_0_var(--c-pink)] transition-transform duration-[var(--dur-fast)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_var(--c-pink)]"
      >
        <PixelIcon name={open ? "close" : "menu"} size={18} />
        <span className="font-display text-sm leading-none">{open ? "CLOSE" : "MENU"}</span>
        <span className="border-l border-ink/30 pl-3 font-mono text-xs leading-none">
          {pad(current + 1 || 0)}/{pad(nav.length)}
        </span>
      </button>
    </>
  );
}
