"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motion, penlights, breakpoint } from "@/design/tokens";
import { menuStore } from "@/lib/stores";
import { scrollToTop } from "@/components/providers/SmoothScroll";

type Origin = { x: number; y: number } | null;

type Ctx = {
  /** tutup layar dengan tile pixel, lalu pindah route */
  navigate: (href: string, origin?: Origin) => void;
  /** dipanggil template.tsx saat halaman baru mount */
  enter: (path: string) => void;
  /** dipakai intro: tutup instan lalu buka */
  revealFromCovered: () => void;
};

const TransitionCtx = createContext<Ctx | null>(null);

export function usePageTransition(): Ctx {
  const ctx = useContext(TransitionCtx);
  if (!ctx) throw new Error("usePageTransition harus di dalam <TransitionProvider>");
  return ctx;
}

/* ---- ukuran grid tile mengikuti viewport (aman untuk SSR) ---- */
function subscribeResize(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}
function gridSnapshot(): string {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const size = w < breakpoint.md ? 56 : 84;
  return `${Math.ceil(w / size)}x${Math.ceil(h / size)}`;
}

function tileColor(i: number, cols: number): string {
  const x = i % cols;
  const y = Math.floor(i / cols);
  // aksen penlight muncul di pola deterministik, sisanya gelap
  if ((x * 7 + y * 5) % 13 === 0) return `var(--c-${penlights[(x + y) % penlights.length]})`;
  if ((x + y) % 2 === 0) return "var(--c-stage)";
  return "var(--c-ink)";
}

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const grid = useSyncExternalStore(subscribeResize, gridSnapshot, () => "0x0");
  const [cols, rows] = grid.split("x").map(Number);

  const overlayRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const tlRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);
  const coveredRef = useRef(false);
  const lastEntered = useRef<string | null>(null);
  const pendingRef = useRef<string | null>(null);
  const safetyRef = useRef<number | null>(null);

  // overlay hidup selama layout hidup; cukup bunuh tween saat unmount
  useEffect(() => () => void tlRef.current?.kill(), []);

  const tiles = useCallback(
    () => (overlayRef.current ? gsap.utils.toArray<HTMLElement>(".tile", overlayRef.current) : []),
    [],
  );

  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const originIndex = (origin: Origin): number | "center" => {
    if (!origin || !cols) return "center";
    const cx = Math.min(cols - 1, Math.floor((origin.x / window.innerWidth) * cols));
    const cy = Math.min(rows - 1, Math.floor((origin.y / window.innerHeight) * rows));
    return cy * cols + cx;
  };

  const reveal = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    tlRef.current?.kill();
    if (safetyRef.current) window.clearTimeout(safetyRef.current);
    if (reduced()) {
      gsap.to(overlay, { autoAlpha: 0, pointerEvents: "none", duration: motion.dur.fast });
      coveredRef.current = false;
      return;
    }
    gsap.set(overlay, { autoAlpha: 1 });
    if (labelRef.current) gsap.set(labelRef.current, { autoAlpha: 0 });
    tlRef.current = gsap.to(tiles(), {
      scale: 0,
      duration: motion.dur.fast,
      ease: motion.ease.smooth,
      stagger: { grid: [rows, cols], from: "center", amount: motion.stagger.tiles },
      onComplete: () => {
        gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
        coveredRef.current = false;
      },
    });
  }, [tiles, rows, cols]);

  const coverInstant = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    tlRef.current?.kill();
    gsap.set(overlay, { autoAlpha: 1 });
    gsap.set(tiles(), { scale: 1 });
    coveredRef.current = true;
  }, [tiles]);

  const navigate = useCallback(
    (href: string, origin: Origin = null) => {
      menuStore.set(false);
      const target = href.split("#")[0] || "/";
      if (target === pathname) {
        scrollToTop();
        return;
      }
      pendingRef.current = target;
      const overlay = overlayRef.current;
      if (!overlay || reduced()) {
        router.push(href, { scroll: false });
        return;
      }
      // navigasi cepat: hentikan tween yang sedang jalan, mulai dari state sekarang
      tlRef.current?.kill();
      if (labelRef.current) labelRef.current.textContent = `→ ${target}`;
      gsap.set(overlay, { autoAlpha: 1, pointerEvents: "auto" });
      const tl = gsap.timeline({
        onComplete: () => {
          coveredRef.current = true;
          router.push(href, { scroll: false });
          // jaring pengaman bila route baru tidak memanggil enter()
          safetyRef.current = window.setTimeout(reveal, 3000);
        },
      });
      tl.to(tiles(), {
        scale: 1,
        duration: motion.dur.fast,
        ease: motion.ease.smooth,
        stagger: { grid: [rows, cols], from: originIndex(origin), amount: motion.stagger.tiles },
      });
      if (labelRef.current) tl.to(labelRef.current, { autoAlpha: 1, duration: motion.dur.instant }, "<0.15");
      tlRef.current = tl;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname, router, cols, rows],
  );

  const enter = useCallback((path: string) => {
    const first = lastEntered.current === null;
    const same = lastEntered.current === path;
    lastEntered.current = path;
    // load pertama ditangani intro; path sama = efek dobel (StrictMode)
    if (first || same) return;
    scrollToTop();
    requestAnimationFrame(() => ScrollTrigger.refresh());
    if (!coveredRef.current && !reduced()) {
      // back/forward browser: tutup instan lalu buka supaya tetap ada transisi
      coverInstant();
    }
    pendingRef.current = null;
    reveal();
  }, [coverInstant, reveal]);

  const revealFromCovered = useCallback(() => {
    coverInstant();
    reveal();
  }, [coverInstant, reveal]);

  const value = useMemo(() => ({ navigate, enter, revealFromCovered }), [navigate, enter, revealFromCovered]);

  return (
    <TransitionCtx.Provider value={value}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-curtain invisible opacity-0"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols || 1}, 1fr)`,
          gridTemplateRows: `repeat(${rows || 1}, 1fr)`,
        }}
      >
        {Array.from({ length: cols * rows }, (_, i) => (
          <span
            key={i}
            className="tile block"
            style={{ background: tileColor(i, cols), transform: "scale(0)" }}
          />
        ))}
        <p
          ref={labelRef}
          className="invisible absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-ink px-3 py-1 font-display text-sm text-lemon opacity-0"
        />
      </div>
    </TransitionCtx.Provider>
  );
}
