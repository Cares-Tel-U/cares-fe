export const GUIDE_DATA = {
  terima: {
    sectionTitle: 'Cara memverifikasi laporan',
    sectionSub: 'Ikuti langkah berikut untuk memverifikasi laporan',
    steps: [
      {
        step: 1,
        title: 'Pilih laporan yang menunggu diverifikasi',
        description: 'Pilih laporan dengan status Menunggu Verifikasi dari daftar laporan untuk mulai melakukan pemeriksaan.'
      },
      {
        step: 2,
        title: 'Buka detail laporan',
        description: 'Klik Lihat Detail untuk memeriksa informasi laporan, seperti fasilitas, lokasi, deskripsi masalah, dan bukti foto.'
      },
      {
        step: 3,
        title: 'Periksa laporan',
        description: 'Pastikan informasi yang diberikan sudah sesuai dan laporan dapat diverifikasi. Jika terdapat laporan dengan fasilitas dan lokasi yang sama, periksa laporan terkait untuk memastikan laporan tersebut bukan laporan yang sama.'
      },
      {
        step: 4,
        title: 'Verifikasi laporan',
        description: 'Jika laporan sudah sesuai, klik Verifikasi Laporan untuk menerima laporan dan mengubah status laporan menjadi Diproses.'
      }
    ]
  },
  tolak: {
    sectionTitle: 'Cara menolak laporan',
    sectionSub: 'Ikuti langkah berikut untuk menolak laporan',
    steps: [
      {
        step: 1,
        title: 'Pilih laporan yang menunggu diverifikasi',
        description: 'Pilih laporan dengan status Menunggu Verifikasi dari daftar laporan untuk mulai melakukan pemeriksaan.'
      },
      {
        step: 2,
        title: 'Buka detail laporan',
        description: 'Klik Lihat Detail untuk memeriksa informasi laporan, seperti fasilitas, lokasi, deskripsi masalah, dan bukti foto.'
      },
      {
        step: 3,
        title: 'Periksa laporan',
        description: 'Pastikan informasi yang diberikan sudah sesuai dan laporan dapat diverifikasi. Jika terdapat laporan dengan fasilitas dan lokasi yang sama, periksa laporan terkait untuk memastikan laporan tersebut bukan laporan yang sama.'
      },
      {
        step: 4,
        title: 'Pilih tolak laporan',
        description: 'Klik Tolak Laporan untuk membuka formulir penolakan.'
      },
      {
        step: 5,
        title: 'Tulis alasan penolakan',
        description: 'Masukkan alasan mengapa laporan ditolak pada kolom yang tersedia. Alasan harus jelas agar dapat menjadi informasi bagi pelapor.'
      },
      {
        step: 6,
        title: 'Konfirmasi penolakan',
        description: 'Klik Tolak Laporan pada formulir untuk mengonfirmasi penolakan laporan.'
      }
    ]
  },
  selesai: {
    sectionTitle: 'Cara selesaikan laporan',
    sectionSub: 'Ikuti langkah berikut untuk selesaikan laporan',
    steps: [
      {
        step: 1,
        title: 'Pilih laporan yang sedang diproses',
        description: 'Pilih laporan dengan status Diproses yang telah selesai ditangani di lapangan.'
      },
      {
        step: 2,
        title: 'Buka detail laporan',
        description: 'Klik Lihat Detail untuk melihat informasi laporan yang akan diselesaikan.'
      },
      {
        step: 3,
        title: 'Pilih laporan selesai',
        description: 'Pastikan fasilitas, lokasi, dan deskripsi masalah sesuai dengan laporan yang akan diselesaikan dan klik Laporan Selesai untuk melanjutkan proses penyelesaian laporan.'
      },
      {
        step: 4,
        title: 'Periksa kembali laporan',
        description: 'Pada halaman Respons Laporan, periksa kembali laporan yang akan diselesaikan sebelum memberikan respons pada bagian preview laporan'
      },
      {
        step: 5,
        title: 'Tambahkan bukti perbaikan',
        description: 'Unggah foto yang menunjukkan kondisi fasilitas setelah dilakukan perbaikan sebagai bukti penyelesaian laporan.'
      },
      {
        step: 6,
        title: 'Selesaikan laporan',
        description: 'Setelah bukti perbaikan ditambahkan dan informasi sudah sesuai, klik Laporan Selesai untuk menyelesaikan laporan.'
      }
    ]
  }
};
