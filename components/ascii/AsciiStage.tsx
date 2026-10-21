"use client";

import { useEffect, useRef } from "react";
import { BAYER4, RAMP, blockBitmap } from "@/lib/ascii";
import { color, canvasBudget, breakpoint, penlights } from "@/design/tokens";
import { subscribeTheme } from "@/lib/theme";

type Props = {
  /** 0..1 progress scroll hero */
  getProgress: () => number;
  /** dipanggil tiap frame (untuk counter frame di HUD) */
  onFrame?: (frame: number) => void;
  /** nama yang tersembunyi di dinding belakang, terlihat saat tersorot */
  wallText?: string;
};

type Light = { ox: number; color: number; phase: number; follow: boolean; tx: number };
type Confetti = { x: number; y: number; vx: number; vy: number; c: number; s: number; spin: number };

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.trim().slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const rgbaOf = (c: [number, number, number], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

type Palette = {
  ink: string;
  paper: [number, number, number];
  line: string;
  lineRgb: [number, number, number];
  panel: string;
  mute: string;
  lights: [number, number, number][];
};

/** Baca warna dari CSS variable aktif → canvas ikut tema terang/gelap. */
function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement);
  const v = (k: string, fallback: string) => cs.getPropertyValue(`--c-${k}`).trim() || fallback;
  return {
    ink: v("ink", color.ink),
    paper: hexToRgb(v("paper", color.paper)),
    line: v("line", color.line),
    lineRgb: hexToRgb(v("line", color.line)),
    panel: v("panel", color.panel),
    mute: v("mute", color.mute),
    lights: penlights.map((k) => hexToRgb(v(k, color[k]))),
  };
}

/**
 * Panggung ASCII di canvas:
 * - 3 spotlight berbentuk kerucut; lampu tengah mengikuti kursor, sisanya mengayun.
 * - Nama tersembunyi di dinding belakang, hanya terbaca saat disorot.
 * - Barisan penlight penonton di bawah, bergelombang & ganti warna.
 * - Konfeti pixel; klik/tap memicu ledakan konfeti.
 * - Scroll meredupkan lampu dan menyempitkan kerucut.
 * Performa: ≤30fps, sel lebih besar di mobile, berhenti saat offscreen/tab tersembunyi.
 */
