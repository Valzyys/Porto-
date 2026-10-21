/**
 * Data identitas & kontak. Edit di sini, bukan di komponen.
 * Nilai `null` = belum diverifikasi → UI menampilkan placeholder yang jelas
 * dan item terkait tercatat sebagai [TODO] di README.
 */

export const site = {
  name: "Valzyy",
  handle: "valzyy",
  title: "Valzyy — independent full-stack developer",
  description:
    "Portofolio Valzyy: independent full-stack developer dari Semarang, Jawa Tengah. Founder JKT48Connect, ekosistem fan-built yang jalan di Cloudflare Workers.",
  role: "Independent full-stack developer",
  roleShort: "Full-stack dev",
  founderOf: "JKT48Connect",
  since: 2024,
  location: {
    city: "Semarang",
    province: "Jawa Tengah",
    country: "Indonesia",
    /** koordinat pusat kota Semarang (dibulatkan) */
    lat: -6.97,
    lon: 110.42,
    timezone: "Asia/Jakarta",
    tzLabel: "WIB",
  },
  /** URL produksi. [TODO] ganti setelah domain final dipasang. */
  url: "https://valzyy-portfolio.example.workers.dev",
} as const;

export type ContactItem = {
  id: string;
  label: string;
  /** teks yang tampil, mis. username */
  value: string | null;
  href: string | null;
  note: string;
  verified: boolean;
};

export const contacts: ContactItem[] = [
  {
    id: "github",
    label: "GitHub",
    value: "valzyys",
    href: "https://github.com/valzyys",
    note: "akun pribadi — tercatat sebagai maintainer paket npm @jkt48/core",
    verified: true,
  },
  {
    id: "github-org",
    label: "GitHub org",
    value: "JKT48Connect",
    href: "https://github.com/JKT48Connect",
    note: "organisasi tempat repo jkt48-core",
    verified: true,
  },
  {
    id: "npm",
    label: "npm",
    value: "@jkt48/core",
    href: "https://www.npmjs.com/package/@jkt48/core",
    note: "client API JKT48Connect, lisensi MIT",
    verified: true,
  },
  {
    id: "email",
    label: "Email",
    value: null,
    href: null,
    note: "belum dipublikasikan — isi di content/site.ts",
    verified: false,
  },
  {
    id: "telegram",
    label: "Telegram",
    value: null,
    href: null,
    note: "belum dipublikasikan — isi di content/site.ts",
    verified: false,
  },
];

export type NavItem = { href: string; label: string; hint: string };

export const nav: NavItem[] = [
  { href: "/", label: "Home", hint: "panggung utama" },
  { href: "/about", label: "About", hint: "bio, timeline, lokasi" },
  { href: "/projects", label: "Projects", hint: "studi kasus & filter" },
  { href: "/stack", label: "Stack", hint: "setlist teknologi" },
  { href: "/contact", label: "Contact", hint: "encore — hubungi" },
];
