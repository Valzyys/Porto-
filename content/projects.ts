/**
 * Daftar proyek. Semua deskripsi diambil dari fakta yang diberikan pemilik
 * situs + sumber publik (lihat README → Sumber riset). Tidak ada angka
 * trafik/pengguna karena belum ada yang bisa diverifikasi.
 */

export type ProjectCategory = "Web" | "Mobile" | "Bot" | "Infra";

export const categories: ProjectCategory[] = ["Web", "Mobile", "Bot", "Infra"];

export type Proof = {
  label: string;
  /** null = bukti belum ada tautan publik */
  href: string | null;
  kind: "publik" | "belum-publik";
};

export type Project = {
  slug: string;
  name: string;
  /** satu kalimat, tampil di kartu */
  tagline: string;
  categories: ProjectCategory[];
  role: string;
  /** null = tahun belum terverifikasi */
  year: string | null;
  stack: string[];
  problem: string;
  solution: string[];
  challenges: string[];
  /** diagram ASCII alur sistem (opsional) */
  diagram?: string;
  proof: Proof[];
  featured: boolean;
  /** warna aksen kartu (nama token) */
  accent: "pink" | "mint" | "lemon" | "peach";
};

export const projects: Project[] = [
  {
    slug: "jkt48connect",
    name: "JKT48Connect",
    tagline:
      "Ekosistem fan-built untuk JKT48: API data, live streaming, pembayaran, partnership, dan bot — dikerjakan solo sejak 2024.",
    categories: ["Infra", "Web", "Bot"],
    role: "Founder · solo developer (arsitektur, backend, frontend, bot)",
    year: "2024",
    stack: [
      "Cloudflare Workers",
      "Hono",
      "Cloudflare KV",
      "CockroachDB",
      "Hyperdrive",
      "Next.js",
      "React Native / Expo",
      "Python",
      "grammY",
    ],
    problem:
      "Data dan aktivitas member tersebar di banyak platform (IDN Live, Showroom, media sosial). Fans dan fanbase butuh satu sumber yang bisa dipakai bersama: dari API sampai notifikasi.",
    solution: [
      "Satu ekosistem dengan banyak modul kecil yang jalan di edge (Cloudflare Workers), bukan satu server monolit.",
      "API data JKT48 yang dibungkus jadi paket npm @jkt48/core supaya developer lain bisa langsung pakai.",
      "Modul terpisah untuk live streaming, payment gateway, partnership, notifikasi sosial, dan bot Telegram — masing-masing punya halaman studi kasus sendiri di situs ini.",
    ],
    challenges: [
      "Mengelola banyak layanan sekaligus sebagai solo developer: tiap modul harus bisa di-deploy dan diperbaiki sendiri-sendiri.",
      "Menjaga biaya tetap rendah dengan memaksimalkan primitive Cloudflare (Workers, KV, R2, D1, Hyperdrive).",
    ],
    diagram: `fans / fanbase / developer
        │
        ▼
 ┌──────────────── JKT48Connect ────────────────┐
 │  live ── pm-api ── payment-v2 ── partnership │
 │    │        │          │             │       │
 │  workers  workers   hono+crdb     invoice    │
 └────┬────────┬──────────┬─────────────┬───────┘
      ▼        ▼          ▼             ▼
   IDN/SR     KV     CockroachDB    akses/show
      │
      └─▶ bot X · bot WhatsApp · bot Telegram`,
    proof: [
      {
        label: "Paket npm @jkt48/core (author: Valzyy)",
        href: "https://www.npmjs.com/package/@jkt48/core",
        kind: "publik",
      },
      {
        label: "Repo JKT48Connect/jkt48-core (MIT)",
        href: "https://github.com/JKT48Connect/jkt48-core",
        kind: "publik",
      },
    ],
    featured: true,
    accent: "pink",
  },
  {
    slug: "jkt48connect-live",
    name: "JKT48Connect Live",
    tagline:
      "Agregasi /live dari IDN Live dan Showroom, plus HLS proxy di Cloudflare Workers yang dikunci JWT EC P-256.",
    categories: ["Infra", "Web"],
    role: "Desain & implementasi end-to-end",
    year: null,
    stack: ["Cloudflare Workers", "Hono", "Cloudflare KV", "JWT (ES256 / P-256)", "HLS"],
    problem:
      "Status live member ada di dua platform berbeda dengan format berbeda. Di sisi lain, URL stream yang di-proxy gampang dibagikan ulang kalau tidak dilindungi.",
    solution: [
      "Endpoint /live yang menggabungkan data IDN Live dan Showroom jadi satu format.",
      "HLS proxy di Cloudflare Workers: setiap request playlist/segmen wajib membawa JWT bertanda tangan EC P-256 (ES256).",
      "Setiap token punya JTI unik yang dicatat di Cloudflare KV, jadi token yang sama tidak bisa dipakai ulang (replay prevention).",
    ],
    challenges: [
      "Verifikasi tanda tangan ES256 di runtime Workers (Web Crypto), tanpa library Node.",
      "Menyeimbangkan TTL token, TTL entri KV, dan sifat KV yang eventually consistent.",
    ],
    diagram: `player
  │  GET /hls/…m3u8?t=<jwt>
  ▼
worker ──▶ verify ES256 (P-256 pubkey)
  │          │ gagal → 401
  ▼          ▼
KV: jti sudah ada? ── ya → 403 (replay)
  │ tidak
  ▼
simpan jti (TTL) ─▶ fetch origin ─▶ stream ke player`,
    proof: [
      {
        label: "Fitur live (IDN/Showroom) tercantum di README jkt48-core",
        href: "https://github.com/JKT48Connect/jkt48-core",
        kind: "publik",
      },
      { label: "Kode HLS proxy belum dipublikasikan", href: null, kind: "belum-publik" },
    ],
    featured: true,
    accent: "mint",
  },
  {
    slug: "jkt48connect-payment",
    name: "Payment Gateway V2",
    tagline: "Pembayaran QRIS dengan Hono + CockroachDB, lengkap dengan alur withdrawal dan panel admin.",
    categories: ["Infra"],
    role: "Desain skema, API, dan alur admin",
    year: null,
    stack: ["Hono", "Cloudflare Workers", "CockroachDB", "Hyperdrive", "QRIS"],
    problem:
      "Layanan berbayar di ekosistem butuh pembayaran yang familiar untuk pengguna Indonesia, dan saldo yang bisa ditarik dengan alur yang bisa diaudit.",
    solution: [
      "API pembayaran QRIS di atas Hono.",
      "Data transaksi di CockroachDB, diakses dari Workers lewat Hyperdrive.",
      "Alur withdrawal dan admin flow untuk meninjau serta memproses penarikan.",
    ],
    challenges: [
      "Koneksi database SQL dari edge runtime — diselesaikan dengan Hyperdrive sebagai connection pooler.",
      "Status transaksi harus konsisten di antara callback pembayaran, saldo, dan withdrawal.",
    ],
    proof: [{ label: "Sistem internal, belum ada tautan publik", href: null, kind: "belum-publik" }],
    featured: false,
    accent: "lemon",
  },
  {
    slug: "jkt48connect-partnership",
    name: "Partnership System",
    tagline: "Sistem partner bertingkat: tier, invoice langganan, dan akses per show.",
    categories: ["Infra", "Web"],
    role: "Desain model bisnis di level data & API",
    year: null,
    stack: ["Cloudflare Workers", "Hono", "CockroachDB"],
    problem:
      "Partner punya kebutuhan berbeda: ada yang langganan rutin, ada yang hanya butuh akses untuk show tertentu.",
    solution: [
      "Tier partner yang menentukan hak akses.",
      "Invoice langganan untuk partner berkala.",
      "Akses per show untuk kebutuhan sekali pakai.",
    ],
    challenges: [
      "Memodelkan dua jenis akses (langganan vs per show) tanpa logika izin yang saling tumpang tindih.",
    ],
    proof: [
      {
        label: "Halaman dokumentasi partner API di domain jkt48connect.com (perlu dicek ulang)",
        href: null,
        kind: "belum-publik",
      },
    ],
    featured: false,
    accent: "peach",
  },
  {
    slug: "jkt48connect-bots",
    name: "Social & Telegram Bots",
    tagline:
      "Bot notifikasi X dan WhatsApp, plus bot Telegram untuk membuat channel, meneruskan PM, dan PM Shop.",
    categories: ["Bot"],
    role: "Penulis & operator bot",
    year: null,
    stack: ["Python", "twikit", "asyncio", "grammY", "GramJS", "Node.js", "Cloudflare KV"],
    problem:
      "Fans ingin notifikasi cepat di platform yang mereka pakai sehari-hari, bukan harus membuka satu situs.",
    solution: [
      "Bot Twitter/X berbasis Python + twikit, dengan asyncio lock supaya job paralel tidak mengirim notifikasi ganda.",
      "Bot WhatsApp untuk notifikasi sosial.",
      "Bot Telegram (grammY/GramJS): pembuatan channel, PM forwarding, dan PM Shop yang terhubung ke PM API (REST di Cloudflare Workers + KV).",
    ],
    challenges: [
      "Race condition antar task async — ditangani dengan asyncio lock.",
      "Menyatukan banyak bot ke satu sumber data agar isinya konsisten.",
    ],
    diagram: `sumber (live / pm / sosial)
          │
          ▼
   PM API · Workers + KV
     ┌────┼─────────┐
     ▼    ▼         ▼
  bot X  bot WA   bot Telegram
 (twikit,        (grammY/GramJS:
  asyncio.Lock)   channel, PM fwd, PM Shop)`,
    proof: [{ label: "Akun & kode bot belum ditautkan", href: null, kind: "belum-publik" }],
    featured: false,
    accent: "mint",
  },
  {
    slug: "harukaze48",
    name: "Harukaze48",
    tagline: "Platform streaming fan dengan frontend React, backend Hono, dan kontrol akses berbasis email.",
    categories: ["Web"],
    role: "Full-stack developer",
    year: null,
    stack: ["React", "Hono", "Cloudflare Workers"],
    problem: "Komunitas butuh tempat menonton bersama yang aksesnya hanya untuk anggota terdaftar.",
    solution: [
      "Frontend React untuk pengalaman menonton.",
      "Backend Hono yang memeriksa akses berdasarkan email terdaftar.",
    ],
    challenges: ["Menjaga kontrol akses tetap sederhana untuk admin, tapi tidak mudah dibobol."],
    proof: [{ label: "URL publik belum dikonfirmasi", href: null, kind: "belum-publik" }],
    featured: true,
    accent: "peach",
  },
  {
    slug: "cavallery",
    name: "Cavallery",
    tagline: "Situs fanbase untuk salah satu member JKT48: jadwal, status live, berita, dan proyek fans.",
    categories: ["Web"],
    role: "Divisi IT (peran spesifik belum terverifikasi)",
    year: null,
    stack: ["Next.js", "CMS", "Cloudflare Workers / Pages"],
    problem:
      "Fanbase butuh satu situs resmi komunitas yang mudah diperbarui oleh pengurus non-teknis.",
    solution: [
      "Next.js dengan CMS supaya konten bisa diubah tanpa deploy ulang manual.",
      "Halaman jadwal, show theater, status live, dan berita fanbase.",
      "Di-hosting di Cloudflare (Workers/Pages).",
    ],
    challenges: ["Menggabungkan konten CMS dengan data jadwal/live yang terus berubah."],
    proof: [{ label: "cavallery.id", href: "https://cavallery.id", kind: "publik" }],
    featured: false,
    accent: "lemon",
  },
  {
    slug: "jkt48connect-mobile",
    name: "JKT48Connect Mobile",
    tagline: "Aplikasi React Native / Expo yang memakai @jkt48/core sebagai lapisan data.",
    categories: ["Mobile"],
    role: "Mobile developer",
    year: null,
    stack: ["React Native", "Expo", "@jkt48/core", "TypeScript"],
    problem: "Akses ke data ekosistem dari ponsel, tanpa harus membuka browser.",
    solution: [
      "Aplikasi Expo yang memanggil API lewat paket @jkt48/core — paket yang sama dengan yang dipakai developer lain.",
    ],
    challenges: ["Menjaga satu client API yang sama tetap jalan di Node.js, browser, dan React Native."],
    proof: [
      {
        label: "@jkt48/core: “client for Node.js and browsers”",
        href: "https://www.npmjs.com/package/@jkt48/core",
        kind: "publik",
      },
      { label: "Link toko aplikasi belum ada", href: null, kind: "belum-publik" },
    ],
    featured: true,
    accent: "pink",
  },
  {
    slug: "jkt48-core",
    name: "@jkt48/core",
    tagline: "Paket npm open-source (MIT): client resmi API JKT48Connect untuk Node.js dan browser.",
    categories: ["Infra"],
    role: "Author & maintainer",
    year: "2025",
    stack: ["Node.js", "TypeScript", "npm"],
    problem: "Developer lain ingin memakai data JKT48Connect tanpa menulis ulang request ke API.",
    solution: [
      "Satu paket berisi fungsi untuk member, event, theater, berita, live (YouTube, IDN, Showroom), replay, dan chat stream.",
      "Dirilis di npm dengan lisensi MIT; versi pertama terbit 12 Mei 2025.",
    ],
    challenges: ["Menjaga API paket tetap stabil sementara API di belakangnya terus berkembang."],
    proof: [
      { label: "npmjs.com/package/@jkt48/core", href: "https://www.npmjs.com/package/@jkt48/core", kind: "publik" },
      { label: "github.com/JKT48Connect/jkt48-core", href: "https://github.com/JKT48Connect/jkt48-core", kind: "publik" },
    ],
    featured: false,
    accent: "mint",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
