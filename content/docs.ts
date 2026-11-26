/**
 * Isi halaman /docs. Setiap halaman = daftar blok terstruktur yang dirender
 * oleh components/docs/Blocks.tsx. Teks mendukung markdown inline kecil:
 * `kode`, **tebal**, dan [teks](url).
 *
 * Halaman API (/docs/api/*), /docs/endpoints, dan /docs/versions dibangkitkan
 * dari content/api.ts & content/pkg.ts, jadi tidak ditulis ulang di sini.
 */

import { modules, methodCount } from "./api";
import { pkg } from "./pkg";

export type CodeTab = { label: string; lang: "js" | "jsx" | "bash" | "html" | "text"; code: string };

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; id: string; text: string }
  | { type: "code"; title?: string; tabs: CodeTab[] }
  | { type: "callout"; tone: "info" | "warn" | "danger"; title: string; text: string }
  | { type: "list"; items: string[] }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "install" }
  | { type: "diagram" }
  | { type: "reference" }
  | { type: "api"; moduleId: string }
  | { type: "endpoints" }
  | { type: "versions" }
  | { type: "faq"; items: { q: string; a: string }[] };

export type DocPage = {
  /** path setelah /docs, "" = /docs */
  slug: string;
  title: string;
  description: string;
  section: string;
  blocks: Block[];
};

const esm = `import JKT48Client from "@jkt48/core";

const client = new JKT48Client({ apiKey: "YOUR_API_KEY" });

const members = await client.members.getMembers();
console.log(members);`;

const cjs = `const JKT48Client = require("@jkt48/core");

const client = new JKT48Client({ apiKey: "YOUR_API_KEY" });

client.members.getMembers().then(console.log);`;

export const faq = [
  {
    q: "Apakah paket ini gratis?",
    a: `Ya. ${pkg.name} berlisensi ${pkg.license}. Pemakaian API-nya butuh API key dari JKT48Connect — lihat [dokumentasi API resmi](${pkg.links.apiDocs}).`,
  },
  {
    q: "Apakah ada tipe TypeScript?",
    a: "Belum. `package.json` menunjuk ke `dist/index.d.ts`, tapi file itu tidak ada di tarball 7.7.7. Di TypeScript, deklarasikan modulnya sendiri (lihat halaman Configuration).",
  },
  {
    q: "Bisa dipakai di browser?",
    a: "Bisa (ESM lewat bundler, atau UMD dengan global `JKT48Client`). Ingat: API key ikut terkirim di URL, jadi siapa pun yang membuka DevTools bisa melihatnya.",
  },
  {
    q: "Bisakah base URL diganti?",
    a: `Tidak. Base URL ditanam di kode: \`${pkg.baseUrl}\`. Tidak ada opsi konfigurasi untuk menggantinya.`,
  },
  {
    q: "Bentuk data respons seperti apa?",
    a: `Paket ini mengembalikan \`response.data\` dari axios apa adanya, tanpa transformasi. Skema tiap endpoint ada di [dokumentasi API resmi](${pkg.links.apiDocs}).`,
  },
  {
    q: "Apa itu Grow A Garden di paket JKT48?",
    a: "Modul tambahan `client.garden` untuk data game Grow A Garden (stok, cuaca, restock). Endpoint-nya ada di bawah `/growagarden`.",
  },
];

