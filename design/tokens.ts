/**
 * Design tokens — satu-satunya sumber nilai visual & gerak.
 *
 * - Warna, spacing, font, z-index, radius → CSS custom properties (lihat
 *   `tokensToCss`) yang dipetakan ke Tailwind lewat `@theme inline` di
 *   app/globals.css. Komponen cukup pakai class (`bg-canvas`, `text-ink`,
 *   `bg-blue`, `border-hair`, `font-display`, …).
 * - Durasi, easing, stagger → dipakai langsung oleh GSAP lewat `motion`.
 *
 * Arah visual: UI "game HUD" editorial — kanvas putih, biru kobalt, aksen
 * oranye/peach, garis hitam tegas, bar gelap bersudut miring.
 */

/** Tema terang (default ikut sistem). */
export const color = {
  /** latar halaman */
  canvas: "#ffffff",
  /** permukaan kartu / panel */
  surface: "#f3f3f1",
  surface2: "#e9e9e6",
  /** garis tegas (outline kartu, ilustrasi) */
  line: "#161616",
  /** garis tipis pemisah */
  hair: "#d9d9d6",
  /** teks utama */
  ink: "#141414",
  /** teks sekunder — kontras 5.3:1 di atas canvas */
  mute: "#6b6b6b",
  /** biru kobalt: isian (badge, bubble, logo). Teks putih di atasnya 6.7:1 */
  blue: "#1f4fd6",
  /** biru untuk teks di atas canvas */
  blueInk: "#1f4fd6",
  blueSoft: "#dfe7ff",
  /** oranye & peach: HANYA isian/ilustrasi, bukan warna teks */
  orange: "#f0a032",
  peach: "#f6d0b4",
  /** bar gelap (bottom bar, footer) */
  bar: "#1c1c1c",
  onBar: "#f4f4f4",
  onBarMute: "#a8a8a8",
  onBlue: "#ffffff",
} as const;

/** Tema gelap: nama token sama, nilai disesuaikan. */
export const colorDark: Record<keyof typeof color, string> = {
  canvas: "#0e0f11",
  surface: "#18191c",
  surface2: "#222327",
  line: "#e6e6e3",
  hair: "#2c2d31",
  ink: "#f2f2f0",
  mute: "#9b9b9b",
  blue: "#3567f0",
  blueInk: "#7a9cff",
  blueSoft: "#1b2547",
  orange: "#f2a73c",
  peach: "#e9b998",
  bar: "#26272b",
  onBar: "#f2f2f0",
  onBarMute: "#a3a3a3",
  onBlue: "#ffffff",
};

export type ColorName = keyof typeof color;

/** Warna yang dipakai bergiliran oleh tile transisi & ilustrasi. */
export const accents: readonly ColorName[] = ["blue", "orange", "peach", "bar"];

export const font = {
  /** semua teks UI & judul (Archivo, OFL; sumbu lebar 62–125) */
  display: "var(--font-archivo)",
  /** kode, diagram ASCII, koordinat (JetBrains Mono, OFL) */
  mono: "var(--font-jetbrains)",
  /** teks Jepang dekoratif — font sistem, tanpa webfont */
  jp: '"Hiragino Sans", "Noto Sans JP", "Yu Gothic", "WenQuanYi Zen Hei", sans-serif',
} as const;

export const space = {
  /** unit dasar Tailwind (`p-1` = 4px) */
  unit: "0.25rem",
  /** gutter samping halaman */
  gutter: "clamp(1rem, 4vw, 3rem)",
  /** jarak vertikal antar section */
  section: "clamp(4rem, 10vw, 8rem)",
  /** lebar maksimum konten */
  container: "76rem",
} as const;

export const radius = {
  /** kartu & panel */
  card: "0.75rem",
  /** elemen di dalam kartu (radius_dalam = luar − padding kecil) */
  inner: "0.375rem",
  /** pill / bubble / toggle */
  pill: "999px",
} as const;

export const layer = {
  base: 0,
  raised: 10,
  nav: 60,
  curtain: 80,
  intro: 90,
} as const;

export const motion = {
  dur: {
    instant: 0.12,
    fast: 0.25,
    base: 0.5,
    slow: 0.9,
    /** panjang loader intro (detik) */
    intro: 2.2,
  },
  ease: {
    out: "power3.out",
    in: "power3.in",
    inOut: "expo.inOut",
    smooth: "power2.inOut",
    back: "back.out(1.6)",
    none: "none",
  },
  stagger: {
    tight: 0.035,
    base: 0.07,
    loose: 0.12,
    /** total waktu tile transisi menutup/membuka layar */
    tiles: 0.42,
  },
  css: {
    out: "cubic-bezier(0.22, 1, 0.36, 1)",
    inOut: "cubic-bezier(0.87, 0, 0.13, 1)",
  },
} as const;

/** Breakpoint (px) — sama dengan default Tailwind. */
export const breakpoint = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/** Kecepatan baca untuk estimasi "x min left" di kartu progres. */
export const readingWpm = 200;

export type Theme = "dark" | "light";
export const THEME_KEY = "vzy:theme";

const kebab = (s: string) => s.replace(/[A-Z0-9]+/g, (m) => `-${m.toLowerCase()}`);

const colorVars = (c: Record<string, string>) =>
  Object.entries(c)
    .map(([k, v]) => `--c-${kebab(k)}:${v}`)
    .join(";");

/**
 * Render semua token jadi CSS untuk disuntik di <head>.
 * Tema: default ikut sistem (prefers-color-scheme); pilihan manual disimpan
 * sebagai `data-theme` di <html> dan menang atas setting sistem.
 */
export function tokensToCss(): string {
  const vars: string[] = [];
  for (const [k, v] of Object.entries(space)) vars.push(`--s-${k}:${v}`);
  for (const [k, v] of Object.entries(radius)) vars.push(`--r-${k}:${v}`);
  for (const [k, v] of Object.entries(layer)) vars.push(`--z-${k}:${v}`);
  for (const [k, v] of Object.entries(motion.dur)) vars.push(`--dur-${k}:${v}s`);
  for (const [k, v] of Object.entries(motion.css)) vars.push(`--ease-${k}:${v}`);
  vars.push(`--font-jp:${font.jp}`);
  const light = `${colorVars(color)};color-scheme:light`;
  const dark = `${colorVars(colorDark)};color-scheme:dark`;
  return [
    `:root{${vars.join(";")};${light}}`,
    `@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${dark}}}`,
    `:root[data-theme="dark"]{${dark}}`,
  ].join("");
}
