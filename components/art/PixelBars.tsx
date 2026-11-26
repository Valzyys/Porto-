"use client";

import { useEffect, useRef } from "react";
import { canvasBudget, breakpoint } from "@/design/tokens";
import { subscribeTheme } from "@/lib/theme";
import { isReduced } from "@/lib/gsap";

type Particle = { c: number; y: number; vy: number; life: number; blue: boolean };
type Ripple = { c: number; t: number; power: number };

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = (v: number) => 1 - Math.pow(1 - v, 3);

/**
 * Skyline pixel hero (gaya ekualiser), hidup penuh:
 * 1. Rakit — kolom tumbuh dari garis dasar kiri → kanan saat pertama terlihat.
 * 2. Gelombang — tinggi batang bergerak mengikuti dua gelombang sinus + seed.
 * 3. Sapuan — pita terang menyapu kiri → kanan, puncaknya biru.
 * 4. Paket data — pixel kecil naik dari puncak batang lalu memudar.
 * 5. Riak — klik/tap (dan otomatis tiap beberapa detik) mengirim gelombang ke samping.
 * 6. Kursor — batang di sekitar pointer terangkat, satu kolom menyala biru.
 * ≤30fps, berhenti saat offscreen/tab tersembunyi. Animasi off → gambar statis.
 */
