/**
 * Generator ilustrasi pixel (buatan sendiri, deterministik).
 * Tiap generator mengembalikan grid sel { x, y, c } — c = indeks palet di
 * PIXEL_PALETTE. PRNG ber-seed supaya hasil server & client identik.
 */

export type Cell = { x: number; y: number; c: number };
export type PixelArt = { w: number; h: number; cells: Cell[] };

/** 0-3 abu, 3 tinta, 4 biru, 5 biru tengah, 6 biru muda, 7 oranye */
export const PIXEL_PALETTE = [
  "var(--c-px-1)",
  "var(--c-px-2)",
  "var(--c-px-3)",
  "var(--c-ink)",
  "var(--c-blue)",
  "color-mix(in srgb, var(--c-blue) 60%, var(--c-canvas))",
  "color-mix(in srgb, var(--c-blue) 28%, var(--c-canvas))",
  "var(--c-orange)",
];

export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Pt = [number, number];

function inPoly(x: number, y: number, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function distSeg(px: number, py: number, [ax, ay]: Pt, [bx, by]: Pt): number {
  const dx = bx - ax;
  const dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function edgeDist(x: number, y: number, poly: Pt[]): number {
  let d = Infinity;
  for (let i = 0; i < poly.length; i++) d = Math.min(d, distSeg(x, y, poly[i], poly[(i + 1) % poly.length]));
  return d;
}

/** debu pixel di sekitar objek */
function dust(cells: Cell[], w: number, h: number, n: number, rand: () => number, taken: Set<string>) {
  for (let i = 0; i < n; i++) {
    const x = Math.floor(rand() * w);
    const y = Math.floor(rand() * h);
    const k = `${x},${y}`;
    if (taken.has(k)) continue;
    taken.add(k);
    cells.push({ x, y, c: rand() < 0.35 ? 5 : rand() < 0.5 ? 1 : 2 });
  }
}

function finish(w: number, h: number, cells: Cell[], rand: () => number, dustN: number): PixelArt {
  const taken = new Set(cells.map((c) => `${c.x},${c.y}`));
  dust(cells, w, h, dustN, rand, taken);
  return { w, h, cells };
}

/** Kubus paket isometrik (npm package). */
export function cube(seed = 7): PixelArt {
  const w = 64;
  const h = 52;
  const rand = rng(seed);
  const top: Pt[] = [[32, 6], [56, 18], [32, 30], [8, 18]];
  const left: Pt[] = [[8, 18], [32, 30], [32, 49], [8, 37]];
  const right: Pt[] = [[32, 30], [56, 18], [56, 37], [32, 49]];
  const cells: Cell[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const r = rand();
      let face: Pt[] | null = null;
      let c = -1;
      if (inPoly(px, py, top)) {
        face = top;
        // pita selotip di tengah sisi atas
        c = distSeg(px, py, [20, 12], [44, 24]) < 2.2 ? 1 : r < 0.75 ? 6 : 5;
      } else if (inPoly(px, py, left)) {
        face = left;
        c = r < 0.6 ? 5 : r < 0.85 ? 4 : 6;
      } else if (inPoly(px, py, right)) {
        face = right;
        c = r < 0.55 ? 4 : r < 0.8 ? 3 : 5;
      }
      if (face) {
        if (edgeDist(px, py, face) < 0.9) c = 3;
        if ((x + y) % 2 === 0 && r < 0.06) continue; // lubang dither
        cells.push({ x, y, c });
      }
    }
  }
  return finish(w, h, cells, rand, 70);
}

/** Menara pemancar + gelombang sinyal (live streaming). */
export function tower(seed = 11): PixelArt {
  const w = 64;
  const h = 52;
  const rand = rng(seed);
  const tip: Pt = [32, 9];
  const l: Pt = [18, 50];
  const r: Pt = [46, 50];
  const cells: Cell[] = [];
  const braces: [Pt, Pt][] = [
    [[28, 20], [36, 20]],
    [[24, 32], [40, 32]],
    [[21, 42], [43, 42]],
    [[28, 20], [40, 32]],
    [[36, 20], [24, 32]],
    [[24, 32], [43, 42]],
    [[40, 32], [21, 42]],
  ];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const rr = rand();
      let c = -1;
      if (distSeg(px, py, tip, l) < 1 || distSeg(px, py, tip, r) < 1) c = 3;
      else if (braces.some(([a, b]) => distSeg(px, py, a, b) < 0.6)) c = rr < 0.7 ? 2 : 3;
      else if (Math.hypot(px - 32, py - 8) < 2.6) c = 4;
      else {
        const d = Math.hypot(px - 32, py - 8);
        const ang = (Math.atan2(py - 8, px - 32) * 180) / Math.PI;
        const side = Math.abs(ang) < 38 || Math.abs(ang) > 142;
        for (const [rad, col] of [[8, 4], [14, 5], [20, 6], [26, 6]] as const) {
          if (side && Math.abs(d - rad) < 0.8 && rr > 0.12) c = col;
        }
      }
      if (c >= 0) cells.push({ x, y, c });
    }
  }
  return finish(w, h, cells, rand, 60);
}

