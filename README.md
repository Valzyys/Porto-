# @jkt48/core — situs dokumentasi

Situs dokumentasi untuk paket npm [`@jkt48/core`](https://www.npmjs.com/package/@jkt48/core), client resmi
JKT48Connect API untuk Node.js dan browser, buatan Valzyy. Gaya visualnya di-slice dari
[nodecode.ai](https://nodecode.ai/) lewat skill `precision-ui-slicing`: kanvas abu hangat, garis 1px, label mono
uppercase, judul "lead, lanjutan abu" dengan koma biru, ilustrasi pixel, dan halaman docs tiga kolom. Strukturnya
mengikuti halaman nodecode (Home, Agent, Cells, Pricing, Docs), dipetakan ke isi paket ini. nodecode sendiri hampir
tanpa animasi, jadi di sini semua elemen diberi gerak GSAP.

Live: **https://valzyy-porto.netlify.app**

- **Stack:** Next.js 16.4.6 (App Router) · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger + Flip (`@gsap/react`) · Lenis
- **Deploy:** Cloudflare Workers + Static Assets (`@opennextjs/cloudflare`) dan Netlify (`@netlify/plugin-nextjs`)
- **Font (self-host via `next/font`, OFL):** Geist · Geist Mono · Silkscreen (wordmark & angka pixel)

| Halaman nodecode | Di situs ini | Isi |
| --- | --- | --- |
| Home | `/` | hero + bar pixel interaktif, kotak install (npm/pnpm/yarn/bun), dua panel ilustrasi, angka paket, grid modul, contoh kode |
| Agent | `/client` | tur client: demo terminal + inspektor request, diagram lapisan request (stepper), format build, riwayat rilis |
| Cells | `/modules` | hub 41 method: filter modul & jenis (GET/POST/PUT/DELETE/local), pencarian, urutan, animasi Flip |
| Pricing | `/access` | API key vs kredensial admin, matriks auth per request, FAQ |
| Docs | `/docs/*` | 19 halaman: overview, instalasi, quickstart, konfigurasi, priority token, error, React, browser (UMD), referensi 8 modul, tabel endpoint, versi, FAQ |

---

## Menjalankan lokal

```bash
npm install
npm run dev          # dev server Next.js → http://localhost:3000
npm run lint         # ESLint (eslint-config-next)
npm run typecheck    # tsc --noEmit
npm run build        # build OpenNext (menjalankan `next build` lalu bundling untuk Workers → .open-next/)
npm run build:next   # hanya `next build` (dipakai Netlify)
npm run preview      # build + preview di runtime Workers (workerd) → http://localhost:8787
```

Butuh Node.js ≥ 20.9.

### Screenshot

```bash
npm run preview                       # terminal 1
node scripts/screenshots.mjs          # terminal 2 (butuh paket `playwright` terpasang terpisah)
```

Hasilnya masuk ke `screenshots/` dengan pola `halaman-ukuran-state.png` (mobile 390px, desktop 1440px; terang,
`-dark`, plus pencarian terbuka, filter modul, menu mobile, toggle tema, dan empat frame transisi).

---

## Mengedit konten

Semua isi ada di `content/` (TypeScript). Komponen tidak perlu disentuh.

| File | Isi |
| --- | --- |
| `content/pkg.ts` | fakta paket: versi, lisensi, dependensi, base URL, ukuran, entry ESM/CJS/UMD, link, perintah install, **riwayat rilis** |
| `content/api.ts` | **sumber tunggal API**: 8 modul, 41 method (verb, path, apa yang dikirim, parameter, contoh, catatan, auth) |
| `content/docs.ts` | halaman docs sebagai daftar blok (`p`, `h2`, `code`, `callout`, `table`, `steps`, `api`, `endpoints`, …) |
| `content/site.ts` | URL situs, menu topbar, kolom footer |

- Halaman `/docs/api/[modul]`, tabel endpoint, hub `/modules`, indeks pencarian ⌘K, angka di beranda, dan daftar isi
  (TOC) semuanya dibaca dari `content/api.ts`. Tambah method di sana → muncul di semua tempat.
- Halaman docs baru: tambahkan objek ke `docs` di `content/docs.ts`; route statisnya dibuat otomatis
  (`generateStaticParams`, slug lain → 404).

### Design tokens

Warna (terang & gelap), font, spacing, radius, z-index, durasi, easing, dan budget canvas ada di
**`design/tokens.ts`**. Nilainya disuntik sebagai CSS variable di `<head>` dan dipetakan ke class Tailwind di
`app/globals.css` (`bg-canvas`, `bg-surface`, `text-ink`, `text-mute`, `border-line`, `bg-blue`, `text-orange`, …).
Biru dipakai untuk aksen/aktif, oranye khusus untuk hal yang butuh kredensial admin.

### Tema terang/gelap

- Default ikut setting sistem (`prefers-color-scheme`).
- Toggle matahari/bulan di topbar; pilihan disimpan di `localStorage` (`jkt48core:theme`, dengan try/catch) dan
  diterapkan sebelum paint supaya tidak berkedip. Ilustrasi canvas ikut berganti tema.

---

## Animasi (GSAP)

| Elemen | Gerak |
| --- | --- |
| Hero | bingkai digambar dari tepi, sudut pixel berkedip, judul `@jkt48/core` didekode dari karakter acak, koma biru meletup, lanjutan judul naik per kata, parallax saat di-scroll |
| Judul lain | kata demi kata naik dari balik masker saat masuk viewport |
| Bar pixel hero | canvas: kolom merakit dari kiri ke kanan, bergelombang, pita terang menyapu, paket data pixel naik dari puncak batang, riak saat klik/tap (dan otomatis), batang terangkat di sekitar kursor; 30 fps, berhenti saat offscreen |
| Marquee method | pita berjalan berisi 41 method; melambat saat hover, kecepatan/arah ikut scroll |
| Ilustrasi pixel | tiap pixel terbang dari posisi acak lalu merakit; pixel acak berkedip; ilustrasi bergeser mengikuti kursor |
| Kotak install | package manager berganti sendiri tiap 3,6 detik (berhenti setelah dipilih manual); perintah lama dihapus mundur lalu diketik ulang; pil aktif meluncur; tombol copy berubah jadi centang |
| Demo terminal | kode diketik baris demi baris, inspektor request terisi (verb, path, query, header) |
| Diagram lapisan | paket request/respons berjalan antar lapisan; stepper maju sendiri tiap 4,2 detik |
| Grafik rilis | kolom pixel per bulan tumbuh saat di-scroll |
| Hub modul | baris berpindah posisi dengan Flip saat filter/urutan berubah |
| Docs | TOC scroll-spy dengan bar penanda yang meluncur; tab kode crossfade; accordion FAQ dengan tinggi animasi |
| Footer | wordmark pixel raksasa `JKT48/CORE` (canvas, font bitmap 5×7 buatan sendiri): pixel jatuh lalu merakit, terdorong kursor dan kembali dengan pegas, meledak saat klik/tap, berkedip biru; sitemap `footer.json` muncul per baris dengan penanda hover yang meluncur; bar status ala editor (indikator ready, posisi scroll, saklar animasi, ke atas) |
| Angka | counter naik dari 0 |
| Navigasi | transisi tile grid antar halaman; drawer mobile dengan item bertahap; smooth scroll Lenis (anchor `#method` ikut di-scroll halus) |

Animasi selalu jalan secara default, **termasuk saat setting OS "reduce motion" aktif**. Di banyak desktop Windows
(Settings → Accessibility → Visual effects → Animation effects mati) setting itu menyala tanpa disadari dan membuat
situs terlihat mati. Sebagai gantinya ada tombol **Animasi on/off** di bar status footer: pilihan disimpan di `localStorage`
(`jkt48core:motion`), diterapkan oleh script `<head>` (`html[data-motion="off"]`), lalu halaman dimuat ulang. Saat
off, semua konten tetap tampil penuh tanpa gerak.

---

## Struktur

```
app/
  layout.tsx              font, token CSS, script head (tema + bersihkan komentar head), provider, topbar, footer
  template.tsx            dipanggil tiap pindah route → buka tirai tile
  page.tsx                beranda
  client/ modules/ access/
  docs/layout.tsx         sidebar docs
  docs/[[...slug]]/       semua halaman docs (SSG)
  not-found.tsx
components/
  art/                    PixelArt (SVG), PixelBars (canvas), LayerDiagram
  client/                 TerminalDemo, ReleaseChart, InstallBar
  docs/                   DocsSidebar, Toc, MethodCard, Blocks (renderer blok konten)
  modules/                ModuleBrowser (hub + Flip), warna verb
  site/                   TopBar, Footer (+ footer/: PixelWordmark, FooterManifest, StatusBar), SearchDialog (⌘K / Ctrl+K / "/")
  transition/             TransitionProvider (tile grid) + TransitionLink
  ui/                     Icon, CodeBlock, CopyButton, InstallBox, Headline, Accordion, ThemeToggle, Wordmark, Reveal, Counter
content/                  data (edit di sini)
design/tokens.ts          design tokens
lib/                      gsap, highlight (syntax highlighter kecil), md (markdown inline), pixel (generator ilustrasi), stores, head script
scripts/screenshots.mjs   ambil screenshot via Playwright
.claude/skills/           skill Claude Code `precision-ui-slicing`
```

---

## Deploy lewat dashboard Cloudflare (Workers Builds)

1. Buka **Cloudflare Dashboard → Workers & Pages → Create → Workers → Import a repository**, pilih repo ini.
2. Konfigurasi build:
   - **Project name:** `porto` — wajib sama dengan `name` di `wrangler.jsonc`.
   - **Build command:** `npm run build` (menjalankan `opennextjs-cloudflare build`). Jangan pakai `next build`
     saja, karena deploy akan gagal dengan `Could not find compiled Open Next config`.
   - **Deploy command:** `npx wrangler deploy`
   - **Root directory:** `/`
3. Tidak ada secret yang perlu diisi; situs tidak membaca `process.env`.
4. Domain custom: **Settings → Domains & Routes**, lalu perbarui `site.url` di `content/site.ts`.

Catatan kompatibilitas: `nodejs_compat`, semua halaman SSG, cache incremental dari Static Assets (tanpa R2/KV/D1),
`images.unoptimized`, `cacheComponents` sengaja mati.

## Deploy ke Netlify

Live di **https://valzyy-porto.netlify.app** (project `valzyy-porto`).

- `netlify.toml` memakai `npm run build:next`, publish `.next`, dan mendeklarasikan `@netlify/plugin-nextjs`
  (tanpa itu deploy lewat upload/API hanya mem-publish folder mentah dan semua halaman 404).
- Netlify menyisipkan komentar HTML ke `<head>`; script di `lib/head.ts` menghapusnya sebelum hydration supaya React
  tidak gagal hydrate (#418).

---

## Hasil build & verifikasi (terakhir dijalankan)

| Cek | Hasil |
| --- | --- |
| `npm run lint` · `tsc --noEmit` | lolos, 0 error |
| `npm run build` (OpenNext → Next 16.4.6) | sukses; `/`, `/client`, `/modules`, `/access`, 19 halaman `/docs/*` (SSG), 404 |
| Ukuran worker (`wrangler deploy --dry-run`) | 5 535 KiB mentah / 1 185 KiB gzip |
| Preview Workers | semua route → 200; slug docs acak & URL acak → 404 bertema |
| Error JS (Playwright, 10 halaman, 2 ukuran, 2 tema) | tidak ada (selain 404 yang memang disengaja) |
| Overflow horizontal di 360 / 390 / 768 / 1024 / 1280 / 1920 px | tidak ada |
| Interaksi | pencarian ⌘K / "/" dengan navigasi panah; filter modul + Flip; menu mobile; toggle tema bertahan setelah reload; transisi tile berakhir di URL tujuan |

---

## Sumber riset

Semua fakta paket diambil dari tarball resmi `@jkt48/core@7.7.7` (kode `HttpClient` dan tiap service) serta
metadata registry npm. Tidak ada angka unduhan, testimoni, atau klaim yang dikarang.

| Fakta | Sumber |
| --- | --- |
| Deskripsi, author Valzyy, MIT, dependensi `axios ^1.6.0`, 6 file / 79.8 kB, entry ESM/CJS/UMD, tidak membawa `.d.ts` | https://www.npmjs.com/package/@jkt48/core · `npm view @jkt48/core` · `npm pack @jkt48/core@7.7.7` |
| Daftar 41 method, path endpoint, parameter yang di-encode, cara auth (query `apikey`, `priority_token`, header `x-priority-token`, query `username`/`password` admin), base URL `https://v2.jkt48connect.com/api` | isi tarball 7.7.7 |
| Riwayat 29 versi + tanggal; 1.0.3 dan 1.0.10 tercatat tapi tidak tersedia | `npm view @jkt48/core time` |
| Skema respons per endpoint | tidak didokumentasikan di paket → situs merujuk ke https://docs.jkt48connect.com |

Catatan penting yang ditampilkan di docs:

- Paket tidak membawa definisi TypeScript; contoh `declare module` disediakan di halaman docs.
- Kredensial admin dikirim sebagai query string dan ikut ditempel ke request non-admin selama terpasang, jadi
  dianjurkan instance terpisah di server.
- Respons dikembalikan apa adanya (`response.data`); error dibungkus jadi `API Error (status): message`.

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

- Situs portofolio sebelumnya diganti total menjadi situs docs; halaman lama (`/about`, `/projects`, `/stack`,
  `/contact`) dihapus.
- Ilustrasi pixel dibuat prosedural dan orisinal (kubus, menara, hexagon, kunci, segitiga peringatan) — tidak
  menyalin aset nodecode. Tidak memakai logo, foto, atau aset resmi JKT48.
- Demo terminal di `/client` diberi label "demo · bukan respons asli" karena tidak memanggil API sungguhan.
- Footer menyebut "tidak berafiliasi resmi dengan JKT48".
- Pencarian dan syntax highlighting dibuat sendiri (tanpa dependensi tambahan).

## Yang perlu diverifikasi sendiri

1. Kebenaran contoh kode untuk method yang butuh body (admin & changelog) terhadap API live.
2. Apakah `site.url` (`content/site.ts`) perlu diganti setelah domain custom dipasang.
3. Tampilan di perangkat nyata (iOS Safari, Android Chrome), terutama canvas hero dan smooth scroll.
4. Nama worker `porto` di `wrangler.jsonc` harus sama dengan nama Worker di dashboard.
