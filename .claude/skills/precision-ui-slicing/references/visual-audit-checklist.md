# Checklist Audit Visual & Kode

Sebelum menyatakan slicing selesai, pastikan seluruh poin berikut terpenuhi:

- [ ] **Hierarki Visual:** Elemen paling penting di desain referensi langsung menarik perhatian pertama kali di hasil render.
- [ ] **Keseimbangan Whitespace:** Padding di dalam kartu simetris dan konsisten di seluruh bagian halaman.
- [ ] **Alignment:** Teks, ikon, dan input sejajar pada garis *baseline* atau *center* yang tepat (`items-center` / `items-baseline`).
- [ ] **Kontras Warna:** Teks sekunder tetap terbaca jelas di atas latar belakangnya (minimal rasio kontras WCAG AA).
- [ ] **Keutuhan Asset:** Tidak ada gambar pecah (`broken image`), ikon terlalu besar/kecil, atau SVG terpotong.
- [ ] **Responsivitas:** Pada lebar `375px`, tidak ada elemen yang keluar dari layar (*overflow-x*) dan grid multi-kolom otomatis turun menjadi 1 kolom dengan rapi.
- [ ] **Kebersihan Kode:** Tidak ada *unused imports*, `console.log`, atau komentar sampah.
