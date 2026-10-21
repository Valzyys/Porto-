"use client";

import { useSyncExternalStore } from "react";
import { INTRO_KEY } from "./intro";

/** Store kecil tanpa library: cukup untuk status global yang jarang berubah. */
function createStore<T>(initial: T) {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set(next: T) {
      if (Object.is(next, value)) return;
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe(l: () => void) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

/** true setelah intro selesai (atau dilewati / sudah pernah tampil). */
export const introStore = createStore(false);

export function useIntroDone(): boolean {
  return useSyncExternalStore(introStore.subscribe, introStore.get, () => false);
}

/** true saat menu HUD terbuka. */
export const menuStore = createStore(false);

export function useMenuOpen(): boolean {
  return useSyncExternalStore(menuStore.subscribe, menuStore.get, () => false);
}


export function readIntroSeen(): boolean {
  try {
    return window.sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeIntroSeen(): void {
  try {
    window.sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* storage diblokir: intro akan tampil lagi, tidak masalah */
  }
}
