Buatkan website portofolio untuk Valzyy dari nol. Kerjakan langsung sampai build berhasil, dan kirim semua file lengkap (bukan potongan atau diff). Kalau ada keputusan yang ambigu, ambil default yang masuk akal lalu catat di README, jangan berhenti untuk bertanya.

=== 0. BATASAN PRIVASI (wajib) ===
Proyek berikut TIDAK BOLEH disebut, ditampilkan, ditautkan, atau dimasukkan ke riset dalam bentuk apa pun: Avonera48, Avonera, Team48, T48ID, dan semua proyek teater/tiket JKT48. Jika hasil pencarian menemukannya, abaikan. Jangan tulis nama-nama ini di README kecuali di daftar "dikecualikan".

=== 1. RISET DATA (lakukan dulu, sebelum desain) ===
Gunakan WebSearch untuk memverifikasi dan melengkapi data tentang Valzyy. Cari minimal: "Valzyy developer", "Valzyy JKT48Connect", "JKT48Connect", dan nama proyek-proyeknya. Simpan hasilnya di README beserta sumbernya. Jika ada informasi yang bertentangan atau tidak bisa diverifikasi, jangan dimasukkan ke website. Jangan mengarang pengalaman, angka, testimoni, atau link.

Fakta yang sudah diketahui (anggap benar, kecuali hasil riset bertentangan):
- Nama panggilan: Valzyy
- Independent full-stack developer, Indonesia. Berasal dari Jawa Tengah (Semarang).
- Founder JKT48Connect, ekosistem fan-built untuk grup JKT48. Didirikan pertengahan 2024 sebagai solo developer.
- Bekerja lintas divisi IT di Cavallery, Fritzyforce, dan Nayrakuen (peran spesifik di tiap tempat: verifikasi, jika tidak ketemu tulis apa adanya tanpa mengarang jabatan).
- Stack utama: Cloudflare Workers (Hono), Next.js, React Native/Expo, CockroachDB via Hyperdrive, Cloudflare KV/R2/D1, Supabase, Node.js/Express, Python (bot Twitter/X dengan twikit), grammY/GramJS (Telegram bots).

Proyek yang bisa ditampilkan (deskripsi harus spesifik, ambil dari fakta berikut):
- JKT48Connect: ekosistem. Mencakup live streaming (agregasi /live dari IDN Live dan Showroom, HLS proxy di Cloudflare Workers dengan EC P-256 JWT, JTI KV replay prevention), PM API (REST di Cloudflare Workers, KV), payment gateway V2 (QRIS, Hono + CockroachDB, withdrawal dan admin flow), partnership system (tier, invoice langganan, akses per show), notifikasi sosial (bot Twitter/X dengan asyncio lock, bot WhatsApp), dan bot Telegram (channel creation, PM forwarding, PM Shop).
- Harukaze48: platform streaming fan, React frontend + Hono backend, kontrol akses berbasis email.
- Cavallery (cavallery.id): fan site untuk member JKT48 (Next.js + CMS, Cloudflare Workers/Pages).
- JKT48Connect Mobile: aplikasi React Native / Expo (@jkt48/core).

Untuk tiap proyek, tampilkan: nama, peran Valzyy, stack, tantangan teknis, dan hasil yang bisa diverifikasi. Hindari angka yang tidak terverifikasi.

=== 2. ARAH DESAIN ===
Tema: pixel, ASCII, idolish JKT48, dan rich animation. Terinspirasi, jangan meniru:
- JANGAN memakai logo, font, warna resmi, foto, atau aset apa pun dari JKT48 atau membernya. Buat palet dan bentuk sendiri yang terinspirasi panggung idol: spotlight, lightstick/penlight, konfeti pixel, warna pastel yang dibuat lebih tegas.
- Pixel: pixel font untuk display (pakai font open-source seperti Press Start 2P, Silkscreen, atau Pixelify Sans), border pixel, ikon pixel yang digambar sendiri sebagai SVG (grid kecil), dithering untuk background tertentu.
- ASCII: hero atau background berupa ASCII art yang bereaksi ke mouse atau scroll (canvas atau DOM, dibatasi performanya), divider ASCII, teks yang di-scramble ke karakter ASCII lalu terbentuk nama.
- Idolish: satu komponen "profile card" bergaya kartu member (nama, peran, "stats" yang berasal dari data verified, bukan angka palsu), spotlight yang mengikuti cursor, marquee bergaya banner panggung.

