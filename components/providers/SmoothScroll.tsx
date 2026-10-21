"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, REDUCED } from "@/lib/gsap";

/** Instance Lenis aktif (null saat reduced motion atau belum mount). */
export const lenisRef: { current: Lenis | null } = { current: null };

export function scrollToTop(): void {
  if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

export function lockScroll(lock: boolean): void {
  if (lenisRef.current) {
    if (lock) lenisRef.current.stop();
    else lenisRef.current.start();
  }
  document.documentElement.style.overflow = lock ? "hidden" : "";
}

/**
 * Lenis + GSAP ticker dalam satu loop. ScrollTrigger di-update dari event
 * scroll Lenis. Dimatikan sepenuhnya bila pengguna minta reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    if (window.matchMedia(REDUCED).matches) return;

    const lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 0.95 });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return null;
}
