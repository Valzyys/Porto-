"use client";

import { useSyncExternalStore } from "react";
import { THEME_KEY, type Theme } from "@/design/tokens";

const LIGHT_MQ = "(prefers-color-scheme: light)";

/** Tema efektif: pilihan manual (data-theme) kalau ada, kalau tidak ikut sistem. */
export function currentTheme(): Theme {
  const t = document.documentElement.dataset.theme;
  if (t === "light" || t === "dark") return t;
  return window.matchMedia(LIGHT_MQ).matches ? "light" : "dark";
}

export function setTheme(t: Theme): void {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {
    /* storage diblokir: tema tetap berlaku sampai reload */
  }
}

/** Panggil `cb` setiap tema berubah (toggle manual atau setting sistem). */
export function subscribeTheme(cb: () => void): () => void {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const mq = window.matchMedia(LIGHT_MQ);
  mq.addEventListener("change", cb);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", cb);
  };
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribeTheme, currentTheme, () => "dark");
}