export const docs: DocPage[] = [
  {
    slug: "",
    title: "Overview",
    section: "Getting started",
    description: `${pkg.name} adalah client JavaScript resmi untuk JKT48Connect API. Satu class, ${modules.length - 1} modul layanan, ${methodCount} method — jalan di Node.js, browser, dan React.`,
    blocks: [
      { type: "install" },
      { type: "diagram" },
      { type: "h2", id: "the-reference", text: "The reference" },
      { type: "reference" },
    ],
  },
  {
    slug: "installation",
    title: "Installation",
    section: "Getting started",
    description: "Pasang paketnya, cek persyaratan, dan pilih format modul yang sesuai.",
    blocks: [
      { type: "install" },
      { type: "h2", id: "requirements", text: "Persyaratan" },
      {
        type: "list",
        items: [
          `Satu dependensi runtime: \`${pkg.dependency.name}@${pkg.dependency.range}\` — ikut terpasang otomatis.`,
          "Lingkungan dengan `URL` global (Node.js modern, semua browser modern) — dipakai untuk membangun query string.",
          "API key JKT48Connect.",
        ],
      },
      { type: "h2", id: "formats", text: "Format modul" },
      {
        type: "table",
        head: ["Format", "File", "Cara memuat"],
        rows: [
          ["ESM", `\`${pkg.entry.esm}\``, "`import JKT48Client from \"@jkt48/core\"`"],
          ["CommonJS", `\`${pkg.entry.cjs}\``, "`const JKT48Client = require(\"@jkt48/core\")`"],
          ["UMD", `\`${pkg.entry.umd}\``, `global \`${pkg.entry.umdGlobal}\` (butuh \`axios\` global)`],
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Tanpa tipe TypeScript",
        text: "`package.json` mendeklarasikan `types: dist/index.d.ts`, tetapi file itu tidak ikut terbit di 7.7.7. Proyek TypeScript perlu deklarasi modul sendiri.",
      },
      { type: "h2", id: "package", text: "Isi paket" },
      {
        type: "table",
        head: ["", ""],
        rows: [
          ["Versi", `\`${pkg.version}\``],
          ["Lisensi", pkg.license],
          ["Author", pkg.author],
          ["Ukuran (unpacked)", pkg.unpackedSize],
          ["Jumlah file", String(pkg.fileCount)],
        ],
      },
    ],
  },
  {
    slug: "quickstart",
    title: "Quickstart",
    section: "Getting started",
    description: "Dari install sampai request pertama dalam empat langkah.",
    blocks: [
      {
        type: "steps",
        items: [
          { title: "Install", text: "Jalankan `npm install @jkt48/core` (atau pnpm/yarn/bun)." },
          { title: "Siapkan API key", text: `Dapatkan API key dari JKT48Connect — lihat [docs.jkt48connect.com](${pkg.links.apiDocs}). Simpan di environment variable, jangan di-commit.` },
          { title: "Buat client", text: "`new JKT48Client({ apiKey })`. Konstruktor melempar `Error(\"API key is required\")` kalau apiKey kosong." },
          { title: "Panggil method", text: "Semua method async dan mengembalikan JSON dari API." },
        ],
      },
      { type: "h2", id: "esm", text: "ES Modules" },
      { type: "code", title: "index.mjs", tabs: [{ label: "ESM", lang: "js", code: esm }] },
      { type: "h2", id: "commonjs", text: "CommonJS" },
      { type: "code", title: "index.js", tabs: [{ label: "CJS", lang: "js", code: cjs }] },
      { type: "h2", id: "check", text: "Cek koneksi" },
      { type: "p", text: "`client.check()` memanggil `/zenova/check` — cara tercepat memastikan API key valid." },
      {
        type: "code",
        tabs: [{ label: "check.js", lang: "js", code: `const status = await client.check();\nconsole.log(status);` }],
      },
    ],
  },
  {
    slug: "configuration",
    title: "Configuration",
    section: "Getting started",
    description: "Opsi konstruktor, setter runtime, dan apa yang dikirim di setiap request.",
    blocks: [
      { type: "h2", id: "options", text: "Opsi konstruktor" },
      {
        type: "table",
        head: ["Opsi", "Tipe", "Wajib", "Keterangan"],
        rows: [
          ["`apiKey`", "string", "ya", "Dikirim sebagai query `apikey` di setiap request."],
          ["`priorityToken`", "string", "tidak", "Dikirim sebagai header `x-priority-token`, query `priority_token`, dan field body `priority_token`."],
          ["`adminCredentials`", "{ username, password }", "tidak", "Dikirim sebagai query `username` & `password`. Dibutuhkan modul Admin."],
        ],
      },
      {
        type: "code",
        title: "client.js",
        tabs: [
          { label: "Dasar", lang: "js", code: `const client = new JKT48Client({\n  apiKey: process.env.JKT48_API_KEY,\n});` },
          { label: "Priority token", lang: "js", code: `const client = new JKT48Client({\n  apiKey: process.env.JKT48_API_KEY,\n  priorityToken: "P-ABCD1234",\n});` },
          {
            label: "Admin",
            lang: "js",
            code: `const client = new JKT48Client({\n  apiKey: process.env.JKT48_API_KEY,\n  adminCredentials: {\n    username: process.env.JKT48_ADMIN_USER,\n    password: process.env.JKT48_ADMIN_PASS,\n  },\n});`,
          },
        ],
      },
      { type: "h2", id: "setters", text: "Mengganti kredensial saat runtime" },
      {
        type: "code",
        tabs: [
          {
            label: "setters.js",
            lang: "js",
            code: `client.setApiKey("NEW_API_KEY");\nclient.setPriorityToken("P-NEWTOKEN");\nclient.setAdminCredentials({ username: "admin", password: "secret" });`,
          },
        ],
      },
      { type: "h2", id: "request", text: "Anatomi request" },
      {
        type: "p",
        text: `Setiap method membangun URL \`${pkg.baseUrl}{path}\` lalu menambahkan \`apikey\`, \`priority_token\` (jika ada), \`username\`/\`password\` (jika ada), lalu parameter lain. Header \`Content-Type: application/json\` selalu dikirim.`,
      },
      {
        type: "callout",
        tone: "danger",
        title: "Kredensial admin ada di URL",
        text: "Username dan password admin dikirim sebagai query string, termasuk untuk request non-admin selama kredensialnya terpasang. URL bisa tercatat di log server/proxy — pakai kredensial admin hanya di server, dan hanya di instance client khusus admin.",
      },
      { type: "h2", id: "typescript", text: "TypeScript" },
      { type: "p", text: "Paket ini belum membawa file deklarasi. Tambahkan deklarasi minimal supaya import tidak error:" },
      {
        type: "code",
        title: "types/jkt48-core.d.ts",
        tabs: [{ label: "d.ts", lang: "js", code: `declare module "@jkt48/core" {\n  const JKT48Client: any;\n  export default JKT48Client;\n}` }],
      },
    ],
  },
  {
    slug: "priority-token",
    title: "Priority token",
    section: "Guides",
    description: "Token yang membuat request diprioritaskan, dan ke mana saja token itu dikirim.",
    blocks: [
      { type: "p", text: "Priority token memberi request prioritas lebih tinggi. Pasang di konstruktor (disarankan) atau ganti kapan saja dengan `setPriorityToken`." },
      {
        type: "table",
        head: ["Lokasi", "Nama", "Kapan"],
        rows: [
          ["Header", "`x-priority-token`", "Semua request"],
          ["Query", "`priority_token`", "Semua request (kecuali sudah ada di params)"],
          ["Body", "`priority_token`", "Request POST/PUT, jika belum ada di body"],
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "Body dimutasi",
        text: "Untuk POST/PUT, field `priority_token` ditulis langsung ke objek data yang kamu kirim (mis. di `createChangelog`). Kirim salinan objek jika objek aslinya masih dipakai.",
      },
    ],
  },
  {
    slug: "error-handling",
    title: "Error handling",
    section: "Guides",
    description: "Tiga bentuk error yang dilempar client dan cara menanganinya.",
    blocks: [
      { type: "p", text: "Semua error dari axios dibungkus jadi `Error` biasa dengan pesan yang bisa dibaca. Bungkus panggilan dengan `try/catch`." },
      {
        type: "table",
        head: ["Kondisi", "Pesan"],
        rows: [
          ["Server membalas error", "`API Error ({status}): {message}` — message dari `response.data.message` atau status text"],
          ["Tidak ada respons", "`Network Error: No response from server`"],
          ["Lainnya", "`Request Error: {message}`"],
          ["Konstruktor tanpa apiKey", "`API key is required`"],
        ],
      },
      {
        type: "code",
        tabs: [
          {
            label: "errors.js",
            lang: "js",
            code: `try {\n  const members = await client.members.getMembers();\n} catch (error) {\n  // "API Error (401): ..." | "Network Error: ..." | "Request Error: ..."\n  console.error(error.message);\n}`,
          },
        ],
      },
      { type: "p", text: "Status HTTP hanya tersedia di dalam teks pesan. Kalau butuh angkanya, parse dari pesan:" },
      {
        type: "code",
        tabs: [{ label: "status.js", lang: "js", code: `const status = Number(error.message.match(/API Error \\((\\d+)\\)/)?.[1]);` }],
      },
    ],
  },
  {
    slug: "react",
    title: "React",
    section: "Guides",
    description: "Pemakaian di komponen dan custom hook.",
    blocks: [
      {
        type: "code",
        title: "App.jsx",
        tabs: [
          {
            label: "Komponen",
            lang: "jsx",
            code: `import { useEffect, useState } from "react";\nimport JKT48Client from "@jkt48/core";\n\nconst client = new JKT48Client({ apiKey: "YOUR_API_KEY" });\n\nexport default function App() {\n  const [members, setMembers] = useState([]);\n\n  useEffect(() => {\n    client.members.getMembers().then(setMembers).catch(console.error);\n  }, []);\n\n  return members.map((m) => <div key={m.id}>{m.name}</div>);\n}`,
          },
          {
            label: "Hook",
            lang: "jsx",
            code: `export function useJKT48Members() {\n  const [state, setState] = useState({ members: [], loading: true, error: null });\n\n  useEffect(() => {\n    client.members\n      .getMembers()\n      .then((members) => setState({ members, loading: false, error: null }))\n      .catch((err) => setState({ members: [], loading: false, error: err.message }));\n  }, []);\n\n  return state;\n}`,
          },
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "API key di bundle",
        text: "Variabel seperti `REACT_APP_*` atau `NEXT_PUBLIC_*` ikut tertanam di bundle browser. Untuk produksi, panggil API dari server (route handler/API route) dan teruskan hasilnya ke client.",
      },
      { type: "p", text: "Contoh `m.id` / `m.name` di atas mengikuti README paket; cek bentuk data sebenarnya di dokumentasi API resmi." },
    ],
  },
  {
    slug: "browser",
    title: "Browser (UMD)",
    section: "Guides",
    description: "Memakai build UMD langsung dari tag script.",
    blocks: [
      { type: "p", text: "Build UMD mendaftarkan global `JKT48Client` dan membaca `axios` dari global, jadi muat axios lebih dulu." },
      {
        type: "code",
        title: "index.html",
        tabs: [
          {
            label: "HTML",
            lang: "html",
            code: `<script src="https://cdn.jsdelivr.net/npm/axios@1/dist/axios.min.js"></script>\n<script src="https://cdn.jsdelivr.net/npm/@jkt48/core@7.7.7/dist/index.umd.js"></script>\n<script>\n  const client = new JKT48Client({ apiKey: "YOUR_API_KEY" });\n  client.live.getLive().then(console.log);\n</script>`,
          },
        ],
      },
    ],
  },
  ...modules.map<DocPage>((m) => ({
    slug: `api/${m.id}`,
    title: m.title,
    section: "API reference",
    description: m.summary,
    blocks: [{ type: "api", moduleId: m.id }],
  })),
  {
    slug: "endpoints",
    title: "Endpoints",
    section: "Reference",
    description: "Semua method dan endpoint HTTP yang dipanggilnya, dalam satu tabel.",
    blocks: [{ type: "endpoints" }],
  },
  {
    slug: "versions",
    title: "Versions",
    section: "Reference",
    description: "Riwayat rilis dari registry npm.",
    blocks: [{ type: "versions" }],
  },
  {
    slug: "faq",
    title: "FAQ",
    section: "Reference",
    description: "Jawaban singkat untuk pertanyaan yang paling sering muncul.",
    blocks: [{ type: "faq", items: faq }],
  },
];

export const sections = ["Getting started", "Guides", "API reference", "Reference"] as const;

export function docHref(p: DocPage): string {
  return p.slug ? `/docs/${p.slug}` : "/docs";
}

export function getDoc(slug: string): DocPage | undefined {
  return docs.find((d) => d.slug === slug);
}
