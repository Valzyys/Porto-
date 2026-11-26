---
name: precision-ui-slicing
description: Melakukan slicing desain UI (screenshot, Figma node, atau wireframe) menjadi kode komponen frontend berpresisi tinggi, modular, responsif, dan terverifikasi secara visual.
argument-hint: [path-gambar | url-figma | deskripsi-komponen]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Precision UI Slicing Engine

Target slicing saat ini: **`$ARGUMENTS`**

Eksekusi proses slicing ini secara berurutan. **Jangan langsung menulis kode sebelum Fase 1 dan Fase 2 selesai.**

---

## Fase 1: Reconnaissance Proyek (Wajib)
Sebelum membuat satu baris kode pun, pindai struktur proyek untuk memahami konvensi yang berlaku:
1. **Deteksi Stack & Styling:** Periksa `package.json`, `tailwind.config.*`, `globals.css` / `app.css`, dan `components.json` (jika memakai shadcn/ui).
2. **Inventarisasi Token:** Catat variabel warna (`--primary`, `--muted`, dll.), skala *border-radius*, *font-family*, dan *custom utility* yang sudah ada.
3. **Cek Komponen Eksisting:** Cari komponen UI dasar di folder `components/ui` atau sejenisnya agar tidak membuat ulang komponen yang sudah tersedia (misal: `Button`, `Badge`, `Card`, `Dialog`).
4. **Cek Library Ikon & Aset:** Pastikan library ikon yang terpasang (`lucide-react`, `heroicons`, `phosphor`, dll.) dan gunakan ikon yang paling mendekati referensi desain.

---

## Fase 2: Bedah Anatomi Desain (Visual Deconstruction)
Analisis referensi dari `$ARGUMENTS` secara sistematis dan tuliskan rencana singkatnya sebelum coding:
1. **Pohon Layout (Layout Tree):** Identifikasi struktur makro (Sidebar, Topbar, Main Canvas, Grid Container) hingga mikro (Card Header, Meta Row, Action Group).
2. **Sistem Grid & Alignment:** Tentukan di mana harus menggunakan `CSS Grid` (untuk tata letak 2 dimensi/kolom simetris) dan di mana menggunakan `Flexbox` (untuk alur 1 dimensi dan *alignment* item).
3. **Ekstraksi Token & Properti Visual:**
   - **Tipografi:** Petakan setiap teks ke pasangan ukuran, *font-weight*, *line-height*, dan *tracking* (`letter-spacing`). Angka/data tabular wajib memakai `tabular-nums`.
   - **Surface & Kedalaman:** Bedakan warna *background* halaman, *surface* kartu, *border* halus (`1px`), dan *shadow* berlapis.
   - **Spacing:** Konversi seluruh jarak visual ke skala grid kelipatan `4px` (`gap-1`, `gap-2`, `p-4`, `p-6`, dst.).
4. **Pemetaan State & Edge Cases:** Rencanakan tampilan untuk state `default`, `hover`, `focus-visible`, `active`, `loading` (skeleton), `empty`, serta teks yang terlalu panjang (`truncate` atau `line-clamp`).

---

## Fase 3: Implementasi Modular (Clean Slicing)
Baca panduan detail di `references/token-and-layout-rules.md` sebelum mulai menulis file:
1. **Pemisahan Data & UI:** Simpan seluruh teks dummy, list item, atau data grafik ke dalam file terpisah (`mock-data.ts` atau konstanta terstruktur dengan tipe TypeScript yang ketat).
2. **Komposisi Komponen Kecil:** Pecah komponen yang lebih dari ~120 baris menjadi sub-komponen semantik yang mudah dibaca.
3. **Aset & Placeholder:** Jika desain memiliki gambar/avatar, gunakan placeholder bersih atau SVG kustom yang proporsional dengan *aspect-ratio* terkunci (`aspect-video`, `aspect-square`) agar tidak terjadi *layout shift*.
4. **Responsivitas Mobile-First:** Bangun dari layar kecil (`375px`) lalu perluas ke `md` (`768px`) dan `lg`/`xl` (`1280px+`). Pastikan tidak ada *horizontal scroll* yang tidak disengaja.

---

## Fase 4: Self-Audit & Verifikasi Visual
Setelah kode selesai ditulis, lakukan verifikasi berdasarkan `references/visual-audit-checklist.md`:
1. **Validasi Build/Type:** Jalankan pengecekan tipe atau linter (`npm run typecheck` / `npx tsc --noEmit` jika tersedia) untuk memastikan nol error.
2. **Inspeksi Visual (Jika Playwright/Browser CLI tersedia):**
   - Jalankan dev server lokal, buka halaman hasil slicing pada viewport desktop (`1440x900`) dan mobile (`390x844`).
   - Ambil screenshot hasil render dan bandingkan langsung dengan gambar referensi `$ARGUMENTS`.
   - Jika ditemukan selisih proporsi, *alignment* meleset, kontras kurang, atau elemen bertumpuk, **perbaiki segera** sebelum melaporkan hasil akhir.
3. **Ringkasan Output:** Laporkan daftar file yang dibuat/diubah, komponen yang dipakai ulang, serta catatan jika ada aset/interaksi yang perlu disambungkan ke backend.
