import React, { useMemo, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';

const adminFaqItems = [
  [
    'Apa saja kriteria laporan yang wajib ditolak?',
    'Laporan harus ditolak jika bukti foto tidak sesuai dengan deskripsi, isi laporan tidak jelas, terindikasi spam, atau tidak valid.'
  ],
  [
    'Apakah menuliskan alasan penolakan itu wajib?',
    'Ya. Setiap kali menolak laporan, admin wajib mengisi kolom alasan penolakan agar pelapor mengetahui penyebab laporannya tidak diproses.'
  ],
  [
    'Syarat apa yang dibutuhkan untuk menandai laporan menjadi "Selesai"?',
    'Perubahan status dari Diproses menjadi Selesai wajib melampirkan foto bukti penanganan di lapangan.'
  ],
  [
    'Apa syarat agar beberapa laporan bisa dipilih dan diubah statusnya secara bersamaan?',
    'Semua laporan yang dipilih harus memiliki lokasi yang sama dan status awal yang sama.'
  ],
  [
    'Bisakah saya menolak beberapa laporan sekaligus menggunakan fitur pilih banyak?',
    'Tidak bisa. Penolakan laporan harus dilakukan satu per satu melalui tombol "Lihat detail" untuk memastikan alasan penolakan tercatat dengan benar.'
  ],
  [
    'Mengapa saya tidak bisa menggunakan fitur pilih banyak saat berada di halaman "Lihat detail"?',
    'Tombol "Lihat detail" akan mengarahkan admin ke halaman baru yang khusus memuat data satu laporan secara spesifik. Fitur pilih banyak hanya tersedia pada halaman utama daftar laporan.'
  ],
  [
    'Siapa saja yang dapat menggunakan CARES?',
    'CARES dapat digunakan oleh mahasiswa, dosen, dan staf untuk menyampaikan laporan terkait fasilitas kampus.'
  ],
  [
    'Apakah data laporan di dashboard ini bisa diunduh atau diekspor (misal ke Excel/PDF)?',
    'Tidak. Saat ini sistem tidak menyediakan fitur export data laporan.'
  ]
];

const AdminFAQ = ({ user, notifications, onLogout, onUpdateAvatar, onToggleNotificationPreference }) => {
  const [query, setQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);

  const filteredItems = useMemo(
    () =>
      adminFaqItems.filter(([question, answer]) =>
        `${question} ${answer}`.toLowerCase().includes(query.toLowerCase().trim())
      ),
    [query]
  );

  return (
    <AdminLayout
      title="Frequently Asked Questions"
      subtitle="Temukan jawaban atas pertanyaan umum tentang CARES dan pelaporan fasilitas"
      user={user}
      notifications={notifications}
      onLogout={onLogout}
      onUpdateAvatar={onUpdateAvatar}
      onToggleNotificationPreference={onToggleNotificationPreference}
    >
      <div className="faq-page">
        <aside className="faq-info-card">
          <h2>Apa itu CARES?</h2>
        <p>CARES (Campus Facility Reporting System) adalah platform pelaporan fasilitas kampus yang dirancang untuk memudahkan mahasiswa, dosen, dan staf dalam melaporkan kerusakan atau permasalahan fasilitas di lingkungan Telkom University. Melalui CARES, pengguna dapat menyampaikan laporan secara terstruktur dengan mencantumkan jenis permasalahan, lokasi, serta informasi pendukung, kemudian memantau perkembangan laporan mulai dari menunggu verifikasi, diproses, hingga selesai. Sistem ini juga memberikan transparansi terhadap proses penanganan laporan sehingga pengguna dapat mengetahui status dan perkembangan permasalahan fasilitas yang telah dilaporkan.</p>
        </aside>
        <section className="faq-main" aria-label="Daftar pertanyaan umum admin">
          <label className="faq-search">
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpenIndex(null);
              }}
              placeholder="Cari yang ingin Anda tanyakan..."
              aria-label="Cari pertanyaan FAQ Admin"
            />
          </label>
          <div className="faq-list">
            {filteredItems.map(([question, answer]) => {
              const originalIndex = adminFaqItems.findIndex(
                ([itemQuestion]) => itemQuestion === question
              );
              const isOpen = openIndex === originalIndex;

              return (
                <article className={`faq-item ${isOpen ? 'is-open' : ''}`} key={question}>
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => setOpenIndex(isOpen ? null : originalIndex)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${originalIndex}`}
                  >
                    <span>{question}</span>
                    <b aria-hidden="true">{isOpen ? '−' : '+'}</b>
                  </button>
                  <div
                    id={`faq-answer-${originalIndex}`}
                    className="faq-answer"
                    aria-hidden={!isOpen}
                  >
                    <p>{answer}</p>
                  </div>
                </article>
              );
            })}
            {filteredItems.length === 0 && (
              <p className="faq-empty">
                Tidak ada pertanyaan yang cocok. Coba kata kunci lain.
              </p>
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminFAQ;