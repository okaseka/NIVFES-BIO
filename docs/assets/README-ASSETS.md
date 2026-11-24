# Panduan & Dokumentasi Sistem Aset SVG Virtual Lab (NIVFES BIO)

Proyek ini telah dilengkapi dengan **56 aset visual vektor SVG mandiri** yang dirancang khusus dengan gaya **"Virtual Lab Side-View"** (tampak samping datar sejajar di atas meja laboratorium):
- **Gaya Seragam**: Vektor flat tampak samping dengan highlight kaca transparan, refleksi logam, garis outline tipis, serta alas rata menempel di meja.
- **Indikator Reaktif**: Dilengkapi display digital LED/LCD, timer jarum berputar, nyala api bunsen, dan perubahan level cairan dinamis.
- **Tidak Memerlukan Pencarian Gambar**: Seluruh 56 objek telah digambar dan tersedia di `src/assets/svg/` dan `static/assets/svg/`, serta dapat diakses melalui browser.

---

## 🎨 Halaman Katalog Objek SVG

Anda dapat melihat, menginspeksi, dan menilai seluruh objek yang telah digambar melalui rute web:
👉 **`http://localhost:8080/katalog-objek`**

Halaman katalog menampilkan:
1. Preview vektor SVG tampak samping di atas panggung meja datar.
2. Nama objek, identifier teknis, dan dimensi proporsionalnya.
3. Filter per simulator (Umum, A. Kultur Jaringan, B. Bayi Tabung, C. Kloning, D. Hibridoma, E. DNA Rekombinan).
4. Tautan langsung untuk membuka dan mengunduh berkas `.svg` mandiri.

---

## 📁 Struktur Berkas SVG

Semua berkas SVG tersimpan dalam struktur folder berikut:
```text
src/assets/svg/
static/assets/svg/
├── umum/
│   ├── tabung-erlenmeyer.svg, tabung-reaksi.svg, cawan-petri.svg, mikroskop.svg
│   └── pipet.svg, suntikan.svg, timbangan.svg, bunsen.svg
├── a-kultur-jaringan/
│   ├── wortel.svg, pisau.svg, laminar-flow.svg, tabung-media.svg, eksplan.svg
│   └── kalus.svg, planlet.svg, pot-tanaman.svg, tumbuhan-dewasa.svg, rak-inkubasi.svg
├── b-bayi-tabung/
│   ├── ovarium.svg, suntikan-hormon.svg, tabung-sperma.svg, cawan-petri.svg, ovum.svg
│   └── sperma.svg, zigot.svg, blastula.svg, inkubator.svg, rahim.svg
├── c-kloning/
│   ├── domba-finndorset.svg, sel-kelenjar-susu.svg, domba-blackface.svg, ovum-blackface.svg
│   └── mikropipet.svg, cawan-kultur.svg, alat-stimulasi.svg, blastosit.svg, domba-dolly.svg
├── d-hibridoma/
│   ├── tikus.svg, suntikan-antigen.svg, tabung-limfosit-b.svg, tabung-sel-kanker.svg
│   └── tabung-fusi.svg, sel-hibridoma.svg, rak-kultur.svg, tabung-antibodi.svg, antibodi.svg
└── e-dna-rekombinan/
    ├── sel-manusia.svg, dna.svg, gen-insulin.svg, enzim-gunting.svg, sel-bakteri.svg
    └── plasmid.svg, enzim-ligase.svg, plasmid-rekombinan.svg, media-antibiotik.svg, fermentor.svg
```

---

## ⚙️ Kustomisasi Melalui Manifest (`src/assets.config.js`)

Jika sewaktu-waktu Anda ingin mengganti salah satu objek dengan gambar eksternal milik Anda sendiri (misalnya foto transparan `.png` atau `.webp`):
1. Masukkan file gambar Anda ke folder `static/assets/images/[kategori]/[nama-file].png`.
2. Buka `src/assets.config.js` (dan salinannya di `static/js/assets.config.js`).
3. Ubah objek target dari `type: "svg"` menjadi `type: "image"` dan sertakan `imagePath`:
   ```javascript
   'wortel': { 
       id: 'wortel', 
       name: 'Wortel Segar', 
       category: 'a-kultur-jaringan', 
       type: 'image', 
       imagePath: '/static/assets/images/a-kultur-jaringan/wortel.png',
       width: 85, 
       height: 100 
   }
   ```
4. Simulator otomatis membaca gambar baru tanpa perlu mengubah kode komponen simulator lainnya!

---

## ⚡ Cara Menjalankan Project

1. Pastikan Golang terpasang di komputer Anda.
2. Jalankan perintah di root direktori project:
   ```bash
   go run main.go
   ```
3. Buka browser:
   - Beranda Praktikum: `http://localhost:8080/`
   - Katalog Seluruh Objek SVG: `http://localhost:8080/katalog-objek`
