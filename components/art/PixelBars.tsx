"use client";

import { useEffect, useRef } from "react";
import { canvasBudget, breakpoint } from "@/design/tokens";
import { subscribeTheme } from "@/lib/theme";

/**
 * Grafik batang pixel di hero (gaya "skyline" referensi), versi hidup:
 * - batang naik di atas garis dasar dan menggantung di bawahnya, bergerak
 *   pelan mengikuti noise;
 * - kursor mengangkat batang di sekitarnya dan menyalakan satu kolom biru;
 * - ≤30fps, berhenti saat offscreen/tab tersembunyi, statis untuk reduced motion.
 */
export function PixelBars({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let pal = read();
    function read() {
      const cs = getComputedStyle(document.documentElement);
      const v = (k: string) => cs.getPropertyValue(`--c-${k}`).trim();
      return { p1: v("px-1"), p2: v("px-2"), p3: v("px-3"), p4: v("px-4"), ink: v("ink"), blue: v("blue") };
    }

    let w = 0;
    let h = 0;
    let cell = 12;
    let cols = 0;
    let rows = 0;
    let base = 0;
    const mouse = { x: -1, active: false };
    // profil kolom tetap (seed) + fase noise
    let seeds: number[] = [];

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cell = w < breakpoint.md ? canvasBudget.cell.mobile : canvasBudget.cell.desktop;
      cols = Math.ceil(w / cell);
      rows = Math.floor(h / cell);
      base = Math.floor(rows * 0.42);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seeds = Array.from({ length: cols }, (_, i) => {
        const s = Math.sin(i * 12.9898) * 43758.5453;
        return s - Math.floor(s);
      });
    };

    const shade = (t: number) => (t < 0.25 ? pal.p1 : t < 0.5 ? pal.p2 : t < 0.8 ? pal.p3 : pal.p4);

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      const t = time / 1000;
      const gap = Math.max(1, Math.round(cell * 0.16));
      const sz = cell - gap;
      const hotCol = mouse.active ? Math.floor(mouse.x / cell) : Math.floor(((Math.sin(t * 0.35) + 1) / 2) * cols * 0.9);
      for (let c = 0; c < cols; c++) {
        const s = seeds[c];
        const xr = c / cols;
        // batang naik lebih tinggi di sisi kanan (ekualiser), menggantung merata
        const wave = (Math.sin(t * 0.9 + c * 0.35 + s * 6) + Math.sin(t * 0.37 + c * 0.11)) * 0.25 + 0.5;
        let up = Math.round((xr > 0.55 ? (xr - 0.45) * 2.2 : 0.12) * base * (0.35 + 0.65 * wave) * (0.5 + s));
        let down = Math.round((rows - base - 1) * (0.15 + 0.85 * s * s) * (0.6 + 0.4 * wave));
        if (mouse.active) {
          const d = Math.abs(c - hotCol);
          if (d < 6) up += Math.round((6 - d) * 0.9);
        }
        up = Math.min(base, up);
        down = Math.min(rows - base - 1, down);
        const x = c * cell;
        // garis dasar
        ctx.fillStyle = pal.p1;
        ctx.fillRect(x, base * cell, sz, sz);
        for (let k = 1; k <= up; k++) {
          ctx.fillStyle = c === hotCol && k === up ? pal.blue : shade(k / Math.max(1, base) + (xr > 0.6 ? 0.35 : 0));
          ctx.fillRect(x, (base - k) * cell, sz, sz);
        }
        for (let k = 1; k <= down; k++) {
          ctx.fillStyle = c === hotCol ? pal.blue : shade(1 - k / Math.max(1, rows - base) * 0.9);
          if ((c + k) % 7 === 0 && s < 0.3) continue;
          ctx.fillRect(x, (base + k) * cell, sz, sz);
        }
      }
    };

    let raf = 0;
    let last = 0;
    let running = false;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / canvasBudget.fps) return;
      last = now;
      draw(now);
    };
    const start = () => {
      if (running || reduced) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw(2000);
    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(2000);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const unsub = subscribeTheme(() => {
      pal = read();
      if (!running) draw(2000);
    });
    const host = canvas.parentElement ?? canvas;
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.active = e.pointerType !== "touch";
    };
    const leave = () => {
      mouse.active = false;
    };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      unsub();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`block h-full w-full ${className}`} />;
}
