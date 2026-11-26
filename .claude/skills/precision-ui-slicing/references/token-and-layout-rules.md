# Aturan Token, Layout, & Anti-Generic UI

## 1. Disiplin Design Token
- **Dilarang menggunakan nilai arbitrary** seperti `w-[347px]`, `text-[#3b82f6]`, atau `mt-[13px]` kecuali benar-benar wajib secara geometris dan tidak ada padanannya di skala proyek.
- Gunakan warna semantik proyek (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`) dibanding warna mentah (`bg-gray-100`, `text-slate-500`) jika proyek memakai sistem tema.

## 2. Presisi Tipografi & Angka
- **Heading:** Gunakan *tight tracking* (`tracking-tight`) untuk judul besar (`>= 20px`) agar terlihat tajam dan modern.
- **Label & Badge:** Gunakan ukuran kecil (`text-xs` / `12px`) dengan *font-weight* `medium` (`500`) atau `semibold` (`600`).
- **Data Numerik:** Wajib tambahkan kelas `tabular-nums` pada angka statistik, harga, persentase, dan tabel agar kolom angka sejajar vertikal.
- **Proteksi Teks Panjang:** Setiap teks dinamis di dalam card/sidebar wajib diberi `truncate` atau `line-clamp-2` beserta `min-w-0` pada parent flex container agar layout tidak jebol.

## 3. Kedalaman Visual (Depth & Borders)
- Hindari penggunaan `shadow-xl` berlebihan pada kartu standar. Utamakan kombinasi permukaan yang kontras tipis + `border` (`1px`) + `shadow-xs` atau `shadow-sm`.
- Pastikan konsistensi *border-radius* antar elemen bersarang (komponen di dalam kartu memiliki radius lebih kecil dari kartu pembungkusnya: `radius_dalam = radius_luar - padding`).

## 4. Interaktivitas & Aksesibilitas
- Semua elemen yang bisa diklik wajib memiliki `cursor-pointer` (jika bukan elemen `<button>`/`<a>` native) dan transisi halus (`transition-colors duration-150`).
- Wajib sertakan atribut `aria-label` pada tombol yang hanya berisi ikon (*icon-only button*).
