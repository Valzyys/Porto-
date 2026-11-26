/**
 * Design tokens — satu-satunya sumber nilai visual & gerak.
 *
 * - Warna, spacing, radius, z-index → CSS custom properties (`tokensToCss`)
 *   yang dipetakan ke Tailwind lewat `@theme inline` di app/globals.css
 *   (`bg-canvas`, `text-ink`, `border-line`, `font-mono`, …).
 * - Durasi, easing, stagger → dipakai langsung oleh GSAP lewat `motion`.
 *
 * Arah visual: docs teknis yang tenang — kanvas krem, tinta hampir hitam,
 * garis tipis, aksen biru tunggal, ilustrasi pixel.
 */

/** Tema terang (default ikut sistem). */
export const color = {
  canvas: "#f2f2ef",
  /** panel sedikit lebih terang (input, kartu aktif) */
  surface: "#f7f7f4",
  /** panel sedikit lebih gelap (strip, hover) */
  sunken: "#ebebe7",
  line: "#d6d6d1",
  /** garis kuat (fokus, aktif) */
  strong: "#1b1b1a",
  ink: "#1b1b1a",
  /** teks sekunder — kontras 5.1:1 di atas canvas */
  mute: "#66665f",
  /** tombol utama */
  button: "#1b1b1a",
  onButton: "#f2f2ef",
  blue: "#2f55d4",
  blueSoft: "#dfe5fb",
  orange: "#d9661f",
  orangeSoft: "#fbe9dc",
  green: "#2e7d4f",
  red: "#c0392b",
  /** tingkat abu untuk ilustrasi pixel */
  px1: "#dcdcd7",
  px2: "#c2c2bc",
  px3: "#97978f",
  px4: "#5f5f59",
  /** latar blok kode */
  code: "#ebebe6",
} as const;

/** Tema gelap: nama token sama. */
export const colorDark: Record<keyof typeof color, string> = {
  canvas: "#121211",
  surface: "#191918",
  sunken: "#1f1f1d",
  line: "#2e2e2b",
  strong: "#ecece8",
  ink: "#ecece8",
  mute: "#9b9b94",
  button: "#ecece8",
  onButton: "#121211",
  blue: "#7090ff",
  blueSoft: "#1d2547",
  orange: "#f08a45",
  orangeSoft: "#3a2516",
  green: "#5cc48a",
  red: "#ef6b5b",
  px1: "#262624",
  px2: "#383835",
  px3: "#62625c",
  px4: "#9c9c95",
  code: "#1a1a18",
};

export type ColorName = keyof typeof color;

export const font = {
  /** teks UI & judul (Geist, OFL) */
  sans: "var(--font-geist)",
  /** label mikro, nav, kode (Geist Mono, OFL) */
  mono: "var(--font-geist-mono)",
  /** wordmark pixel saja (Silkscreen, OFL) */
  pixel: "var(--font-silkscreen)",
} as const;

export const space = {
  unit: "0.25rem",
  gutter: "clamp(1rem, 4vw, 4rem)",
  section: "clamp(4rem, 9vw, 7rem)",
  container: "80rem",
  /** tinggi topbar */
  bar: "4.5rem",
} as const;

export const radius = {
  /** kotak input/terminal */
  box: "1.25rem",
  /** tombol & badge kecil */
  tag: "2px",
} as const;

export const layer = {
  base: 0,
  raised: 10,
  nav: 60,
  drawer: 70,
  dialog: 75,
  curtain: 80,
} as const;

export const motion = {
  dur: {
    instant: 0.12,
    fast: 0.25,
    base: 0.5,
    slow: 0.9,
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
    tight: 0.03,
    base: 0.06,
    loose: 0.12,
    /** total waktu tile transisi menutup/membuka layar */
    tiles: 0.38,
  },
  css: {
    out: "cubic-bezier(0.22, 1, 0.36, 1)",
    inOut: "cubic-bezier(0.87, 0, 0.13, 1)",
  },
} as const;

export const breakpoint = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const;

/** Batas performa canvas bar pixel di hero. */
export const canvasBudget = { fps: 30, cell: { mobile: 10, desktop: 12 } } as const;

export type Theme = "dark" | "light";
export const THEME_KEY = "jkt48core:theme";
/** "off" = animasi dimatikan lewat tombol di footer. Default: animasi jalan. */
export const MOTION_KEY = "jkt48core:motion";

const kebab = (s: string) => s.replace(/[A-Z0-9]+/g, (m) => `-${m.toLowerCase()}`);

const colorVars = (c: Record<string, string>) =>
  Object.entries(c)
    .map(([k, v]) => `--c-${kebab(k)}:${v}`)
    .join(";");

/**
 * Render semua token jadi CSS untuk disuntik di <head>.
 * Default ikut sistem; pilihan manual (data-theme di <html>) menang.
 */
export function tokensToCss(): string {
  const vars: string[] = [];
  for (const [k, v] of Object.entries(space)) vars.push(`--s-${k}:${v}`);
  for (const [k, v] of Object.entries(radius)) vars.push(`--r-${k}:${v}`);
  for (const [k, v] of Object.entries(layer)) vars.push(`--z-${k}:${v}`);
  for (const [k, v] of Object.entries(motion.dur)) vars.push(`--dur-${k}:${v}s`);
  for (const [k, v] of Object.entries(motion.css)) vars.push(`--ease-${k}:${v}`);
  const light = `${colorVars(color)};color-scheme:light`;
  const dark = `${colorVars(colorDark)};color-scheme:dark`;
  return [
    `:root{${vars.join(";")};${light}}`,
    `@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${dark}}}`,
    `:root[data-theme="dark"]{${dark}}`,
  ].join("");
}