=== 2b. HERO, NAVIGASI, DAN FOOTER (wajib, harus beda dari website pasaran) ===
- HERO: harus benar-benar memorable, bukan layout "nama besar + tombol". Kerjakan minimal satu dari ini dengan kualitas tinggi: ASCII/pixel scene yang bereaksi ke cursor dan scroll, nama yang terbentuk dari partikel pixel, atau panggung idol pixel dengan spotlight yang bergerak. Hero harus punya komposisi asimetris, hirarki tipografi yang kuat, dan detail mikro (koordinat, status "online", counter frame). Di mobile, hero tetap utuh dan tidak terpotong.
- NAVIGASI: jangan pakai navbar atas standar. Pilih salah satu pendekatan yang unik dan konsisten dengan tema, misalnya menu overlay bergaya HUD pixel dengan indeks halaman (01/05), atau dock/tombol melayang di bawah yang berisi ikon pixel buatan sendiri. Saat menu dibuka, ada animasi per item. Di mobile, tombol menu berada di area jangkauan jempol.
- FOOTER: jangan footer 4 kolom link. Buat footer sebagai bagian penutup yang berkesan, misalnya marquee pixel, ASCII signature, atau "credit roll" bergaya kredit film idol. Isinya tetap fakta (nama, lokasi, kontak, tahun), bukan klise.
- Semua hero, navigasi, dan footer harus lolos cek: "apakah ini terlihat seperti template default?" Jika ya, ulangi desainnya.

=== 3. ANIMASI (wajib, ini inti tugasnya) ===
- Pakai GSAP + ScrollTrigger (@gsap/react untuk cleanup). Tambahkan Lenis untuk smooth scroll. Kill semua timeline dan trigger saat unmount.
- Scroll: reveal stagger, pinned section untuk cerita proyek, parallax ringan, progress bar scroll, counter yang hanya jalan saat masuk viewport.
- Hover dan micro-interaction: magnetic button, text scramble, cursor custom (opsional, mati di touch device).
- INTRO (wajib): loader saat pertama buka. Boot sequence ASCII ~2–3 detik, progress bar pixel, lalu tirai pixel membuka hero. Bisa di-skip dengan klik atau tombol, dan hanya tampil sekali per sesi (sessionStorage dengan try/catch).
- PAGE TRANSITION (wajib): setiap pindah halaman ada transisi, misalnya grid tile pixel yang menutup lalu membuka. Pakai template.tsx di App Router agar animasi berjalan setiap route change. Pastikan tetap berjalan saat navigasi cepat (kill tween yang sedang berjalan).
- Hormati prefers-reduced-motion: matikan animasi berat, pertahankan fade sederhana.

=== 4. RESPONSIF (wajib) ===
- Mobile-first. Uji logika layout pada 360px, 390px, 768px, 1024px, 1280px, dan 1920px.
- Tidak ada fungsi yang hanya bisa lewat hover. Navigasi mobile harus nyaman dipakai dengan jempol.
- ASCII dan canvas dikurangi kompleksitasnya di mobile. Tidak boleh ada horizontal scroll yang tidak disengaja.

=== 5. ANTI "AI SLOP" (wajib dipatuhi) ===
- Jangan pakai gradient ungu-biru, glassmorphism di setiap kartu, emoji sebagai ikon, font default Inter/Roboto/system-ui sebagai font utama, atau grid 3 kolom "fitur" dengan ikon generik.
- Jangan ada copy klise seperti "Welcome to my portfolio", "Passionate developer", "Transforming ideas into reality", atau lorem ipsum.
- Jangan ada testimoni palsu, statistik palsu, atau sparkle acak.
- Setiap section harus punya komposisi yang berbeda. Typography harus disengaja: pixel display + monospace untuk body (misal JetBrains Mono atau IBM Plex Mono).
- Copy: bahasa Indonesia santai, boleh campur Inggris, spesifik, tidak lebay.
- Definisikan design tokens (warna, spacing, font, durasi animasi, easing) di satu file. Jangan hardcode nilai di komponen.

