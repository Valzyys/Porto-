/**
 * Utilitas ASCII/pixel: ramp karakter, matriks Bayer untuk dithering,
 * dan font pixel 5×5 buatan sendiri untuk tulisan blok (signature, 404).
 */

/** dari gelap ke terang */
export const RAMP = " .`:-=+*%#@";

export const SCRAMBLE_CHARS = "!<>-_\\/[]{}=+*^?#@$%&01";

/** Bayer 4×4, dinormalisasi 0..1 */
export const BAYER4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
].map((row) => row.map((v) => (v + 0.5) / 16));

/** Font pixel 5×5 — hanya glyph yang dipakai situs ini. */
const GLYPHS: Record<string, string[]> = {
  A: [".###.", "#...#", "#####", "#...#", "#...#"],
  D: ["####.", "#...#", "#...#", "#...#", "####."],
  E: ["#####", "#....", "####.", "#....", "#####"],
  L: ["#....", "#....", "#....", "#....", "#####"],
  N: ["#...#", "##..#", "#.#.#", "#..##", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", ".###."],
  S: [".####", "#....", ".###.", "....#", "####."],
  T: ["#####", "..#..", "..#..", "..#..", "..#.."],
  V: ["#...#", "#...#", "#...#", ".#.#.", "..#.."],
  Y: ["#...#", ".#.#.", "..#..", "..#..", "..#.."],
  Z: ["#####", "...#.", "..#..", ".#...", "#####"],
  "0": [".###.", "#..##", "#.#.#", "##..#", ".###."],
  "4": ["#..#.", "#..#.", "#####", "...#.", "...#."],
  " ": [".....", ".....", ".....", ".....", "....."],
};

/** Render teks jadi baris-baris ASCII memakai karakter `on`/`off`. */
export function blockText(text: string, on = "█", off = " ", gap = 1): string[] {
  const rows = ["", "", "", "", ""];
  const chars = text.toUpperCase().split("");
  chars.forEach((ch, i) => {
    const g = GLYPHS[ch] ?? GLYPHS[" "];
    for (let r = 0; r < 5; r++) {
      rows[r] += g[r].replace(/#/g, on).replace(/\./g, off);
      if (i < chars.length - 1) rows[r] += off.repeat(gap);
    }
  });
  return rows;
}

/** Bitmap 0/1 dari teks (dipakai canvas). */
export function blockBitmap(text: string, gap = 1): number[][] {
  return blockText(text, "1", "0", gap).map((r) => r.split("").map(Number));
}
