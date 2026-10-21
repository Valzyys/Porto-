/**
 * Isi halaman /about. Setiap entri timeline punya sumber (lihat README).
 * `when: null` berarti tanggal belum bisa diverifikasi — UI menulis "—".
 */

export const bio: string[] = [
  "Valzyy itu developer full-stack independen dari Semarang, Jawa Tengah. Kerjaannya kebanyakan di belakang layar: API, worker di edge, database, dan bot yang ngirim notifikasi ke tempat fans biasa nongkrong.",
  "Pertengahan 2024 dia mulai JKT48Connect sendirian — ekosistem fan-built untuk JKT48. Dari situ lahir API data, sistem live streaming, payment gateway, sistem partner, aplikasi mobile, dan paket npm @jkt48/core.",
  "Di luar JKT48Connect, Valzyy bantu urusan IT lintas divisi di beberapa fanbase: Cavallery, FritzyForce, dan Nayrakuen.",
];

export type TimelineEntry = {
  when: string | null;
  title: string;
  body: string;
  kind: "proyek" | "kerja" | "rilis";
};

export const timeline: TimelineEntry[] = [
  {
    when: "pertengahan 2024",
    title: "Mendirikan JKT48Connect",
    body: "Mulai sebagai solo developer. Semua modul — API, live, bot — dibangun dan dioperasikan sendiri.",
    kind: "proyek",
  },
  {
    when: "Feb 2025",
    title: "Rilis @jkt48connect/cli di npm",
    body: "CLI dan modul untuk mengakses data API JKT48Connect.",
    kind: "rilis",
  },
  {
    when: "Mei 2025",
    title: "Rilis @jkt48/core v1.0.0",
    body: "Client API JKT48Connect untuk Node.js dan browser, lisensi MIT. Dipakai juga oleh aplikasi mobile.",
    kind: "rilis",
  },
  {
    when: null,
    title: "IT lintas divisi — Cavallery",
    body: "Fanbase yang berdiri 2024, punya situs sendiri di cavallery.id. Peran spesifik belum diverifikasi.",
    kind: "kerja",
  },
  {
    when: null,
    title: "IT lintas divisi — FritzyForce",
    body: "Fanbase member generasi 12. Peran spesifik belum diverifikasi.",
    kind: "kerja",
  },
  {
    when: null,
    title: "IT lintas divisi — Nayrakuen",
    body: "Fanbase member generasi 12. Peran spesifik belum diverifikasi.",
    kind: "kerja",
  },
  {
    when: null,
    title: "Harukaze48, Payment V2, Partnership",
    body: "Platform streaming fan dan modul bisnis ekosistem. Tanggal rilis belum dicatat.",
    kind: "proyek",
  },
];

export type Principle = { code: string; title: string; body: string; evidence: string };

/** Prinsip kerja — masing-masing ditarik dari hal yang benar-benar dibangun. */
export const principles: Principle[] = [
  {
    code: "P1",
    title: "Edge dulu",
    body: "Kalau bisa jalan di Cloudflare Workers, jalankan di sana. Server sendiri baru dipakai kalau memang perlu.",
    evidence: "live, PM API, HLS proxy, payment V2 → Workers",
  },
  {
    code: "P2",
    title: "Keamanan bukan tempelan",
    body: "Stream dikunci dari awal: token ES256 berumur pendek, dan JTI dicatat supaya token tidak bisa dipakai dua kali.",
    evidence: "HLS proxy + JTI di KV",
  },
  {
    code: "P3",
    title: "Satu client untuk semua",
    body: "Logika akses API ditulis sekali, dirilis sebagai paket, lalu dipakai ulang di web, bot, dan mobile.",
    evidence: "@jkt48/core di npm (MIT)",
  },
  {
    code: "P4",
    title: "Datang ke tempat fans",
    body: "Notifikasi dikirim lewat X, WhatsApp, dan Telegram — bukan memaksa orang membuka situs baru.",
    evidence: "bot X (twikit), WhatsApp, Telegram (grammY/GramJS)",
  },
  {
    code: "P5",
    title: "Kecil, bisa diurus sendiri",
    body: "Modul dipisah kecil-kecil supaya satu orang bisa men-deploy dan membetulkannya tanpa merusak yang lain.",
    evidence: "solo dev sejak 2024",
  },
];