/** Heksagon berlapis (runtime Node.js & browser). */
export function hexagon(seed = 3): PixelArt {
  const w = 56;
  const h = 52;
  const rand = rng(seed);
  const hex = (cx: number, cy: number, rad: number): Pt[] =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)] as Pt;
    });
  const outer = hex(28, 26, 23);
  const inner = hex(28, 26, 12);
  const cells: Cell[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const rr = rand();
      if (!inPoly(px, py, outer)) continue;
      let c: number;
      if (edgeDist(px, py, outer) < 1) c = 3;
      else if (inPoly(px, py, inner)) c = edgeDist(px, py, inner) < 1 ? 4 : rr < 0.7 ? 5 : 6;
      else c = rr < 0.45 ? 0 : rr < 0.8 ? 1 : 2;
      if (c < 3 && rr > 0.92) continue;
      cells.push({ x, y, c });
    }
  }
  return finish(w, h, cells, rand, 50);
}

/** Kunci (API key / priority token). */
export function key(seed = 5): PixelArt {
  const w = 64;
  const h = 40;
  const rand = rng(seed);
  const cells: Cell[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const rr = rand();
      const d = Math.hypot(px - 16, py - 20);
      let c = -1;
      if (d < 12 && d > 5) c = d > 10.8 || d < 6.2 ? 3 : rr < 0.6 ? 5 : 4;
      else if (px > 27 && px < 58 && py > 17 && py < 23) c = py < 18 || py > 22 ? 3 : rr < 0.5 ? 6 : 5;
      else if ((px > 44 && px < 48 && py >= 23 && py < 31) || (px > 52 && px < 56 && py >= 23 && py < 28)) c = 3;
      if (c >= 0) cells.push({ x, y, c });
    }
  }
  return finish(w, h, cells, rand, 40);
}

/** Segitiga peringatan (error handling). */
export function warning(seed = 13): PixelArt {
  const w = 60;
  const h = 52;
  const rand = rng(seed);
  const tri: Pt[] = [[30, 4], [57, 49], [3, 49]];
  const cells: Cell[] = [];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const rr = rand();
      if (!inPoly(px, py, tri)) continue;
      let c: number;
      if (edgeDist(px, py, tri) < 1.1) c = 3;
      else if ((px > 28 && px < 32 && py > 18 && py < 36) || (px > 28 && px < 32 && py > 39 && py < 43)) c = 3;
      else c = rr < 0.55 ? 7 : rr < 0.8 ? 1 : 0;
      cells.push({ x, y, c });
    }
  }
  return finish(w, h, cells, rand, 40);
}

/** Grid blok modul (7 layanan + client). */
export function blocks(seed = 17): PixelArt {
  const w = 64;
  const h = 48;
  const rand = rng(seed);
  const cells: Cell[] = [];
  const tiles = [
    [4, 4], [24, 4], [44, 4],
    [4, 18], [24, 18], [44, 18],
    [14, 32], [34, 32],
  ];
  tiles.forEach(([tx, ty], i) => {
    const hue = i === 4 ? 4 : i % 3 === 0 ? 5 : 1;
    for (let y = ty; y < ty + 12; y++) {
      for (let x = tx; x < tx + 16; x++) {
        const edge = y === ty || y === ty + 11 || x === tx || x === tx + 15;
        const rr = rand();
        if (!edge && rr > 0.85) continue;
        cells.push({ x, y, c: edge ? 3 : rr < 0.5 ? hue : hue === 4 ? 5 : hue === 5 ? 6 : 0 });
      }
    }
  });
  return finish(w, h, cells, rand, 50);
}

export const ARTS = { cube, tower, hexagon, key, warning, blocks } as const;
export type ArtName = keyof typeof ARTS;
