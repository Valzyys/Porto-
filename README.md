# Valzyy — portofolio

Situs portofolio Valzyy, independent full-stack developer dari Semarang, Jawa Tengah, dan founder JKT48Connect.
Temanya panggung idol + ASCII: hero berupa panggung ASCII di canvas, menu HUD, transisi tile, dan footer berbentuk
credit roll. Tersedia tema gelap dan terang.

- **Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger + Flip (`@gsap/react`) · Lenis
- **Deploy:** Cloudflare Workers + Static Assets lewat `@opennextjs/cloudflare` (bukan Pages)
- **Font (self-host via `next/font`, OFL):** Bricolage Grotesque (judul) · JetBrains Mono (body/label) · Silkscreen (aksen pixel kecil)

---

## Menjalankan lokal

```bash
npm install
npm run dev          # dev server Next.js → http://localhost:3000
npm run lint         # ESLint (eslint-config-next)
npm run typecheck    # tsc --noEmit
npm run build        # build OpenNext (menjalankan `next build` lalu bundling untuk Workers → .open-next/)
npm run build:next   # hanya `next build`
npm run preview      # build + preview di runtime Workers (workerd) → http://localhost:8787
```

Butuh Node.js ≥ 20.9. Wrangler hanya dipakai untuk preview lokal; deploy dilakukan lewat dashboard Cloudflare (lihat
bawah).

### Screenshot

```bash
npm run preview                       # terminal 1
node scripts/screenshots.mjs          # terminal 2 (butuh paket `playwright` terpasang terpisah)
```

Hasilnya masuk ke `screenshots/` dengan pola `halaman-ukuran-state.png` (mobile 390px, desktop 1440px; gelap + `-light`).

---

## Mengedit konten

Semua isi ada di `content/` (TypeScript). Komponen tidak perlu disentuh.

| File | Isi |
| --- | --- |
| `content/site.ts` | nama, peran, lokasi, URL, **kontak**, urutan menu |
| `content/projects.ts` | daftar proyek: tagline, kategori (`Web`/`Mobile`/`Bot`/`Infra`), peran, stack, problem, solusi, tantangan, diagram ASCII, bukti, `featured` |
| `content/stack.ts` | teknologi per blok + level jujur (`sering` / `pakai` / `eksplorasi`) |
| `content/about.ts` | bio, timeline, prinsip kerja |

- Proyek baru otomatis dapat halaman `/projects/[slug]` (statis via `generateStaticParams`).
- Proyek dengan `featured: true` tampil di section pinned beranda (idealnya 3–4).
- Nilai `null` (mis. `year`, kontak `href`) ditampilkan sebagai “belum terverifikasi” / “[ belum diisi ]”, bukan
  dikarang.

### Design tokens

Semua warna (gelap & terang), font, spacing, z-index, durasi, dan easing ada di **`design/tokens.ts`**. Nilainya
disuntik sebagai CSS variable di `<head>` lalu dipetakan ke class Tailwind di `app/globals.css` (`bg-ink`,
`text-pink`, `font-display`, …). GSAP membaca `motion.*` langsung dari file yang sama.

### Tema terang/gelap

- Default ikut setting sistem (`prefers-color-scheme`).
- Tombol tema ada di pojok kanan atas dan di dalam menu. Pilihan disimpan di `localStorage` (`vzy:theme`, dengan
  try/catch) dan diterapkan sebelum paint supaya tidak berkedip.
- Canvas ASCII hero membaca warna dari CSS variable, jadi ikut berganti tema.

---

## Struktur

