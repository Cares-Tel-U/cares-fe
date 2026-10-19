import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import IdentitySection from '../../components/report/IdentitySection';
import ReportFormSection from '../../components/report/ReportFormSection';
import ImportantInfoCard from '../../components/report/ImportantInfoCard';
import ReportLoadingModal from '../../components/modals/ReportLoadingModal';
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
  const [showLoadingModal, setShowLoadingModal] = useState(false);
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
    setShowLoadingModal(true);

    try {
      // 1. Dapatkan daftar master fasilitas untuk mencocokkan fasilitas jika sudah terdaftar
      let currentFacilities = facilities;
      if (!currentFacilities || currentFacilities.length === 0) {
        try {
          const fresh = await facilityService.getFacilities();
          if (Array.isArray(fresh) && fresh.length > 0) {
            currentFacilities = fresh;
            setFacilities(fresh);
          }
        } catch {
          // ignore error
        }
      }

      const reqRuangan = (formData.namaRuangan || '').trim();
      const reqGedung = (formData.namaGedung || '').trim();

      // Cari fasilitas yang namanya cocok persis di master data jika ada
      let matchingFacility = null;
      if (currentFacilities && currentFacilities.length > 0 && reqRuangan) {
        matchingFacility =
          currentFacilities.find(
            (f) =>
              f.nama.trim().toLowerCase() === reqRuangan.toLowerCase() &&
              (!reqGedung || f.lokasi.trim().toLowerCase() === reqGedung.toLowerCase())
          ) ||
          currentFacilities.find(
            (f) => f.nama.trim().toLowerCase() === reqRuangan.toLowerCase()
          );
      }

      // 2. Judul laporan dinamis sesuai ruangan dan gedung yang dimasukkan pengguna
      const judulLaporan = `Kerusakan Fasilitas di ${reqRuangan || formData.lokasi || 'Kampus'}`;

      // 3. Kirim laporan ke backend dengan data asli yang diisi pengguna
      const createdReport = await reportService.createReport({
        judul: judulLaporan,
        deskripsi: formData.deskripsi,
        facilityId: matchingFacility ? matchingFacility.id : undefined,
        isAnonymous: isAnonim,
        photos: formData.photoFiles || formData.foto || [],
        namaGedung: reqGedung || 'Area Kampus',
        namaRuangan: reqRuangan || 'Ruangan Umum',
      });

      if (onAddReport && createdReport) {
        onAddReport(createdReport);
      }
      await new Promise((resolve) => setTimeout(resolve, 800));
      setShowLoadingModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      setShowLoadingModal(false);
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
      <div className="create-report-grid">
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

          <ReportFormSection onSubmit={handleSubmit} isSubmitting={submitting} facilities={facilities} />
        </div>

        {/* Right: Important Information Card */}
        <div>
          <ImportantInfoCard />
        </div>
      </div>

      <ReportLoadingModal isOpen={showLoadingModal} text="loading to laporan berhasil" />

      {showSuccessModal && typeof document !== 'undefined' && createPortal(
        <div className="success-modal-backdrop" role="presentation" style={{ zIndex: 99999 }}>
          <section className="success-modal-card" role="status" aria-live="polite" aria-label="Laporan berhasil dibuat">
            <div className="success-icon-wrapper" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12 4 4L19 6" />
              </svg>
            </div>
            <p>Laporan berhasil dibuat</p>
          </section>
        </div>,
        document.body
      )}

      {showDailyLimitModal && typeof document !== 'undefined' && createPortal(
        <div
          role="presentation"
          onClick={() => setShowDailyLimitModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
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
            <p style={{ margin: 0, color: '#171717', fontSize: '13.5px', fontWeight: 600, lineHeight: 1.45 }}>
              Laporan gagal dibuat karena melebihi batas laporan harian
            </p>
          </section>
        </div>,
        document.body
      )}
    </MainLayout>
  );
};

export default CreateReportPage;
