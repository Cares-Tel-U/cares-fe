import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import IdentitySection from '../../components/report/IdentitySection';
import ReportFormSection from '../../components/report/ReportFormSection';
import ImportantInfoCard from '../../components/report/ImportantInfoCard';

const CreateReportPage = ({ user, onAddReport, notifications = [], onLogout }) => {
  const navigate = useNavigate();
  const [isAnonim, setIsAnonim] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (!showSuccessModal) return undefined;
    const redirectTimer = window.setTimeout(() => navigate('/riwayat-laporan'), 2500);
    return () => window.clearTimeout(redirectTimer);
  }, [navigate, showSuccessModal]);

  const handleSubmit = (formData) => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    const newReport = {
      id: `LAP-${Date.now().toString().slice(-4)}`,
      nomor: 1,
      lokasi: formData.lokasi,
      jenisLokasi: formData.jenisLokasi,
      namaGedung: formData.namaGedung,
      namaRuangan: formData.namaRuangan,
      deskripsi: formData.deskripsi,
      tanggal: formattedDate,
      status: 'Menunggu Verifikasi',
      isAnonim: isAnonim,
      foto: formData.foto,
      timeline: [
        {
          step: 'Laporan terkirim',
          date: `${today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}, ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')} WIB`,
          completed: true,
          current: true
        },
        { step: 'Laporan berhasil diverifikasi', date: '-', completed: false, current: false },
        { step: 'Laporan dalam proses', date: '-', completed: false, current: false },
        { step: 'Laporan selesai', date: '-', completed: false, current: false }
      ]
    };

    if (onAddReport) {
      onAddReport(newReport);
    }
    setShowSuccessModal(true);
  };

  return (
    <MainLayout
      title="Buat Laporan"
      subtitle="Laporkan masalah fasilitas kampus dengan melengkapi informasi berikut"
      user={user}
      notifications={notifications}
      onLogout={onLogout}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          alignItems: 'start'
        }}
      >
        {/* Left: Identity and Report Form */}
        <div>
          <IdentitySection
            user={user}
            isAnonim={isAnonim}
            onToggleAnonim={setIsAnonim}
          />

          <ReportFormSection onSubmit={handleSubmit} />
        </div>

        {/* Right: Important Information Card */}
        <div>
          <ImportantInfoCard />
        </div>
      </div>

      {showSuccessModal && (
        <div className="success-modal-backdrop" role="presentation">
          <section className="success-modal-card" role="status" aria-live="polite" aria-label="Laporan berhasil dibuat">
            <div className="success-icon-wrapper" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12 4 4L19 6" />
              </svg>
            </div>
            <p>Laporan berhasil dibuat</p>
          </section>
        </div>
      )}
    </MainLayout>
  );
};

export default CreateReportPage;