```
app/
  layout.tsx            font, token CSS, script head (intro + tema), provider, menu, footer
  template.tsx          dipanggil tiap pindah route → buka tirai tile
  page.tsx              beranda: hero ASCII, siapa, setlist pinned, marquee stack, CTA
  about/ projects/ projects/[slug]/ stack/ contact/ not-found.tsx
components/
  ascii/AsciiStage.tsx  panggung ASCII di canvas (lazy-load, ≤30fps, pause offscreen)
  transition/           TransitionProvider (tile grid) + TransitionLink
  nav/HudMenu.tsx       tombol melayang kanan-bawah + overlay HUD 01/05
  layout/               Intro (boot sequence), Footer (credit roll), CornerMark
  ui/                   Scramble, Magnetic, Cursor, Marquee, Reveal, Counter, ScrollProgress, ThemeToggle, …
content/                data situs (edit di sini)
design/tokens.ts        design tokens
lib/                    gsap, store kecil, tema, scramble, util ASCII
scripts/screenshots.mjs ambil screenshot via Playwright
```

---

## Deploy lewat dashboard Cloudflare (Workers Builds)

Proyek ini memakai **Cloudflare Workers + Static Assets** dengan adapter resmi `@opennextjs/cloudflare`.
`wrangler.jsonc` tetap ada karena dibutuhkan adapter dan Workers Builds.

1. Push repo ini ke GitHub.
2. Buka **Cloudflare Dashboard → Workers & Pages → Create → Workers → Import a repository**.
3. Hubungkan akun GitHub, lalu pilih repo ini.
4. Isi konfigurasi build:
   - **Project name:** `valzyy-portfolio` — wajib sama dengan `name` di `wrangler.jsonc`. Kalau mau nama lain, ubah
     dua-duanya.
   - **Build command:** `npm run build` (default dashboard). Script ini sudah menjalankan
     `opennextjs-cloudflare build`, jadi folder `.open-next/` pasti ada sebelum deploy.
     Jangan pakai `next build` saja, karena deploy akan gagal dengan
     `Could not find compiled Open Next config`.
   - **Deploy command:** `npx wrangler deploy` (default)
   - **Non-production branch deploy command (opsional):** `npx wrangler versions upload`
   - **Root directory:** `/`
5. (Opsional) Di **Settings → Variables**, tambahkan `NODE_VERSION = 22` kalau image build memakai Node lama.
   **Tidak ada secret** yang perlu diisi; situs ini tidak membaca `process.env`.
6. **Save and Deploy.** Setiap push ke branch production akan membangun dan men-deploy ulang otomatis.
7. Domain custom: **Settings → Domains & Routes → Add → Custom domain**. Setelah itu perbarui `site.url` di
   `content/site.ts`.

Kompatibilitas Workers:

- `compatibility_date: 2026-10-19`, `compatibility_flags: ["nodejs_compat", "global_fetch_strictly_public"]`.
- Semua halaman diprerender saat build (SSG). Cache incremental dibaca dari Static Assets
  (`static-assets-incremental-cache`), jadi tidak perlu R2/KV/D1.
- `images.unoptimized: true`; situs tidak memakai gambar raster, semua ikon berupa SVG buatan sendiri.
- Font di-self-host oleh `next/font` saat build; tidak ada fetch font saat runtime.
- `cacheComponents` sengaja tidak dinyalakan karena fitur itu butuh runtime Node.js penuh.

---

## Hasil build & verifikasi (terakhir dijalankan)

| Cek | Hasil |
| --- | --- |
| `npm run lint` | lolos, 0 error / 0 warning |
| `tsc --noEmit` | lolos |
| `npm run build` (OpenNext → `next build`) | sukses; 17 halaman statis (`/`, `/about`, `/projects`, 9× `/projects/[slug]` SSG, `/stack`, `/contact`, 404, icon) |
| Ukuran worker (`wrangler deploy --dry-run`) | **5 659 KiB mentah / 1 188 KiB gzip**, di bawah batas free plan 3 MiB |
| Preview Workers (`opennextjs-cloudflare preview`) | `/` `/about` `/projects` `/projects/*` `/stack` `/contact` → 200; URL acak → 404 bertema |
| Error JS di browser (Playwright, semua halaman, 2 ukuran, 2 tema) | tidak ada (selain 404 yang memang disengaja) |
| Overflow horizontal di 360 / 390 / 768 / 1024 / 1280 / 1920 px | tidak ada |
| Perilaku | intro bisa di-skip (klik/Enter/Esc) dan hanya tampil sekali per sesi; navigasi cepat 3 link beruntun berakhir di link terakhir tanpa tirai tertinggal; back/forward dan detail→detail tetap memutar transisi; reduced motion: intro jadi fade, semua konten terlihat; menu bisa dipakai keyboard (fokus masuk, Esc menutup dan fokus kembali ke tombol); kursor custom mati di perangkat sentuh |