export default function AsciiStage({ getProgress, onFrame, wallText = "VALZYY" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pal = readPalette();
    const rgba = (i: number, a: number) => rgbaOf(pal.lights[i], a);
    const fontFamily = getComputedStyle(canvas).fontFamily || "monospace";
    const wall = blockBitmap(wallText);

    let w = 0;
    let h = 0;
    let cell = 10;
    let cellH = 15;
    let cols = 0;
    let rows = 0;
    let mobile = false;
    let dpr = 1;

    const mouse = { x: 0.62, y: 0.5, active: false };
    const lights: Light[] = [
      { ox: 0.16, color: 0, phase: 0, follow: false, tx: 0.3 },
      { ox: 0.58, color: 2, phase: 1.7, follow: true, tx: 0.6 },
      { ox: 0.94, color: 1, phase: 3.1, follow: false, tx: 0.82 },
    ];
    let confetti: Confetti[] = [];

    const spawn = (x: number, y: number, burst = false): Confetti => ({
      x,
      y,
      vx: burst ? (Math.random() - 0.5) * 6 : (Math.random() - 0.5) * 0.6,
      vy: burst ? -Math.random() * 7 - 2 : Math.random() * 1.2 + 0.6,
      c: (Math.random() * penlights.length) | 0,
      s: Math.random() < 0.3 ? 2 : 1,
      spin: Math.random() * Math.PI * 2,
    });

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      mobile = w < breakpoint.md;
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75);
      cell = mobile ? canvasBudget.cell.mobile : canvasBudget.cell.desktop;
      cellH = Math.round(cell * 1.5);
      cols = Math.ceil(w / cell);
      rows = Math.ceil(h / cellH);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${Math.round(cellH * 0.82)}px ${fontFamily}`;
      ctx.textBaseline = "top";
      const n = mobile ? canvasBudget.confetti.mobile : canvasBudget.confetti.desktop;
      confetti = Array.from({ length: n }, () => spawn(Math.random() * w, Math.random() * h));
      if (mobile) {
        // di layar sempit, panggung dipusatkan
        lights[0].ox = 0.1;
        lights[1].ox = 0.5;
        lights[2].ox = 0.9;
      }
    };

    // ---- area dinding (nama tersembunyi) dalam satuan sel ----
    const wallBox = () => {
      const bw = wall[0].length;
      const bh = wall.length;
      const maxCols = Math.floor(cols * (mobile ? 0.92 : 0.6));
      const kx = Math.max(1, Math.floor(maxCols / bw));
      const ky = Math.max(1, Math.round((kx * cell) / cellH));
      const x0 = Math.floor((mobile ? cols * 0.5 : cols * 0.6) - (bw * kx) / 2);
      const y0 = Math.floor(rows * (mobile ? 0.2 : 0.16));
      return { kx, ky, x0, y0, bw, bh };
    };

    let frame = 0;
    let raf = 0;
    let last = 0;
    let running = false;
    const interval = 1000 / canvasBudget.fps;

    const draw = (t: number) => {
      const p = Math.min(1, Math.max(0, getProgress()));
      const dim = 1 - p * 0.75;
      const floorY = h * 0.84;
      const half = (mobile ? 0.2 : 0.15) * (1 - p * 0.45);

      ctx.fillStyle = pal.ink;
      ctx.fillRect(0, 0, w, h);

      // update target lampu
      for (const L of lights) {
        const sway = Math.sin(t * 0.00045 + L.phase) * 0.17;
        let target = L.ox + sway - (L.ox - 0.5) * 0.6;
        if (L.follow && mouse.active) target = mouse.x;
        else if (mouse.active) target = target * 0.75 + mouse.x * 0.25;
        // konvergen ke tengah saat scroll
        target = target * (1 - p) + 0.55 * p;
        L.tx += (target - L.tx) * 0.08;
      }

      const wb = wallBox();
      const buckets: Map<string, number[]> = new Map();
      const push = (style: string, x: number, y: number, ch: number) => {
        let b = buckets.get(style);
        if (!b) buckets.set(style, (b = []));
        b.push(x, y, ch);
      };

      const crowdTop = rows - (mobile ? 5 : 6);
      for (let r = 0; r < crowdTop; r++) {
        const py = r * cellH + cellH / 2;
        for (let c = 0; c < cols; c++) {
          const px = c * cell + cell / 2;
          let total = 0;
          let best = 0;
          let bestI = 0;
          for (let li = 0; li < lights.length; li++) {
            const L = lights[li];
            const ox = L.ox * w;
            const oy = -h * 0.06;
            const tx = L.tx * w;
            const ax = tx - ox;
            const ay = floorY - oy;
            const len = Math.hypot(ax, ay);
            const vx = px - ox;
            const vy = py - oy;
            const along = (vx * ax + vy * ay) / len;
            if (along <= 0) continue;
            const perp = Math.abs(vx * ay - vy * ax) / len;
            const ang = Math.atan2(perp, along);
            let i = 0;
            if (ang < half) {
              const k = 1 - ang / half;
              i = k * k * (0.35 + 0.55 * Math.min(1, along / len));
            }
            // genangan cahaya di lantai
            const dx = (px - tx) / (w * (mobile ? 0.22 : 0.13));
            const dy = (py - floorY) / (h * 0.06);
            const d = dx * dx + dy * dy;
            if (d < 1) i += (1 - d) * 0.8;
            total += i;
            if (i > best) {
              best = i;
              bestI = L.color;
            }
          }

          // dinding: nama tersembunyi
          const wx = Math.floor((c - wb.x0) / wb.kx);
          const wy = Math.floor((r - wb.y0) / wb.ky);
          const onWall = wx >= 0 && wy >= 0 && wx < wb.bw && wy < wb.bh && wall[wy][wx] === 1;

          const level = total * dim + (BAYER4[r & 3][c & 3] - 0.5) * 0.22;
          if (onWall) {
            const lit = Math.min(1, total * dim * 1.6);
            if (lit > 0.12) push(rgbaOf(pal.paper, +(0.35 + lit * 0.65).toFixed(2)), c, r, lit > 0.6 ? 10 : 9);
            else push(rgbaOf(pal.lineRgb, 0.9), c, r, 8);
            continue;
          }
          if (level <= 0.06) {
            // debu panggung samar
            if (((c * 31 + r * 17 + (frame >> 3)) % 97) === 0) push(pal.line, c, r, 1);
            continue;
          }
          const idx = Math.min(RAMP.length - 1, Math.max(1, Math.floor(level * (RAMP.length - 1))));
          const alpha = level > 0.75 ? 1 : level > 0.35 ? 0.85 : 0.55;
          push(level > 0.95 ? rgbaOf(pal.paper, 1) : rgba(bestI, alpha), c, r, idx);
        }
      }

      for (const [style, arr] of buckets) {
        ctx.fillStyle = style;
        for (let k = 0; k < arr.length; k += 3) ctx.fillText(RAMP[arr[k + 2]], arr[k] * cell, arr[k + 1] * cellH);
      }

      // lantai panggung
      const floorRow = Math.round(floorY / cellH) + 1;
      ctx.fillStyle = pal.line;
      const f0 = Math.floor(cols * 0.06);
      const f1 = Math.ceil(cols * 0.94);
      for (let c = f0; c < f1; c++) ctx.fillText(c % 2 ? "=" : "-", c * cell, Math.min(crowdTop - 1, floorRow) * cellH);

      // penonton + penlight
      const scheme = Math.floor(t / 4000) % penlights.length; // ganti warna serempak tiap 4 detik
      const gap = mobile ? 2 : 3;
      for (let c = 1; c < cols; c += gap) {
        const wave = Math.sin(t * 0.004 - c * 0.35);
        const near = mouse.active && Math.abs(c * cell - mouse.x * w) < w * 0.08;
        const lift = (wave > 0.3 ? 1 : 0) + (near ? 1 : 0);
        const baseR = rows - 2;
        const headR = baseR - 2 - lift;
        const lean = wave > 0.6 ? 1 : wave < -0.6 ? -1 : 0;
        const ci = (scheme + (c % 7 === 0 ? 1 : 0)) % penlights.length;
        ctx.fillStyle = rgba(ci, 0.95 * (0.5 + 0.5 * dim));
        ctx.fillText("█", (c + lean) * cell, headR * cellH);
        ctx.fillStyle = rgba(ci, 0.35);
        ctx.fillText("▒", (c + lean) * cell, (headR - 1) * cellH);
        ctx.fillStyle = pal.mute;
        ctx.fillText("|", c * cell, (headR + 1) * cellH);
      }
      ctx.fillStyle = pal.panel;
      for (let c = 0; c < cols; c++) {
        ctx.fillText("▄", c * cell, (rows - 2) * cellH);
        ctx.fillText("█", c * cell, (rows - 1) * cellH);
      }

      // konfeti pixel
      if (!reduced) {
        for (const q of confetti) {
          q.vy += 0.03;
          q.vx *= 0.99;
          q.x += q.vx + Math.sin(t * 0.002 + q.spin) * 0.3;
          q.y += q.vy * (q.vy > 0 ? 0.6 : 1);
          if (q.y > h || q.x < -10 || q.x > w + 10) Object.assign(q, spawn(Math.random() * w, -10));
          const sz = cell * 0.45 * q.s;
          const flip = Math.abs(Math.sin(t * 0.006 + q.spin));
          ctx.fillStyle = rgba(q.c, 0.9);
          ctx.fillRect(Math.round(q.x), Math.round(q.y), sz, Math.max(1, sz * flip));
        }
        // batasi jumlah konfeti setelah ledakan
        const cap = (mobile ? canvasBudget.confetti.mobile : canvasBudget.confetti.desktop) * 3;
        if (confetti.length > cap) confetti.splice(0, confetti.length - cap);
      }

      frame++;
      onFrame?.(frame);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < interval) return;
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

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = (e.clientY - r.top) / r.height;
      const inside = mouse.y >= 0 && mouse.y <= 1;
      mouse.active = inside && (e.pointerType === "mouse" || e.pointerType === "pen");
    };
    const onLeave = () => {
      mouse.active = false;
    };
    const onDown = (e: PointerEvent) => {
      if (reduced) return;
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (y < 0 || y > r.height) return;
      if ((e.target as HTMLElement).closest("a,button")) return;
      const n = mobile ? 14 : 26;
      for (let i = 0; i < n; i++) confetti.push(spawn(x, y, true));
    };

    resize();
    draw(4200);

    // tema berubah → baca ulang palet, gambar ulang walau sedang pause
    const unsubTheme = subscribeTheme(() => {
      pal = readPalette();
      if (!running) draw(4200);
    });

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) draw(4200);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0 });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    // dengarkan di window: teks hero berada di atas canvas
    const host = window;
    host.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);

    return () => {
      stop();
      unsubTheme();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, [getProgress, onFrame, wallText]);

  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full font-mono opacity-90" />;
}
