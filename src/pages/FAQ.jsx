import React, { useMemo, useState } from 'react';
import MainLayout from '../layouts/MainLayout';

const faqItems = [
  ['Siapa saja yang dapat menggunakan CARES?', 'CARES dapat digunakan oleh mahasiswa, dosen, dan staf Telkom University untuk menyampaikan laporan terkait fasilitas kampus.'],
  ['Laporan seperti apa yang dapat disampaikan melalui CARES?', 'Anda dapat melaporkan kerusakan, gangguan, atau masalah pada fasilitas kampus yang membutuhkan penanganan.'],
  ['Apakah saya dapat melihat perkembangan laporan saya?', 'Ya. Setiap laporan yang telah dikirim dapat dipantau melalui halaman Riwayat Laporan, termasuk status penanganannya.'],
  ['Apa arti dari setiap status laporan?', 'Status menunjukkan perkembangan laporan, mulai dari Menunggu Verifikasi, Diproses, Selesai, hingga Ditolak.'],
  ['Mengapa laporan saya dapat ditolak?', 'Laporan dapat ditolak apabila informasi yang diberikan tidak memenuhi kebutuhan verifikasi, tidak sesuai cakupan CARES, atau masalahnya tidak dapat diproses.'],
  ['Apakah saya akan mendapatkan pemberitahuan ketika status laporan berubah?', 'Ya, CARES akan memberikan notifikasi saat laporan telah diverifikasi atau status penanganannya berubah.'],
  ['Apakah identitas saya dapat disembunyikan saat melapor?', 'Ya. CARES menyediakan pilihan untuk menyembunyikan identitas pelapor pada laporan tertentu.'],
  ['Apakah laporan saya dapat dilihat oleh pengguna lain?', 'Informasi laporan yang telah diverifikasi dan diproses dapat ditampilkan pada halaman pemantauan fasilitas. Informasi pribadi pelapor tidak ditampilkan.'],
  ['Apakah saya dapat mengubah laporan yang sudah dikirim?', 'Laporan yang telah dikirim tidak dapat diubah selama proses verifikasi atau penanganan. Pastikan informasi sudah benar sebelum mengirimkan laporan.'],
  ['Apa yang harus saya lakukan jika masalah fasilitas belum ditangani?', 'Pantau status laporan melalui Riwayat Laporan dan tunggu pembaruan dari pihak yang menangani laporan tersebut.'],
  ['Apakah satu masalah fasilitas dapat dilaporkan lebih dari sekali?', 'Sebaiknya periksa laporan yang sudah tersedia pada fitur pemantauan fasilitas agar tidak mengirim laporan yang sama berulang kali.'],
  ['Mengapa laporan saya berstatus Menunggu Verifikasi?', 'Artinya laporan telah berhasil dikirim dan sedang menunggu pemeriksaan atau verifikasi oleh admin.']
];

const FAQ = ({ user, notifications, onLogout }) => {
  const [query, setQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);
  const filteredItems = useMemo(() => faqItems.filter(([question, answer]) => `${question} ${answer}`.toLowerCase().includes(query.toLowerCase().trim())), [query]);

  return <MainLayout title="Frequently Asked Questions" subtitle="Temukan jawaban atas pertanyaan umum tentang CARES dan pelaporan fasilitas" user={user} notifications={notifications} onLogout={onLogout}>
    <div className="faq-page">
      <aside className="faq-info-card">
        <h2>Apa itu CARES?</h2>
        <p>CARES (Campus Facility Reporting System) adalah platform pelaporan fasilitas kampus yang dirancang untuk memudahkan mahasiswa, dosen, dan staf dalam melaporkan kerusakan atau permasalahan fasilitas di lingkungan Telkom University. Melalui CARES, pengguna dapat menyampaikan laporan secara terstruktur dengan mencantumkan jenis permasalahan, lokasi, serta informasi pendukung, kemudian memantau perkembangan laporan mulai dari menunggu verifikasi, diproses, hingga selesai. Sistem ini juga memberikan transparansi terhadap proses penanganan laporan sehingga pengguna dapat mengetahui status dan perkembangan permasalahan fasilitas yang telah dilaporkan.</p>
      </aside>
      <section className="faq-main" aria-label="Daftar pertanyaan umum">
        <label className="faq-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setOpenIndex(null); }} placeholder="Cari yang ingin Anda tanyakan..." aria-label="Cari pertanyaan FAQ" /></label>
        <div className="faq-list">
          {filteredItems.map(([question, answer]) => {
            const originalIndex = faqItems.findIndex(([itemQuestion]) => itemQuestion === question);
            const isOpen = openIndex === originalIndex;
            return <article className={`faq-item ${isOpen ? 'is-open' : ''}`} key={question}>
              <button type="button" className="faq-question" onClick={() => setOpenIndex(isOpen ? null : originalIndex)} aria-expanded={isOpen} aria-controls={`faq-answer-${originalIndex}`}><span>{question}</span><b aria-hidden="true">{isOpen ? '−' : '+'}</b></button>
              <div id={`faq-answer-${originalIndex}`} className="faq-answer" aria-hidden={!isOpen}><p>{answer}</p></div>
            </article>;
          })}
          {filteredItems.length === 0 && <p className="faq-empty">Tidak ada pertanyaan yang cocok. Coba kata kunci lain.</p>}
        </div>
      </section>
    </div>
  </MainLayout>;
};

export default FAQ;