Log `Unable to fetch the Request.cf object` saat preview lokal muncul karena sandbox tidak punya akses ke endpoint
Cloudflare itu; tidak memengaruhi halaman.

---

## Sumber riset

Riset dilakukan Oktober 2026. Hanya fakta yang ada sumbernya atau dari brief pemilik yang dipakai.

| Fakta | Sumber |
| --- | --- |
| `@jkt48/core`: “Official JKT48 Connect API client for Node.js and browsers”, author **Valzyy**, maintainer `valzyys`, MIT, v1.0.0 terbit 12 Mei 2025 | https://www.npmjs.com/package/@jkt48/core (metadata registry npm) |
| `@jkt48connect/cli`: CLI/modul API JKT48Connect, author **Valzyy**, terbit 3 Feb 2025 | https://www.npmjs.com/package/@jkt48connect/cli |
| README jkt48-core: “All these teams were founded by **Valzyy**, who created the entire ecosystem”; fitur member, event, theater, berita, live YouTube/IDN/Showroom, replay, chat stream | https://github.com/JKT48Connect/jkt48-core |
| JKT48Connect = platform data JKT48 (API, live, jadwal), proyek fan independen, tidak berafiliasi resmi | https://docs.jkt48connect.com/ (lewat hasil pencarian; domain tidak bisa diakses langsung dari sandbox) |
| Cavallery = fanbase satu member JKT48, berdiri 2024, situs `cavallery.id` (jadwal, show, status live, berita) | https://cavallery.id/ · https://cavallery.id/about/cavallery (lewat hasil pencarian) |
| FritzyForce = fanbase member generasi 12 | https://x.com/fritzyforce |
| Nayrakuen = fanbase member generasi 12 | https://www.instagram.com/nayrakuen_id/ |
| FritzyForce & Nayrakuen tercantum sebagai pengguna JKT48Connect | ringkasan hasil pencarian atas docs.jkt48connect.com — **belum dicek langsung** |

Yang **tidak** ketemu atau tidak bisa diverifikasi (karena itu tidak dikarang di situs):

- Pencarian “Valzyy developer” tidak menemukan profil publik lain.
- “Harukaze48” tidak muncul di hasil pencarian; deskripsinya diambil dari brief pemilik.
- Peran spesifik Valzyy di Cavallery, FritzyForce, dan Nayrakuen: ditulis “IT lintas divisi (peran spesifik belum
  terverifikasi)”.
- Tanggal Harukaze48, Payment V2, Partnership, Mobile, dan bot: ditulis “—”.
- Angka pengguna, trafik, atau unduhan: tidak ditampilkan sama sekali.

Semua detail teknis di studi kasus (HLS proxy + JWT EC P-256 + JTI di KV, payment QRIS dengan Hono + CockroachDB,
partnership bertier, bot X dengan asyncio lock, bot Telegram grammY/GramJS, dan seterusnya) berasal dari brief
pemilik, bukan dari sumber publik.

---

## [TODO]