=== 6. STRUKTUR HALAMAN ===
- / : intro, hero ASCII dengan nama, ringkasan singkat siapa Valzyy, proyek unggulan (3–4), marquee stack, CTA ke kontak.
- /about : bio, timeline (tempat kerja dan proyek utama), lokasi (Jawa Tengah), prinsip kerja yang berasal dari fakta, bukan klaim kosong.
- /projects : grid dengan filter (Web, Mobile, Bot, Infra), dan /projects/[slug] dengan detail: problem, solusi, stack, dan peran.
- /stack : daftar teknologi yang dikelompokkan dan ditampilkan dengan level yang jujur (pakai, sering dipakai, eksplorasi). Hindari bar persentase palsu.
- /contact : link GitHub, email, dan Telegram. Jika datanya belum ada, pakai placeholder yang jelas dan tandai [TODO] di README. Tidak perlu form jika tidak ada backend.
- 404 page bertema pixel/ASCII.
- Semua konten disimpan di folder content/ atau data/ (TypeScript) agar mudah diedit tanpa menyentuh komponen.

=== 7. TEKNIS ===
- Next.js (App Router) + TypeScript + Tailwind CSS. GSAP + ScrollTrigger, Lenis.
- Aksesibilitas: semantik HTML, kontras cukup, fokus keyboard terlihat, alt text, label untuk ikon.
- Performa: font di-preload, gambar WebP/AVIF, canvas di-lazy-load, tidak ada library animasi tambahan yang tidak perlu.
- Target deploy: Cloudflare Workers (dengan Static Assets) memakai adapter resmi @opennextjs/cloudflare. Pages dengan Next.js sudah tidak direkomendasikan, jadi jangan pakai jalur itu.
- Kompatibilitas Workers wajib, bukan opsional:
  - Semua route harus bisa jalan di runtime Workers. Jangan pakai API Node yang tidak didukung (fs, child_process, native addon). Kalau butuh flag, pakai nodejs_compat dan compatibility_date terbaru.
  - Halaman konten (/projects/[slug], dsb.) sebaiknya statis lewat generateStaticParams agar tidak ada beban runtime.
  - Gambar: pakai file statis di public/ atau next/image dengan unoptimized: true. Jangan bergantung pada image optimization bawaan Next.js karena tidak berjalan di Workers.
  - Font: self-host atau pakai next/font. Jangan fetch font saat runtime.
  - Environment variable tidak boleh dibaca dari process.env saat build untuk data sensitif. Website ini seharusnya tidak punya secret sama sekali. Jika ada kebutuhan, pakai binding Cloudflare.
  - Ukuran bundle worker harus di bawah batas free plan (3 MiB terkompresi). Hindari library berat. Ukur ukuran hasil build dan laporkan.
- Sesuai preferensi, deploy lewat dashboard Cloudflare (Workers Builds yang terhubung ke GitHub), dan tulis langkahnya di README. Wrangler CLI hanya dipakai untuk preview lokal (misalnya opennextjs-cloudflare preview) dan file konfigurasi wrangler.jsonc tetap dibuat karena dibutuhkan adapter.
- Sebelum melapor selesai, jalankan build OpenNext dan preview lokal di Workers runtime. Pastikan halaman utama, navigasi, transisi, dan 404 tampil tanpa error di preview tersebut. Laporkan hasilnya di bagian akhir.

=== 8. OUTPUT YANG DIHARAPKAN ===
1. Semua file project yang lengkap dan siap jalan (package.json, config, komponen, halaman, content, styles, README).
1b. SCREENSHOT UI (wajib): ambil screenshot setiap halaman utama dan setiap state penting UI, lalu simpan di folder screenshots/. Minimal:
   - halaman /, /about, /projects, /projects/[salah satu slug], /stack, /contact, dan 404
   - tampilan mobile (390px) dan desktop (1440px) untuk tiap halaman
   - intro/loader, menu navigasi terbuka, dan frame transisi halaman saat berjalan
   - footer dan hero di kedua ukuran
   Gunakan Playwright atau alat headless browser yang tersedia. Beri nama file dengan pola: halaman-ukuran-state.png (contoh: home-mobile-hero.png).
   Setelah screenshot selesai, kirim setiap file gambar ke saya lewat SendUserFile agar bisa saya preview langsung. Kirim sebagai status normal, dan jelaskan singkat di caption apa yang ditampilkan tiap gambar.
   Jika sebuah state tidak bisa di-screenshot (misalnya transisi yang sangat cepat), rekam sebagai GIF atau sebutkan di laporan akhir.
2. README berisi: cara menjalankan lokal, cara mengedit konten, daftar sumber riset, daftar [TODO], daftar proyek yang dikecualikan sesuai bagian 0, dan langkah deploy lewat dashboard Cloudflare.
3. Jalankan build dan lint. Perbaiki error sampai build berhasil. Laporkan hasilnya singkat.
4. Di akhir, sebutkan keputusan default yang kamu ambil dan hal yang perlu saya verifikasi sendiri.
