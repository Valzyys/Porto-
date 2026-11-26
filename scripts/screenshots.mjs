/**
 * Ambil screenshot UI dari server preview (default http://localhost:8787).
 * Pakai:  node scripts/screenshots.mjs [baseUrl]
 * Butuh paket `playwright` (tidak masuk dependencies proyek; pasang global/terpisah).
 */
import { chromium } from "playwright";
import { mkdirSync, readdirSync, rmSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:8787";
const OUT = (process.env.OUT_DIR ?? new URL("../screenshots/", import.meta.url).pathname).replace(/\/?$/, "/");
mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) if (f.endsWith(".png")) rmSync(OUT + f);

const THEME_KEY = "jkt48core:theme";
const SIZES = { mobile: { width: 390, height: 844 }, desktop: { width: 1440, height: 900 } };
const PAGES = [
  ["home", "/"],
  ["client", "/client"],
  ["modules", "/modules"],
  ["access", "/access"],
  ["docs", "/docs"],
  ["docs-quickstart", "/docs/quickstart"],
  ["docs-api-live", "/docs/api/live"],
  ["docs-endpoints", "/docs/endpoints"],
  ["docs-versions", "/docs/versions"],
  ["404", "/halaman-yang-tidak-ada"],
];

const errors = [];
const browser = await chromium.launch();

async function newPage(size, theme = "light") {
  const ctx = await browser.newContext({ viewport: SIZES[size], deviceScaleFactor: 1, hasTouch: size === "mobile", isMobile: size === "mobile" });
  await ctx.addInitScript(([k, t]) => { try { localStorage.setItem(k, t); } catch {} }, [THEME_KEY, theme]);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`${size} ${page.url()} pageerror: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`${size} ${page.url()} console: ${m.text()}`));
  return { ctx, page };
}

/** scroll pelan ke bawah supaya semua reveal/ScrollTrigger terpicu */
async function sweep(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += 300) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(900);
}

const shot = (page, name, full = false) => page.screenshot({ path: `${OUT}${name}.png`, fullPage: full });

for (const size of Object.keys(SIZES)) {
  // 1) tiap halaman: viewport atas + full page (terang), viewport atas (gelap)
  for (const [name, path] of PAGES) {
    const { ctx, page } = await newPage(size);
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(1600);
    await shot(page, `${name}-${size}-top`);
    await sweep(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    await shot(page, `${name}-${size}-full`, true);
    await ctx.close();
  }
  for (const [name, path] of PAGES) {
    const { ctx, page } = await newPage(size, "dark");
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(1600);
    await shot(page, `${name}-${size}-dark`);
    if (name === "home") {
      await sweep(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
      await shot(page, `home-${size}-dark-full`, true);
    }
    await ctx.close();
  }

  // 2) interaksi: pencarian ⌘K, filter modul, menu mobile, toggle tema
  {
    const { ctx, page } = await newPage(size);
    await page.goto(BASE + "/docs", { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    await page.keyboard.press("/");
    await page.waitForTimeout(500);
    await page.keyboard.type("live");
    await page.waitForTimeout(500);
    await shot(page, `search-${size}-open`);
    await ctx.close();
  }
  {
    const { ctx, page } = await newPage(size);
    await page.goto(BASE + "/modules", { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    await page.getByRole("button", { name: /^Admin/ }).click();
    await page.waitForTimeout(1200);
    await shot(page, `modules-${size}-filter-admin`);
    await ctx.close();
  }
  if (size === "mobile") {
    const { ctx, page } = await newPage(size);
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(900);
    await page.getByRole("button", { name: "Buka menu" }).click();
    await page.waitForTimeout(900);
    await shot(page, `menu-${size}-open`);
    await ctx.close();
  } else {
    const { ctx, page } = await newPage(size);
    await page.goto(BASE + "/access", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.getByRole("radio", { name: "Tema gelap" }).click();
    await page.waitForTimeout(900);
    await shot(page, `theme-${size}-toggled-dark`);
    await ctx.close();
  }

  // 3) transisi halaman: frame saat tile menutup, menutupi, membuka, selesai
  {
    const { ctx, page } = await newPage(size);
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    await page.evaluate(() => [...document.querySelectorAll("a[href='/docs/quickstart']")][0].click());
    await page.waitForTimeout(260);
    await shot(page, `transition-${size}-closing`);
    await page.waitForTimeout(520);
    await shot(page, `transition-${size}-covered`);
    await page.waitForTimeout(380);
    await shot(page, `transition-${size}-opening`);
    await page.waitForTimeout(1200);
    await shot(page, `transition-${size}-done`);
    console.log(size, "url setelah transisi:", page.url());
    await ctx.close();
  }
}

await browser.close();
console.log(errors.length ? "ERRORS:\n" + errors.join("\n") : "no page errors");
