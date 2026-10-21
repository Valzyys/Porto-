/**
 * Ambil screenshot UI dari server preview (default http://localhost:8787).
 * Pakai:  node scripts/screenshots.mjs [baseUrl]
 * Butuh paket `playwright` (tidak masuk dependencies proyek; pasang global/terpisah).
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] ?? "http://localhost:8787";
const OUT = (process.env.OUT_DIR ?? new URL("../screenshots/", import.meta.url).pathname).replace(/\/?$/, "/");
mkdirSync(OUT, { recursive: true });

const SIZES = { mobile: { width: 390, height: 844 }, desktop: { width: 1440, height: 900 } };
const PAGES = [
  ["home", "/"],
  ["about", "/about"],
  ["projects", "/projects"],
  ["project-detail", "/projects/jkt48connect-live"],
  ["stack", "/stack"],
  ["contact", "/contact"],
  ["404", "/halaman-yang-tidak-ada"],
];

const errors = [];
const browser = await chromium.launch();

async function newPage(size, { skipIntro = true, theme = "dark" } = {}) {
  const ctx = await browser.newContext({ viewport: SIZES[size], deviceScaleFactor: 1, hasTouch: size === "mobile", isMobile: size === "mobile" });
  if (skipIntro) await ctx.addInitScript(() => { try { sessionStorage.setItem("vzy:intro-seen", "1"); } catch {} });
  await ctx.addInitScript((t) => { try { localStorage.setItem("vzy:theme", t); } catch {} }, theme);
  const page = await ctx.newPage();
  // kursor di tengah layar supaya spotlight tidak menumpuk di pojok
  if (size === "desktop") page.on("load", () => page.mouse.move(SIZES.desktop.width * 0.62, SIZES.desktop.height * 0.45).catch(() => {}));
  page.on("pageerror", (e) => errors.push(`${size} ${page.url()} pageerror: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`${size} ${page.url()} console: ${m.text()}`));
  return { ctx, page };
}

/** scroll pelan ke bawah supaya semua reveal/ScrollTrigger terpicu */
async function sweep(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= h; y += 300) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(900);
}

const shot = (page, name, full = false) => page.screenshot({ path: `${OUT}${name}.png`, fullPage: full });

for (const size of Object.keys(SIZES)) {
  // 1) intro / loader (sesi baru, intro belum pernah tampil)
  {
    const { ctx, page } = await newPage(size, { skipIntro: false });
    await page.goto(BASE + "/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);
    await shot(page, `home-${size}-intro`);
    // tirai pixel membuka setelah intro
    await page.waitForTimeout(1600);
    await shot(page, `home-${size}-intro-curtain`);
    await ctx.close();
  }

  // 2) tiap halaman: viewport atas + full page
  for (const [name, path] of PAGES) {
    const { ctx, page } = await newPage(size);
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(1800);
    await shot(page, `${name}-${size}-${name === "home" ? "hero" : "top"}`);
    await sweep(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await shot(page, `${name}-${size}-full`, true);
    if (name === "home") {
      // footer (credit roll + signature ASCII)
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(1500);
      await shot(page, `home-${size}-footer`);
      // section proyek pinned (desktop: horizontal)
      // ukur dari pin-spacer (posisi section ikut bergeser setelah pin selesai)
      const y = await page.evaluate(() => {
        const s = document.querySelector("#featured-title")?.closest("section");
        const el = s?.parentElement?.classList.contains("pin-spacer") ? s.parentElement : s;
        return el.getBoundingClientRect().top + window.scrollY;
      });
      await page.evaluate((yy) => window.scrollTo(0, yy + 700), y);
      await page.waitForTimeout(1500);
      await shot(page, `home-${size}-pinned-projects`);
    }
    await ctx.close();
  }

  // 2b) light mode: tiap halaman (viewport atas) + full page beranda
  for (const [name, path] of PAGES) {
    const { ctx, page } = await newPage(size, { theme: "light" });
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(1800);
    await shot(page, `${name}-${size}-light`);
    if (name === "home") {
      await sweep(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(600);
      await shot(page, `home-${size}-light-full`, true);
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(1500);
      await shot(page, `home-${size}-light-footer`);
    }
    await ctx.close();
  }
  {
    const { ctx, page } = await newPage(size, { theme: "light" });
    await page.goto(BASE + "/projects", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.getByRole("button", { name: "Buka menu" }).click();
    await page.waitForTimeout(1200);
    await shot(page, `menu-${size}-light-open`);
    await ctx.close();
  }

  // 3) menu terbuka + filter proyek
  {
    const { ctx, page } = await newPage(size);
    await page.goto(BASE + "/about", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.getByRole("button", { name: "Buka menu" }).click();
    await page.waitForTimeout(1200);
    await shot(page, `menu-${size}-open`);
    await ctx.close();
  }
  {
    const { ctx, page } = await newPage(size);
    await page.goto(BASE + "/projects", { waitUntil: "networkidle" });
    await page.waitForTimeout(800);
    await page.getByRole("button", { name: /^Bot/ }).click();
    await page.waitForTimeout(1200);
    await shot(page, `projects-${size}-filter-bot`);
    await ctx.close();
  }

  // 4) transisi halaman: frame saat tile menutup & saat membuka
  {
    const { ctx, page } = await newPage(size);
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    await page.getByRole("button", { name: "Buka menu" }).click();
    await page.waitForTimeout(900);
    await page.getByRole("link", { name: /PROJECTS/i }).first().click();
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
