"use client";

import { useEffect, useRef } from "react";
import { subscribeTheme } from "@/lib/theme";
import { isReduced } from "@/lib/gsap";

// font bitmap 5×7 buatan sendiri, cukup untuk "JKT48/CORE"
const GLYPHS: Record<string, string[]> = {
  J: ["..###", "...#.", "...#.", "...#.", "#..#.", "#..#.", ".##.."],
  K: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
  "8": [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
  "/": ["....#", "....#", "...#.", "..#..", ".#...", "#....", "#...."],
  C: [".###.", "#...#", "#....", "#....", "#....", "#...#", ".###."],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
};
const TEXT = "JKT48/CORE";
const COLS = TEXT.length * 6 - 1;
const ROWS = 9; // 7 baris glyph + 1 baris ruang atas/bawah

type P = { hx: number; hy: number; x: number; y: number; vx: number; vy: number; delay: number; blue: boolean; glow: number };

/** sel pixel wordmark dalam satuan grid */
const CELLS = (() => {
  const out: { c: number; r: number; blue: boolean }[] = [];
  [...TEXT].forEach((ch, gi) => {
    GLYPHS[ch].forEach((row, r) => {
      [...row].forEach((v, c) => {
        if (v === "#") out.push({ c: gi * 6 + c, r: r + 1, blue: gi === 0 });
      });
    });
  });
  return out;
})();

/**
 * Wordmark pixel raksasa di footer (canvas). Pixel berjatuhan lalu merakit saat
 * footer terlihat, terdorong menjauh dari kursor dan kembali dengan pegas,
 * meledak keluar saat diklik/tap, dan sesekali berkedip biru.
 * ≤30fps, berhenti saat offscreen. Animasi off → gambar statis.
 */
export function PixelWordmark({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = isReduced();

    let pal = read();
    function read() {
      const cs = getComputedStyle(document.documentElement);
      return { ink: cs.getPropertyValue("--c-ink").trim(), blue: cs.getPropertyValue("--c-blue").trim(), faint: cs.getPropertyValue("--c-line").trim() };
    }

    let w = 0;
    let h = 0;
    let cell = 10;
    const pts: P[] = CELLS.map((k) => ({ hx: k.c, hy: k.r, x: k.c, y: k.r, vx: 0, vy: 0, delay: 0, blue: k.blue, glow: 0 }));
    const mouse = { x: -999, y: -999, on: false };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      cell = w / COLS;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // posisi awal: tersebar di atas kanvas, jatuh bergiliran dari kiri
    const scatter = () => {
      for (const p of pts) {
        p.x = p.hx + (Math.random() - 0.5) * 18;
        p.y = -2 - Math.random() * 10;
        p.vx = 0;
        p.vy = 0;
        p.delay = p.hx * 0.012 + Math.random() * 0.25;
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const gap = Math.max(1, cell * 0.14);
      const sz = cell - gap;
      // grid titik samar di belakang
      ctx.fillStyle = pal.faint;
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c += 2) ctx.fillRect(c * cell + cell / 2 - 1, r * cell + cell / 2 - 1, 2, 2);
      for (const p of pts) {
        const disp = Math.hypot(p.x - p.hx, p.y - p.hy);
        ctx.fillStyle = p.blue || p.glow > 0 || disp > 0.6 ? pal.blue : pal.ink;
        ctx.fillRect(p.x * cell + gap / 2, p.y * cell + gap / 2, sz, sz);
      }
    };

    let start = -1;
    let last = 0;
    let nextGlow = 0;
    const step = (t: number) => {
      const dt = Math.min(0.05, last ? t - last : 0.033);
      last = t;
      if (start < 0) start = t;
      const age = t - start;
      const mx = mouse.x / cell;
      const my = mouse.y / cell;
      for (const p of pts) {
        if (age < p.delay) continue;
        // pegas ke posisi asal
        p.vx += (p.hx - p.x) * 70 * dt;
        p.vy += (p.hy - p.y) * 70 * dt;
        // tolakan kursor
        if (mouse.on) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const d = Math.hypot(dx, dy) || 0.001;
          if (d < 4.5) {
            const f = (1 - d / 4.5) * 260 * dt;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
        const damp = Math.pow(0.0009, dt);
        p.vx *= damp;
        p.vy *= damp;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.glow > 0) p.glow -= dt;
      }
      if (t > nextGlow && age > 2) {
        for (let k = 0; k < 4; k++) pts[(Math.random() * pts.length) | 0].glow = 0.45;
        nextGlow = t + 0.25;
      }
      draw();
    };

    let raf = 0;
    let prev = 0;
    let running = false;
    let started = false;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - prev < 1000 / 30) return;
      prev = now;
      step(now / 1000);
    };
    const run = () => {
      if (running || reduced) return;
      if (!started) {
        started = true;
        scatter();
      }
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    draw();
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    let inView = false;
    const io = new IntersectionObserver(
      ([e]) => {
        inView = e.isIntersecting;
        if (inView) run();
        else stop();
      },
      { threshold: 0.2 },
    );
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : inView && run());
    document.addEventListener("visibilitychange", onVis);
    const unsub = subscribeTheme(() => {
      pal = read();
      draw();
    });

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      Object.assign(mouse, local(e), { on: true });
    };
    const leave = () => void (mouse.on = false);
    const down = (e: PointerEvent) => {
      if (reduced) return;
      const { x, y } = local(e);
      const mx = x / cell;
      const my = y / cell;
      for (const p of pts) {
        const dx = p.x - mx;
        const dy = p.y - my;
        const d = Math.hypot(dx, dy) || 0.001;
        if (d < 14) {
          const f = (1 - d / 14) * 70;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f - 10;
        }
      }
    };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerleave", leave);
    canvas.addEventListener("pointerdown", down);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      unsub();
      document.removeEventListener("visibilitychange", onVis);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerleave", leave);
      canvas.removeEventListener("pointerdown", down);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="JKT48/CORE"
      className={`block w-full cursor-crosshair touch-pan-y ${className}`}
      style={{ aspectRatio: `${COLS} / ${ROWS}` }}
    />
  );
}