export function PixelBars({ className = "" }: { className?: string }) {
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
      const v = (k: string) => cs.getPropertyValue(`--c-${k}`).trim();
      return { p1: v("px-1"), p2: v("px-2"), p3: v("px-3"), p4: v("px-4"), blue: v("blue") };
    }

    let w = 0;
    let h = 0;
    let cell = 12;
    let cols = 0;
    let rows = 0;
    let base = 0;
    let seeds: number[] = [];
    const mouse = { x: -1, active: false };
    const particles: Particle[] = [];
    const ripples: Ripple[] = [];
    let t0 = -1; // waktu mulai rakit (detik)
    let lastT = 0;
    let nextAuto = 2.5;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cell = w < breakpoint.md ? canvasBudget.cell.mobile : canvasBudget.cell.desktop;
      cols = Math.ceil(w / cell);
      rows = Math.floor(h / cell);
      base = Math.floor(rows * 0.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seeds = Array.from({ length: cols }, (_, i) => {
        const s = Math.sin(i * 12.9898) * 43758.5453;
        return s - Math.floor(s);
      });
    };

    const shade = (v: number) => (v < 0.25 ? pal.p1 : v < 0.5 ? pal.p2 : v < 0.8 ? pal.p3 : pal.p4);

    /** tinggi batang atas/bawah untuk kolom c pada waktu t */
    const heights = (c: number, t: number, intro: number) => {
      const s = seeds[c];
      const xr = c / cols;
      const wave = (Math.sin(t * 1.4 + c * 0.32 + s * 6) + Math.sin(t * 0.55 + c * 0.09)) * 0.25 + 0.5;
      const ramp = xr > 0.5 ? 0.25 + (xr - 0.5) * 1.6 : 0.18 + s * 0.1;
      let up = ramp * base * (0.3 + 0.7 * wave) * (0.55 + s * 0.6);
      let down = (rows - base - 1) * (0.2 + 0.8 * s * s) * (0.55 + 0.45 * (1 - wave));
      for (const r of ripples) {
        const age = t - r.t;
        const d = Math.abs(Math.abs(c - r.c) - age * 46);
        if (d < 3) up += (3 - d) * 1.4 * r.power * (1 - age / 1.4);
      }
      if (mouse.active) {
        const d = Math.abs(c - mouse.x / cell);
        if (d < 9) up += (9 - d) * 0.75;
      }
      up = Math.min(base, Math.round(up * intro));
      down = Math.min(rows - base - 1, Math.round(down * intro));
      return { up, down };
    };

    const draw = (t: number, live: boolean) => {
      ctx.clearRect(0, 0, w, h);
      const gap = Math.max(1, Math.round(cell * 0.16));
      const sz = cell - gap;
      const sinceStart = t0 < 0 ? 99 : t - t0;
      const sweep = live ? (((t * 0.16) % 1.35) - 0.175) * cols : -99;
      const hot = mouse.active ? Math.floor(mouse.x / cell) : Math.round(sweep);

      for (const r of ripples.slice()) if (t - r.t > 1.4) ripples.splice(ripples.indexOf(r), 1);

      for (let c = 0; c < cols; c++) {
        const intro = live ? easeOut(clamp01((sinceStart - c * 0.012) / 0.8)) : 1;
        const { up, down } = heights(c, t, intro);
        const x = c * cell;
        const near = Math.max(0, 1 - Math.abs(c - sweep) / 4); // pita sapuan
        const xr = c / cols;

        // garis dasar muncul lebih dulu dari batang
        if (intro > 0.02) {
          ctx.fillStyle = near > 0.5 ? pal.p3 : pal.p1;
          ctx.fillRect(x, base * cell, sz, sz);
        }
        for (let k = 1; k <= up; k++) {
          const top = k === up;
          ctx.fillStyle = c === hot && top ? pal.blue : shade(k / Math.max(1, base) + (xr > 0.6 ? 0.35 : 0) + near * 0.4);
          ctx.fillRect(x, (base - k) * cell, sz, sz);
        }
        for (let k = 1; k <= down; k++) {
          if ((c + k) % 7 === 0 && seeds[c] < 0.3) continue;
          ctx.fillStyle = c === hot ? pal.blue : shade(1 - (k / Math.max(1, rows - base)) * 0.9 + near * 0.3);
          ctx.fillRect(x, (base + k) * cell, sz, sz);
        }

        // lahirkan paket data dari puncak batang
        if (live && intro > 0.95 && up > 0 && particles.length < 90 && Math.random() < (c === hot ? 0.25 : 0.012 + near * 0.05)) {
          particles.push({ c, y: up + 1, vy: 4 + Math.random() * 6, life: 1, blue: c === hot || Math.random() < 0.3 });
        }
      }

      // paket data naik & memudar
      if (live) {
        const dt = Math.min(0.1, t - lastT);
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.y += p.vy * dt;
          p.life -= dt * 0.9;
          if (p.life <= 0 || p.y > base + 1) {
            particles.splice(i, 1);
            continue;
          }
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillStyle = p.blue ? pal.blue : pal.p4;
          ctx.fillRect(p.c * cell, (base - Math.round(p.y)) * cell, sz, sz);
        }
        ctx.globalAlpha = 1;
        // riak otomatis supaya tetap bergerak tanpa kursor
        if (t > nextAuto && sinceStart > 1) {
          ripples.push({ c: Math.floor(Math.random() * cols), t, power: 0.8 });
          nextAuto = t + 3 + Math.random() * 2.5;
        }
      }
      lastT = t;
    };

    let raf = 0;
    let last = 0;
    let running = false;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / canvasBudget.fps) return;
      last = now;
      const t = now / 1000;
      if (t0 < 0) t0 = t;
      draw(t, true);
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
    const still = () => draw(2, false);

    resize();
    if (reduced) still();
    const ro = new ResizeObserver(() => {
      resize();
      if (!running) still();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    const unsub = subscribeTheme(() => {
      pal = read();
      if (!running) still();
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
    const down = (e: PointerEvent) => {
      if (reduced) return;
      const r = canvas.getBoundingClientRect();
      const c = Math.floor((e.clientX - r.left) / cell);
      ripples.push({ c, t: performance.now() / 1000, power: 1.6 });
      for (let k = -3; k <= 3; k++) {
        const cc = c + k;
        if (cc >= 0 && cc < cols) particles.push({ c: cc, y: 2, vy: 7 + Math.random() * 7, life: 1, blue: true });
      }
    };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointerdown", down);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      unsub();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointerdown", down);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`block h-full w-full ${className}`} />;
}
