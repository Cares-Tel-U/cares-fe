# CARES Frontend

Frontend client untuk sistem pelaporan kerusakan fasilitas kampus **CARES (Campus Facility Damage Reporting System)**.

Dibangun menggunakan **React 19**, **Vite**, dan **Tailwind CSS v4**.

---

## Prasyarat

- Node.js (v18 atau lebih baru)
- npm / yarn / pnpm

---

## Panduan Memulai

### 1. Salin Environment Variables
```bash
cp .env.example .env
```
Secara default, `VITE_API_BASE_URL` diarahkan ke backend di `http://localhost:5001`.

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Menjalankan Mode Development
```bash
npm run dev
```
Aplikasi akan dapat diakses secara default di `http://localhost:5173`.

### 4. Build untuk Production
```bash
npm run build
```
Hasil build akan berada di direktori `dist/`.

### 5. Menjalankan Preview Hasil Build
```bash
npm run preview
```

---

## Struktur Proyek

```
cares-fe/
├── public/            # Static assets
├── src/
│   ├── assets/        # Gambar dan ikon
│   ├── App.jsx        # Komponen utama aplikasi
│   ├── App.css        # Styling komponen App
│   ├── index.css      # Styling global (Tailwind CSS v4)
│   └── main.jsx       # Entry point React
├── .env.example       # Template konfigurasi environment
├── .gitignore         # File yang diabaikan Git
├── index.html         # Template HTML utama
├── package.json       # Metadata & dependensi proyek
├── vite.config.js     # Konfigurasi Vite & Tailwind CSS
└── README.md          # Dokumentasi proyek
```
