import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import IdentitySection from '../../components/report/IdentitySection';
import ReportFormSection from '../../components/report/ReportFormSection';
import ImportantInfoCard from '../../components/report/ImportantInfoCard';
import { reportService, facilityService } from '../../services';

const CreateReportPage = ({
  user,
  reports = [],
  onAddReport,
  notifications = [],
  onMarkAllNotificationsAsRead,
  onMarkNotificationAsRead,
  onLogout,
  onUpdateAvatar
}) => {
  const navigate = useNavigate();
  const [isAnonim, setIsAnonim] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDailyLimitModal, setShowDailyLimitModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    facilityService
      .getFacilities()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFacilities(data);
        }
      })
      .catch((err) => console.warn('Gagal memuat master fasilitas:', err.message));
  }, []);

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

  const handleSubmit = async (formData) => {
    setErrorMessage('');
    setSubmitting(true);

    try {
      // 1. Temukan ID fasilitas yang cocok atau fallback ke fasilitas pertama
      let targetFacilityId = '';
      if (facilities.length > 0) {
        const found = facilities.find(
          (f) =>
            f.nama.toLowerCase().includes(formData.namaRuangan?.toLowerCase()) ||
            f.lokasi.toLowerCase().includes(formData.namaGedung?.toLowerCase()) ||
            formData.lokasi?.toLowerCase().includes(f.nama.toLowerCase())
        );
        targetFacilityId = found ? found.id : facilities[0].id;
      }

      if (!targetFacilityId && facilities.length > 0) {
        targetFacilityId = facilities[0].id;
      }

      // 2. Kirim laporan ke backend API
      const judulLaporan = `Kerusakan Fasilitas di ${formData.namaRuangan || formData.lokasi || 'Kampus'}`;
      const payload = {
        judul: judulLaporan,
        deskripsi: formData.deskripsi,
        facilityId: targetFacilityId,
        isAnonymous: isAnonim,
        photos: formData.photoFiles || formData.foto || [],
      };

      const createdReport = await reportService.createReport(payload);

      if (onAddReport) {
        onAddReport(createdReport);
      }
      setShowSuccessModal(true);
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('3 laporan harian') || msg.includes('melebihi batas')) {
        setShowDailyLimitModal(true);
      } else {
        setErrorMessage(msg || 'Gagal mengirimkan laporan. Silakan periksa kembali formulir Anda.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout
      title="Buat Laporan"
      subtitle="Laporkan masalah fasilitas kampus dengan melengkapi informasi berikut"
      user={user}
      notifications={notifications}
      onMarkAllNotificationsAsRead={onMarkAllNotificationsAsRead}
      onMarkNotificationAsRead={onMarkNotificationAsRead}
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

          {errorMessage && (
            <div
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#b91c1c',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '12.5px',
                marginBottom: '16px',
                fontWeight: '500'
              }}
            >
              {errorMessage}
            </div>
          )}

          <ReportFormSection onSubmit={handleSubmit} isSubmitting={submitting} />
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
