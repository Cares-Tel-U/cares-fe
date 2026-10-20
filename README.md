# CARES Frontend Client

Antarmuka web modern untuk Sistem Pelaporan Kerusakan Fasilitas Kampus **CARES (Campus Facility Damage Reporting System)** Telkom University.

Aplikasi klien ini dibangun menggunakan arsitektur modular berbasis **React 19**, **Vite**, dan sistem desain terpadu dengan standar aksesibilitas dan responsivitas lintas perangkat.

---

## Daftar Isi
1. [Fitur Utama Sistem](#fitur-utama-sistem)
2. [Teknologi dan Dependensi](#teknologi-dan-dependensi)
3. [Struktur Direktori Proyek](#struktur-direktori-proyek)
4. [Kredensial Akun Siap Uji](#kredensial-akun-siap-uji)
5. [Panduan Instalasi dan Menjalankan](#panduan-instalasi-dan-menjalankan)
6. [Pengujian Otomatis (Playwright E2E)](#pengujian-otomatis-playwright-e2e)
7. [Panduan Build dan Persiapan Deployment](#panduan-build-dan-persiapan-deployment)

---

## Fitur Utama Sistem

### 1. Portal Pelapor (Mahasiswa & Civitas Akademika)
- **Otentikasi Akun**: Registrasi akun terverifikasi domain kampus, Login berbasis JWT, dan Lupa/Reset Password.
- **Formulir Pelaporan Cerdas**:
  - Pilihan Jenis Lokasi dinamis antara **Dalam Gedung** (Nama Gedung dan Nama Ruangan) serta **Area Luar** (Kategori Area dan Lokasi Spesifik).
  - *Searchable Autocomplete* dengan integrasi data lanskap resmi Telkom University dan dukungan input kustom.
  - Multi-upload bukti foto kerusakan (maksimal 3 foto, validasi format gambar dan ukuran maksimal 5 MB).
  - Mode **Laporkan Secara Anonim** untuk melindungi privasi identitas pelapor.
  - Aturan bisnis pencegahan laporan duplikat pada sarana yang sedang aktif ditangani.
  - Pembatasan kuota maksimal 3 laporan harian (1x24 jam) per pengguna.
- **Dashboard & Riwayat Laporan**:
  - Rekapitulasi metrik numerik statistik pelaporan pengguna.
  - Tabel riwayat dengan pencarian instan dan penyaringan multi-status.
  - Modal detail laporan dengan visualisasi *stepper timeline* progres penanganan.
- **Pusat Notifikasi & Bantuan**:
  - Notifikasi *in-app* pembaruan status laporan secara berkala.
  - Pengaturan preferensi notifikasi dengan *toggle auto-save* pada overlay profil.
  - Panduan onboarding interaktif (*GuideModal*) dan Pusat Bantuan FAQ interaktif.

### 2. Portal Admin & Sarana Prasarana (SARPRAS)
- **Dashboard Operasional**:
  - Pemantauan metrik antrean tiket (Menunggu Verifikasi, Diproses, Selesai, Ditolak).
  - Kartu visualisasi statistik sebaran lokasi kerusakan per gedung dan area.
- **Manajemen Antrean Tiket**:
  - Tabel interaktif dengan penyaringan status dan pengurutan kronologis.
  - Verifikasi tiket tunggal maupun massal (*bulk selection*).
  - Penolakan laporan dengan kewajiban menyertakan alasan penolakan.
  - Tindak lanjut dan penyelesaian laporan dengan kewajiban mengunggah foto bukti hasil perbaikan.
- **Data Statistik & Visualisasi Analitik**:
  - Grafik tren pelaporan mingguan dan bulanan.
  - Diagram donat distribusi status laporan.
  - Diagram area sebaran lokasi sarana yang mengalami kendala.
  - Diagram batang jam sibuk pelaporan (*hourly activity chart*).
- **Panduan Operasional Admin**:
  - Modal panduan interaktif tahapan verifikasi dan penyelesaian tiket (*AdminGuideModal*).
  - FAQ operasional khusus admin sarpras.

---

## Teknologi dan Dependensi

- **Core Engine**: React 19, React DOM 19
- **Build Tool**: Vite
- **Routing**: React Router DOM (v7)
- **Styling**: Vanilla CSS terstruktur dengan integrasi utility Tailwind CSS v4
- **Komponen Ikon**: Lucide React
- **Visualisasi Data**: Chart.js & React-Chartjs-2
- **Testing Framework**: Playwright Test (45 Skenario E2E Lintas Perangkat)

---

## Struktur Direktori Proyek

Proyek menggunakan pola arsitektur modular di mana seluruh berkas berukuran proporsional dan tidak ada berkas yang melebihi batas 500 baris kode:

```
cares-fe/
├── e2e/                           # Rangkaian pengujian otomatis Playwright
│   ├── fixtures/                  # Berkas dummy pengujian (foto sampel)
│   ├── admin.spec.js              # Skenario pengujian modul admin
│   ├── pelapor.spec.js            # Skenario pengujian modul pelapor
│   ├── area-luar-report.spec.js   # Pengujian formulir area luar dinamis
│   ├── auth-flow.spec.js          # Pengujian login, registrasi, & reset password
│   ├── responsive.spec.js         # Pengujian responsivitas multi-device
│   └── user-custom-report-history.spec.js
├── public/                        # Aset statis publik dan logo aplikasi
├── src/
│   ├── assets/                    # Ilustrasi visual dan grafik
│   ├── components/                # Komponen antarmuka modular
│   │   ├── admin/                 # Komponen khusus portal admin sarpras
│   │   ├── adminGuide/            # Komponen visual panduan admin
│   │   ├── analytics/             # Komponen grafik analitik Chart.js
│   │   ├── common/                # Komponen dasar (Button, Input, Badge, Autocomplete)
│   │   ├── dashboard/             # Komponen kartu metrik dan banner selamat datang
│   │   ├── history/               # Komponen tabel dan kartu riwayat pelapor
│   │   ├── layout/                # Komponen navigasi (Header, Sidebar, Dropdown)
│   │   ├── modals/                # Modal dialog konfirmasi, detail, dan notifikasi
│   │   └── report/                # Komponen formulir pelaporan dan dropzone foto
│   ├── data/                      # Master data lokasi Tel-U dan panduan sistem
│   ├── layouts/                   # Layout wrapper (AuthLayout, MainLayout, AdminLayout)
│   ├── pages/                     # Halaman rute utama (Pelapor, Admin, Auth, FAQ)
│   ├── routes/                    # Konfigurasi perutean aplikasi (AppRouter.jsx)
│   ├── services/                  # Abstraksi koneksi HTTP REST API ke backend
│   ├── App.jsx                    # Root component aplikasi
│   ├── index.css                  # Variabel tema dan utility CSS global
│   └── main.jsx                   # Titik masuk eksekusi React
├── playwright.config.js           # Konfigurasi runner Playwright
├── vite.config.js                 # Konfigurasi bundling Vite
└── package.json                   # Metadata dependensi dan skrip proyek
```

---

## Kredensial Akun Siap Uji

Sistem telah dilengkapi dengan data akun demo pada lingkungan pengujian:

| Peran | Email | Kata Sandi | Kegunaan |
| :--- | :--- | :--- | :--- |
| **Mahasiswa / Pelapor** | `pengguna1@telkomuniversity.ac.id` | `Password123` | Uji fitur pelaporan dan riwayat |
| **Mahasiswa / Pelapor** | `pengguna2@telkomuniversity.ac.id` | `Password123` | Uji preferensi notifikasi |
| **Admin Sarpras** | `admin1@telkomuniversity.ac.id` | `Admin123` | Verifikasi tiket dan analitik |
| **Admin Sarpras** | `admin2@telkomuniversity.ac.id` | `Admin123` | Penolakan dan bukti perbaikan |

---

## Panduan Instalasi dan Menjalankan

### 1. Prasyarat Lingkungan
- Node.js versi 18.x atau versi 20.x ke atas
- Manajer paket npm (atau pnpm/yarn)

### 2. Konfigurasi Environment Variables
Salin berkas konfigurasi template:
```bash
cp .env.example .env
```
Isi konfigurasi pada berkas `.env`:
```env
VITE_API_BASE_URL=http://localhost:5001
```

### 3. Pemasangan Dependensi
```bash
npm install
```

### 4. Menjalankan Server Pengembangan (Development Mode)
```bash
npm run dev
```
Aplikasi klien akan aktif secara default di `http://localhost:5173`.

---

## Pengujian Otomatis (Playwright E2E)

Proyek ini dilengkapi dengan 45 skenario pengujian *End-to-End* komprehensif menggunakan Playwright, mencakup seluruh alur perjalanan pengguna, validasi bisnis, dan pengujian responsivitas pada 5 resolusi layar:

```bash
# Menjalankan seluruh pengujian E2E (Headless)
npx playwright test

# Menjalankan pengujian dengan antarmuka visual (UI Mode)
npx playwright test --ui

# Menjalankan pengujian khusus modul area luar
npx playwright test e2e/area-luar-report.spec.js

# Menampilkan laporan hasil pengujian HTML
npx playwright show-report
```

---

## Panduan Build dan Persiapan Deployment

### 1. Kompilasi Bundle Produksi
```bash
npm run build
```
Hasil kompilasi bundel aset optimal akan tersimpan di direktori `dist/`.

### 2. Pratinjau Hasil Kompilasi Lokal
```bash
npm run preview
```

### 3. Checklist Sebelum Deploy ke Cloud
- [ ] Pastikan variabel `VITE_API_BASE_URL` telah diarahkan ke domain publik backend API produksi (misalnya `https://api.cares.telkomuniversity.ac.id`).
- [ ] Konfigurasi aturan *Single Page Application (SPA) Rewrite* pada web server (Nginx/Vercel/Netlify) agar rute diarahkan ke `index.html`.
- [ ] Lakukan verifikasi bahwa seluruh aset gambar dan font dimuat melalui protokol HTTPS.
