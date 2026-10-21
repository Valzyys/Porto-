/**
 * Design tokens — satu-satunya sumber nilai visual & gerak.
 *
 * - Warna, spacing, font, z-index → diubah jadi CSS custom properties
 *   (lihat `tokensToCss`) dan dipetakan ke Tailwind lewat `@theme inline`
 *   di app/globals.css. Komponen cukup pakai class Tailwind (`bg-ink`,
 *   `text-pink`, `font-display`, …) atau `var(--…)`.
 * - Durasi, easing, stagger → dipakai langsung oleh GSAP lewat `motion`.
 *
 * Palet ini dibuat sendiri: terinspirasi panggung (spotlight, penlight,
 * konfeti), bukan warna resmi grup mana pun.
 */

/** Tema gelap (default): lantai panggung saat lampu mati. */
export const color = {
  /** latar paling gelap */
  ink: "#0d0a12",
  /** latar section/panel */
  stage: "#15101c",
  panel: "#1d1626",
  line: "#342a40",
  /** teks utama: krem, bukan putih murni */
  paper: "#f6efe4",
  /** teks sekunder, kontras ≥ 6:1 di atas ink */
  mute: "#a197ad",
  /** penlight */
  pink: "#ff5fa2",
  mint: "#3ff2c1",
  lemon: "#ffe14a",
  peach: "#ff8b5e",
} as const;

/**
 * Tema terang: panggung siang/gladi resik. Nama token sama, nilainya dibalik.
 * Aksen dibuat lebih pekat supaya kontras teks ≥ 4.5:1 di atas krem, dan
 * `ink` (krem) tetap terbaca di atas blok aksen (tombol, marquee).
 */
export const colorLight: Record<keyof typeof color, string> = {
  ink: "#f7f1e8",
  stage: "#efe7dc",
  panel: "#fbf7f1",
  line: "#d8ccbd",
  paper: "#1b1521",
  mute: "#685e72",
  pink: "#c2286a",
  mint: "#0a7a5f",
  lemon: "#8f6900",
  peach: "#b4461a",
};

export type ColorName = keyof typeof color;

/** Warna penlight yang dipakai bergiliran oleh canvas, konfeti, tile. */
export const penlights: readonly ColorName[] = ["pink", "mint", "lemon", "peach"];

export const font = {
  /** judul & tombol (Bricolage Grotesque, OFL) — bersih, tidak pixel */
  display: "var(--font-bricolage)",
  /** aksen pixel, dipakai hemat: logo, badge, nomor index (Silkscreen, OFL) */
  pixel: "var(--font-silkscreen)",
  /** body, label & data (JetBrains Mono, OFL) */
  mono: "var(--font-jetbrains)",
} as const;

export const space = {
  /** unit dasar Tailwind (`p-1` = 1 unit). 4px = 1 "pixel" panggung. */
  unit: "0.25rem",
  /** gutter samping halaman: 16px di mobile, membesar di layar lebar */
  gutter: "clamp(1rem, 4vw, 3.5rem)",
  /** jarak vertikal antar section */
  section: "clamp(5rem, 14vw, 11rem)",
  /** ukuran sisi border pixel */
  pixel: "4px",
} as const;

export const layer = {
  base: 0,
  raised: 10,
  hud: 60,
  menu: 70,
  curtain: 80,
  intro: 90,
  cursor: 100,
} as const;

export const motion = {
  dur: {
    instant: 0.12,
    fast: 0.25,
    base: 0.5,
    slow: 0.9,
    /** panjang boot sequence intro (detik) */
    intro: 2.6,
    /** satu siklus marquee */
    marquee: 28,
  },
  ease: {
    out: "power3.out",
    in: "power3.in",
    inOut: "expo.inOut",
    /** gerak masuk/keluar yang halus (dipakai tile transisi & reveal) */
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
  /** easing versi CSS untuk transition/keyframes */
  css: {
    out: "cubic-bezier(0.22, 1, 0.36, 1)",
    inOut: "cubic-bezier(0.87, 0, 0.13, 1)",
  },
} as const;

/** Breakpoint (px) — sama dengan default Tailwind supaya konsisten. */
export const breakpoint = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

/** Batas performa canvas ASCII. */
export const canvasBudget = {
  fps: 30,
  cell: { mobile: 11, desktop: 10 },
  confetti: { mobile: 18, desktop: 48 },
} as const;

export type Theme = "dark" | "light";
export const THEME_KEY = "vzy:theme";

const colorVars = (c: Record<string, string>) =>
  Object.entries(c)
    .map(([k, v]) => `--c-${k}:${v}`)
    .join(";");

/**
 * Render semua token jadi CSS untuk disuntik di <head>.
 * Tema: default ikut sistem (prefers-color-scheme); pilihan manual disimpan
 * sebagai `data-theme` di <html> dan menang atas setting sistem.
 */
export function tokensToCss(): string {
  const vars: string[] = [];
  for (const [k, v] of Object.entries(space)) vars.push(`--s-${k}:${v}`);
  for (const [k, v] of Object.entries(layer)) vars.push(`--z-${k}:${v}`);
  for (const [k, v] of Object.entries(motion.dur)) vars.push(`--dur-${k}:${v}s`);
  for (const [k, v] of Object.entries(motion.css)) vars.push(`--ease-${k}:${v}`);
  const dark = `${colorVars(color)};color-scheme:dark`;
  const light = `${colorVars(colorLight)};color-scheme:light`;
  return [
    `:root{${vars.join(";")};${dark}}`,
    `@media (prefers-color-scheme: light){:root:not([data-theme="dark"]){${light}}}`,
    `:root[data-theme="light"]{${light}}`,
  ].join("");
}
