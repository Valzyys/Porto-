"use client";

import { useSyncExternalStore } from "react";
import { MOTION_KEY } from "@/design/tokens";
import { isReduced } from "@/lib/gsap";

const noop = () => () => {};

/** Saklar animasi situs. Pilihan disimpan lalu halaman dimuat ulang supaya semua timeline ikut. */
export function MotionToggle({ className = "", bare = false }: { className?: string; bare?: boolean }) {
  const off = useSyncExternalStore(noop, isReduced, () => false);
  const toggle = () => {
    try {
      if (off) localStorage.removeItem(MOTION_KEY);
      else localStorage.setItem(MOTION_KEY, "off");
    } catch {
      /* storage diblokir: tetap set atribut untuk sesi ini */
    }
    document.documentElement.dataset.motion = off ? "" : "off";
    location.reload();
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={!off}
      className={
        bare
          ? `inline-flex items-center gap-2 uppercase transition-opacity duration-150 hover:opacity-70 ${className}`
          : `micro inline-flex items-center gap-2 border border-line px-2.5 py-1.5 text-ink transition-colors duration-150 hover:border-strong ${className}`
      }
    >
      <span aria-hidden="true" className={`h-2 w-2 ${off ? "bg-px3" : bare ? "animate-pulse bg-on-button" : "animate-pulse bg-blue"}`} />
      Animasi {off ? "off" : "on"}
    </button>
  );
}
