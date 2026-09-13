export const mockReports = [
  {
    id: "LAP-001",
    nomor: 1,
    lokasi: "Gedung A - KU3.02.12",
    jenisLokasi: "Dalam Gedung",
    namaGedung: "Gedung A",
    namaRuangan: "KU3.02.12",
    deskripsi: "AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala",
    tanggal: "12/02/2026",
    status: "Menunggu Verifikasi",
    isAnonim: true,
    foto: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=300&q=80"
    ],
    timeline: [
      { step: "Laporan terkirim", date: "12 Februari 2026, 14:30 WIB", completed: true, current: true },
      { step: "Laporan berhasil diverifikasi", date: "-", completed: false, current: false },
      { step: "Laporan dalam proses", date: "-", completed: false, current: false },
      { step: "Laporan selesai", date: "-", completed: false, current: false }
    ]
  },
  {
    id: "LAP-002",
    nomor: 2,
    lokasi: "Gedung A - KU3.02.12",
    jenisLokasi: "Dalam Gedung",
    namaGedung: "Gedung A",
    namaRuangan: "KU3.02.12",
    deskripsi: "AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala",
    tanggal: "12/02/2026",
    status: "Diproses",
    isAnonim: false,
    foto: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"
    ],
    timeline: [
      { step: "Laporan terkirim", date: "12 Februari 2026, 09:15 WIB", completed: true, current: false },
      { step: "Laporan berhasil diverifikasi", date: "12 Februari 2026, 10:00 WIB", completed: true, current: false },
      { step: "Laporan dalam proses", date: "12 Februari 2026, 11:30 WIB", completed: true, current: true },
      { step: "Laporan selesai", date: "-", completed: false, current: false }
    ]
  },
  {
    id: "LAP-003",
    nomor: 3,
    lokasi: "Parkir - Parkir motor TULT",
    jenisLokasi: "Area Luar",
    namaGedung: "Parkir TULT",
    namaRuangan: "Area Parkir Motor",
    deskripsi: "Lampu penerangan area parkir motor sebelah barat mati total sehingga sangat gelap",
    tanggal: "12/02/2026",
    status: "Diproses",
    isAnonim: true,
    foto: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=300&q=80"
    ],
    timeline: [
      { step: "Laporan terkirim", date: "11 Februari 2026, 18:20 WIB", completed: true, current: false },
      { step: "Laporan berhasil diverifikasi", date: "12 Februari 2026, 08:30 WIB", completed: true, current: false },
      { step: "Laporan dalam proses", date: "12 Februari 2026, 09:45 WIB", completed: true, current: true },
      { step: "Laporan selesai", date: "-", completed: false, current: false }
    ]
  },
  {
    id: "LAP-004",
    nomor: 4,
    lokasi: "Gedung A - KU3.02.12",
    jenisLokasi: "Dalam Gedung",
    namaGedung: "Gedung A",
    namaRuangan: "KU3.02.12",
    deskripsi: "AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala",
    tanggal: "12/02/2026",
    status: "Menunggu Verifikasi",
    isAnonim: false,
    foto: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"
    ],
    timeline: [
      { step: "Laporan terkirim", date: "12 Februari 2026, 13:00 WIB", completed: true, current: true },
      { step: "Laporan berhasil diverifikasi", date: "-", completed: false, current: false },
      { step: "Laporan dalam proses", date: "-", completed: false, current: false },
      { step: "Laporan selesai", date: "-", completed: false, current: false }
    ]
  },
  {
    id: "LAP-005",
    nomor: 5,
    lokasi: "Gedung A - KU3.02.12",
    jenisLokasi: "Dalam Gedung",
    namaGedung: "Gedung A",
    namaRuangan: "KU3.02.12",
    deskripsi: "AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala",
    tanggal: "12/02/2026",
    status: "Ditolak",
    isAnonim: false,
    foto: [
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=300&q=80"
    ],
    timeline: [
      { step: "Laporan terkirim", date: "10 Februari 2026, 10:00 WIB", completed: true, current: false },
      { step: "Laporan ditolak oleh admin (Informasi lokasi kurang jelas)", date: "11 Februari 2026, 09:00 WIB", completed: true, current: true, isRejected: true },
      { step: "Laporan dalam proses", date: "-", completed: false, current: false },
      { step: "Laporan selesai", date: "-", completed: false, current: false }
    ]
  },
  {
    id: "LAP-006",
    nomor: 6,
    lokasi: "Gedung A - KU3.02.12",
    jenisLokasi: "Dalam Gedung",
    namaGedung: "Gedung A",
    namaRuangan: "KU3.02.12",
    deskripsi: "AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala",
    tanggal: "12/02/2026",
    status: "Diproses",
    isAnonim: false,
    foto: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"
    ],
    timeline: [
      { step: "Laporan terkirim", date: "12 Februari 2026, 08:00 WIB", completed: true, current: false },
      { step: "Laporan berhasil diverifikasi", date: "12 Februari 2026, 09:10 WIB", completed: true, current: false },
      { step: "Laporan dalam proses", date: "12 Februari 2026, 10:20 WIB", completed: true, current: true },
      { step: "Laporan selesai", date: "-", completed: false, current: false }
    ]
  },
  {
    id: "LAP-007",
    nomor: 7,
    lokasi: "Gedung A - KU3.02.12",
    jenisLokasi: "Dalam Gedung",
    namaGedung: "Gedung A",
    namaRuangan: "KU3.02.12",
    deskripsi: "AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala",
    tanggal: "12/02/2026",
    status: "Selesai",
    isAnonim: false,
    foto: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"
    ],
    timeline: [
      { step: "Laporan terkirim", date: "09 Februari 2026, 11:00 WIB", completed: true, current: false },
      { step: "Laporan berhasil diverifikasi", date: "09 Februari 2026, 13:00 WIB", completed: true, current: false },
      { step: "Laporan dalam proses", date: "10 Februari 2026, 09:00 WIB", completed: true, current: false },
      { step: "Laporan selesai", date: "12 Februari 2026, 15:00 WIB", completed: true, current: true }
    ]
  },
  {
    id: "LAP-008",
    nomor: 8,
    lokasi: "Gedung A - KU3.02.12",
    jenisLokasi: "Dalam Gedung",
    namaGedung: "Gedung A",
    namaRuangan: "KU3.02.12",
    deskripsi: "AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala",
    tanggal: "12/02/2026",
    status: "Selesai",
    isAnonim: false,
    foto: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"
    ],
    timeline: [
      { step: "Laporan terkirim", date: "08 Februari 2026, 10:00 WIB", completed: true, current: false },
      { step: "Laporan berhasil diverifikasi", date: "08 Februari 2026, 11:00 WIB", completed: true, current: false },
      { step: "Laporan dalam proses", date: "09 Februari 2026, 10:00 WIB", completed: true, current: false },
      { step: "Laporan selesai", date: "11 Februari 2026, 14:00 WIB", completed: true, current: true }
    ]
  },
  {
    id: "LAP-009",
    nomor: 9,
    lokasi: "Gedung A - KU3.02.12",
    jenisLokasi: "Dalam Gedung",
    namaGedung: "Gedung A",
    namaRuangan: "KU3.02.12",
    deskripsi: "AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala",
    tanggal: "12/02/2026",
    status: "Ditolak",
    isAnonim: false,
    foto: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"
    ],
    timeline: [
      { step: "Laporan terkirim", date: "07 Februari 2026, 14:00 WIB", completed: true, current: false },
      { step: "Laporan ditolak", date: "08 Februari 2026, 09:00 WIB", completed: true, current: true, isRejected: true },
      { step: "Laporan dalam proses", date: "-", completed: false, current: false },
      { step: "Laporan selesai", date: "-", completed: false, current: false }
    ]
  },
  {
    id: "LAP-010",
    nomor: 10,
    lokasi: "Gedung A - KU3.02.12",
    jenisLokasi: "Dalam Gedung",
    namaGedung: "Gedung A",
    namaRuangan: "KU3.02.12",
    deskripsi: "AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala",
    tanggal: "12/02/2026",
    status: "Selesai",
    isAnonim: false,
    foto: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"
    ],
    timeline: [
      { step: "Laporan terkirim", date: "06 Februari 2026, 08:30 WIB", completed: true, current: false },
      { step: "Laporan berhasil diverifikasi", date: "06 Februari 2026, 10:00 WIB", completed: true, current: false },
      { step: "Laporan dalam proses", date: "07 Februari 2026, 09:00 WIB", completed: true, current: false },
      { step: "Laporan selesai", date: "10 Februari 2026, 16:00 WIB", completed: true, current: true }
    ]
  },
  {
    id: "LAP-011",
    nomor: 11,
    lokasi: "Gedung B - Tokong Nanas Lt. 2",
    jenisLokasi: "Dalam Gedung",
    namaGedung: "Gedung B",
    namaRuangan: "TN2.01.05",
    deskripsi: "Kran air di toilet pria lantai 2 bocor dan air terus mengalir",
    tanggal: "11/02/2026",
    status: "Menunggu Verifikasi",
    isAnonim: true,
    foto: ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"],
    timeline: [
      { step: "Laporan terkirim", date: "11 Februari 2026, 16:00 WIB", completed: true, current: true },
      { step: "Laporan berhasil diverifikasi", date: "-", completed: false, current: false },
      { step: "Laporan dalam proses", date: "-", completed: false, current: false },
      { step: "Laporan selesai", date: "-", completed: false, current: false }
    ]
  },
  {
    id: "LAP-012",
    nomor: 12,
    lokasi: "Gedung Kuliah Bersama - Lt. 4",
    jenisLokasi: "Dalam Gedung",
    namaGedung: "GKB",
    namaRuangan: "GKB.401",
    deskripsi: "Proyektor infocus mati saat digunakan untuk presentasi perkuliahan",
    tanggal: "10/02/2026",
    status: "Diproses",
    isAnonim: false,
    foto: ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"],
    timeline: [
      { step: "Laporan terkirim", date: "10 Februari 2026, 10:15 WIB", completed: true, current: false },
      { step: "Laporan berhasil diverifikasi", date: "10 Februari 2026, 11:00 WIB", completed: true, current: false },
      { step: "Laporan dalam proses", date: "11 Februari 2026, 08:30 WIB", completed: true, current: true },
      { step: "Laporan selesai", date: "-", completed: false, current: false }
    ]
  },
  {
    id: "LAP-013",
    nomor: 13,
    lokasi: "Kantin Telkom - Blok C",
    jenisLokasi: "Area Luar",
    namaGedung: "Kantin",
    namaRuangan: "Area Wastafel C",
    deskripsi: "Wastafel tersumbat dan menimbulkan bau kurang sedap",
    tanggal: "09/02/2026",
    status: "Selesai",
    isAnonim: false,
    foto: ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80"],
    timeline: [
      { step: "Laporan terkirim", date: "09 Februari 2026, 12:00 WIB", completed: true, current: false },
      { step: "Laporan berhasil diverifikasi", date: "09 Februari 2026, 13:00 WIB", completed: true, current: false },
      { step: "Laporan dalam proses", date: "09 Februari 2026, 14:00 WIB", completed: true, current: false },
      { step: "Laporan selesai", date: "10 Februari 2026, 11:00 WIB", completed: true, current: true }
    ]
  }
];

