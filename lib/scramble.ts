"use client";

import { SCRAMBLE_CHARS } from "./ascii";

type Options = {
  /** detik */
  duration?: number;
  chars?: string;
  /** karakter awal; default teks acak sepanjang target */
  from?: string;
  onDone?: () => void;
};

/**
 * Acak isi elemen ke karakter ASCII lalu "kunci" huruf satu per satu dari
 * kiri ke kanan sampai jadi `text`. Mengembalikan fungsi cancel.
 */
export function scrambleTo(el: HTMLElement, text: string, opts: Options = {}): () => void {
  const { duration = 0.9, chars = SCRAMBLE_CHARS, onDone } = opts;
  const total = duration * 1000;
  const len = text.length;
  // tiap huruf punya waktu kunci sendiri, sedikit diacak supaya organik
  const lockAt = Array.from({ length: len }, (_, i) => (i / len) * total * 0.75 + Math.random() * total * 0.25);
  let raf = 0;
  let last = 0;
  const start = performance.now();

  const frame = (now: number) => {
    const t = now - start;
    // batasi ke ~30fps: cukup untuk efek, hemat CPU
    if (now - last >= 33 || t >= total) {
      last = now;
      let out = "";
      for (let i = 0; i < len; i++) {
        const c = text[i];
        if (c === " " || t >= lockAt[i]) out += c;
        else out += chars[(Math.random() * chars.length) | 0];
      }
      el.textContent = out;
    }
    if (t < total) raf = requestAnimationFrame(frame);
    else {
      el.textContent = text;
      onDone?.();
    }
  };

  if (opts.from !== undefined) el.textContent = opts.from;
  raf = requestAnimationFrame(frame);
  return () => {
    cancelAnimationFrame(raf);
    el.textContent = text;
  };
}
