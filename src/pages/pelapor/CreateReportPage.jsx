import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import IdentitySection from '../../components/report/IdentitySection';
import ReportFormSection from '../../components/report/ReportFormSection';
import ImportantInfoCard from '../../components/report/ImportantInfoCard';

const CreateReportPage = ({ user, reports = [], onAddReport, notifications = [], onLogout, onUpdateAvatar }) => {
  const navigate = useNavigate();
  const [isAnonim, setIsAnonim] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDailyLimitModal, setShowDailyLimitModal] = useState(false);

  useEffect(() => {
    if (!showSuccessModal) return undefined;
    const redirectTimer = window.setTimeout(() => navigate('/riwayat-laporan'), 2500);
    return () => window.clearTimeout(redirectTimer);
  }, [navigate, showSuccessModal]);

  useEffect(() => {
    if (!showDailyLimitModal) return undefined;
    const closeTimer = window.setTimeout(() => setShowDailyLimitModal(false), 2400);
    return () => window.clearTimeout(closeTimer);
  }, [showDailyLimitModal]);

  const handleSubmit = (formData) => {
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
    const reporterId = user?.email || user?.id || 'pelapor';
    const reportsToday = reports.filter((report) => {
      const sameReporter = report.reporterId ? report.reporterId === reporterId : true;
      return sameReporter && report.tanggal === formattedDate;
    });

    if (reportsToday.length >= 3) {
      setShowDailyLimitModal(true);
      return;
    }

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
      reporterId,
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
      onUpdateAvatar={onUpdateAvatar}
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

      {showDailyLimitModal && (
        <div
          role="presentation"
          onClick={() => setShowDailyLimitModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'rgba(0, 0, 0, 0.32)',
            backdropFilter: 'blur(1px)'
          }}
        >
          <section
            role="alert"
            aria-live="assertive"
            onClick={(event) => event.stopPropagation()}
            style={{
              width: '182px',
              padding: '22px 18px 18px',
              borderRadius: '9px',
              background: '#ffffff',
              textAlign: 'center',
              boxShadow: '0 16px 36px rgba(0, 0, 0, .18)',
              animation: 'modalFadeIn .2s ease-out'
            }}
          >
            <div style={{ display: 'grid', placeItems: 'center', width: '36px', height: '36px', margin: '0 auto 16px', borderRadius: '50%', background: '#ff654f', color: '#ffffff' }}>
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="m7 7 10 10M17 7 7 17" /></svg>
            </div>
            <p style={{ margin: 0, color: '#171717', fontSize: '10px', fontWeight: 600, lineHeight: 1.38 }}>
              Laporan gagal dibuat karena melebihi batas laporan harian
            </p>
          </section>
        </div>
      )}
    </MainLayout>
  );
};

export default CreateReportPage;
