/**
 * Stack ditampilkan sebagai "setlist". Level jujur, tanpa persentase:
 * - "sering": dipakai rutin di proyek yang sedang jalan
 * - "pakai": pernah/sedang dipakai di proyek nyata
 * - "eksplorasi": baru dicoba (di sini: dipakai untuk membangun situs ini)
 */

export type Level = "sering" | "pakai" | "eksplorasi";

export const levels: { id: Level; label: string; desc: string; pips: 1 | 2 | 3 }[] = [
  { id: "sering", label: "Sering dipakai", desc: "andalan di proyek yang jalan sekarang", pips: 3 },
  { id: "pakai", label: "Pakai", desc: "dipakai di proyek nyata", pips: 2 },
  { id: "eksplorasi", label: "Eksplorasi", desc: "baru dicoba, belum jadi andalan", pips: 1 },
];

export type StackItem = { name: string; level: Level; where: string };

export type StackGroup = { id: string; title: string; note: string; items: StackItem[] };

export const stack: StackGroup[] = [
  {
    id: "edge",
    title: "Edge & runtime",
    note: "Hampir semua backend jalan di Cloudflare.",
    items: [
      { name: "Cloudflare Workers", level: "sering", where: "live, PM API, HLS proxy, payment" },
      { name: "Hono", level: "sering", where: "payment V2, Harukaze48 backend" },
      { name: "Cloudflare KV", level: "sering", where: "PM API, JTI replay prevention" },
      { name: "Cloudflare R2", level: "pakai", where: "penyimpanan objek" },
      { name: "Cloudflare D1", level: "pakai", where: "SQLite di edge" },
      { name: "Hyperdrive", level: "pakai", where: "pool koneksi ke CockroachDB" },
    ],
  },
  {
    id: "data",
    title: "Data",
    note: "SQL terdistribusi kalau butuh konsistensi, KV kalau butuh cepat.",
    items: [
      { name: "CockroachDB", level: "sering", where: "payment gateway V2, partnership" },
      { name: "Supabase", level: "pakai", where: "Postgres terkelola" },
    ],
  },
  {
    id: "frontend",
    title: "Frontend & mobile",
    note: "Web dan aplikasi berbagi satu client API.",
    items: [
      { name: "Next.js", level: "sering", where: "Cavallery" },
      { name: "React", level: "sering", where: "Harukaze48" },
      { name: "React Native / Expo", level: "pakai", where: "JKT48Connect Mobile" },
    ],
  },
  {
    id: "backend",
    title: "Server & paket",
    note: "Node.js untuk yang belum cocok di edge.",
    items: [
      { name: "Node.js", level: "sering", where: "bot, @jkt48/core" },
      { name: "Express", level: "pakai", where: "layanan Node.js" },
    ],
  },
  {
    id: "bots",
    title: "Bot",
    note: "Notifikasi datang ke tempat fans sudah berada.",
    items: [
      { name: "Python + twikit", level: "pakai", where: "bot Twitter/X (asyncio lock)" },
      { name: "grammY", level: "pakai", where: "bot Telegram" },
      { name: "GramJS", level: "pakai", where: "otomasi Telegram (channel, PM forwarding)" },
    ],
  },
  {
    id: "lab",
    title: "Situs ini",
    note: "Dibangun untuk portofolio ini.",
    items: [
      { name: "GSAP + ScrollTrigger", level: "eksplorasi", where: "semua animasi di sini" },
      { name: "Lenis", level: "eksplorasi", where: "smooth scroll" },
      { name: "OpenNext (Cloudflare)", level: "eksplorasi", where: "deploy Next.js ke Workers" },
    ],
  },
];

/** daftar datar untuk marquee */
export const marqueeStack: string[] = stack
  .filter((g) => g.id !== "lab")
  .flatMap((g) => g.items.map((i) => i.name));
