"use client";

import { useSyncExternalStore } from "react";

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

/** true saat menu mobile terbuka (ditutup otomatis saat pindah halaman). */
export const menuStore = createStore(false);

export function useMenuOpen(): boolean {
  return useSyncExternalStore(menuStore.subscribe, menuStore.get, () => false);
}

/** true saat dialog pencarian terbuka. */
export const searchStore = createStore(false);

export function useSearchOpen(): boolean {
  return useSyncExternalStore(searchStore.subscribe, searchStore.get, () => false);
}