- [ ] **[TODO] Email** — isi `contacts → email` di `content/site.ts`. Kandidat dari metadata npm: `jkt48connect@gmail.com` (maintainer `@jkt48/core`). Konfirmasi dulu sebelum dipublikasikan.
- [ ] **[TODO] Telegram** — isi `contacts → telegram` di `content/site.ts`.
- [ ] **[TODO] URL produksi** — `site.url` masih placeholder `https://valzyy-portfolio.example.workers.dev`. Ganti setelah deploy (dipakai `metadataBase`/OG).
- [ ] **[TODO] Peran di Cavallery, FritzyForce, Nayrakuen** — isi jabatan sebenarnya di `content/about.ts` dan `content/projects.ts` (Cavallery).
- [ ] **[TODO] Bukti publik** — link untuk Harukaze48, JKT48Connect Mobile (toko aplikasi), bot, dan halaman partner API (tandai `kind: "publik"`).
- [ ] **[TODO] Tahun rilis** — Harukaze48, Payment V2, Partnership, Mobile, bot.
- [ ] **[TODO] Level stack** — level `sering`/`pakai` dan kolom “eksplorasi” (GSAP, Lenis, OpenNext) adalah tebakan awal; sesuaikan.
- [ ] **[TODO] Gambar OG** — belum ada `opengraph-image`; tambahkan PNG/WebP statis di `app/` atau `public/` bila perlu.

---

## Proyek yang dikecualikan (bagian 0 brief)

Sesuai batasan privasi, proyek berikut **tidak** disebut, ditampilkan, ditautkan, atau dimasukkan ke riset di
situs ini:

- Avonera48
- Avonera
- Team48
- T48ID
- Semua proyek teater/tiket JKT48

---

## Keputusan default yang diambil

- **Arah visual direvisi** setelah feedback “terlalu pixel”: judul memakai sans tebal (Bricolage Grotesque) alih-alih
  font pixel, easing `steps()` diganti easing halus (kecuali efek mengetik di intro), border bersudut-terpotong jadi
  garis tipis, dither di menu dihapus. Unsur pixel/ASCII tetap ada di canvas hero, intro, signature footer, 404,
  ikon, dan aksen kecil (logo `VZY/`, badge).
- **Light mode** ditambahkan dengan palet terang sendiri (aksen lebih pekat supaya kontras ≥ 4.5:1). Default ikut
  sistem.
- Palet dibuat sendiri (ink/krem + penlight pink, mint, lemon, peach). Tidak memakai warna, logo, foto, atau aset
  resmi JKT48. Kartu profil memakai ilustrasi pixel “NO PHOTO”, bukan foto.
- Statistik di kartu profil **dihitung dari isi situs** (jumlah proyek, jumlah teknologi, 2 paket npm terverifikasi,
  3 platform bot), bukan angka karangan.
- JKT48Connect dipecah jadi beberapa studi kasus (Live, Payment, Partnership, Bots, `@jkt48/core`) supaya filter
  kategori bermakna. Proyek unggulan di beranda: JKT48Connect, Live, Harukaze48, Mobile.
- Kontak hanya menampilkan yang terverifikasi (GitHub `valzyys`, org `JKT48Connect`, npm). Email dan Telegram
  ditampilkan “[ belum diisi ]”. Nomor WhatsApp di README jkt48-core sengaja tidak dipakai.
- Navigasi: tombol melayang kanan-bawah (jangkauan jempol) + overlay HUD dengan indeks 01/05. Tidak ada navbar atas.
- Intro hanya sekali per sesi (`sessionStorage`), bisa di-skip. Overlay intro ikut dirender di server, lalu
  disembunyikan oleh script `<head>` kalau sudah pernah tampil, supaya tidak berkedip.
- Halaman `/contact` tanpa form karena tidak ada backend.
- Section proyek unggulan di-pin dan bergulir horizontal hanya di ≥1024px; di mobile/tablet berupa tumpukan vertikal.
- Peta Jawa di /about adalah ilustrasi prosedural, bukan peta akurat (sudah diberi label di halaman).

## Yang perlu diverifikasi sendiri

1. Semua item [TODO] di atas, terutama email, Telegram, dan peran di tiap fanbase.
2. Kebenaran detail teknis di `content/projects.ts`; semuanya dari brief dan tidak bisa dicek publik.
3. Apakah boleh menyebut nama fanbase (Cavallery, FritzyForce, Nayrakuen) di situs pribadi.
4. Tampilan di perangkat nyata (iOS Safari, Android Chrome), terutama canvas hero dan smooth scroll.
5. Nama worker `valzyy-portfolio` di `wrangler.jsonc` sebelum menghubungkan Workers Builds.
