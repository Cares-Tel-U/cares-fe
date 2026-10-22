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
  onUpdateAvatar,
  onToggleNotificationPreference
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
      const isLimit =
        err.status === 429 ||
        msg.toLowerCase().includes('3 laporan') ||
        msg.toLowerCase().includes('melebihi batas') ||
        msg.toLowerCase().includes('batas maksimal') ||
        msg.toLowerCase().includes('laporan harian');

      if (isLimit) {
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
      onToggleNotificationPreference={onToggleNotificationPreference}
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
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(3px)',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <section
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="limit-title"
            aria-describedby="limit-desc"
            onClick={(event) => event.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '380px',
              padding: '28px 24px 22px',
              borderRadius: '16px',
              background: '#ffffff',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
              animation: 'modalFadeIn 0.2s ease-out'
            }}
          >
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
                width: '52px',
                height: '52px',
                margin: '0 auto 16px',
                borderRadius: '50%',
                background: '#fee2e2',
                color: '#dc2626'
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h3
              id="limit-title"
              style={{
                margin: '0 0 8px 0',
                fontSize: '16px',
                fontWeight: '700',
                color: '#111827'
              }}
            >
              Batas Maksimal 3 Laporan Harian
            </h3>

            <p
              id="limit-desc"
              style={{
                margin: '0 0 22px 0',
                color: '#4b5563',
                fontSize: '13px',
                lineHeight: '1.55'
              }}
            >
              Laporan gagal dibuat karena Anda telah mencapai batas maksimal 3 laporan dalam satu hari. Sistem membatasi kuota harian untuk menjaga kualitas penanganan fasilitas. Silakan coba kembali besok.
            </p>

            <button
              type="button"
              onClick={() => setShowDailyLimitModal(false)}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                backgroundColor: '#ba181b',
                color: '#ffffff',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9e181c')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ba181b')}
            >
              Saya Mengerti
            </button>
          </section>
        </div>,
        document.body
      )}
    </MainLayout>
  );
};

export default CreateReportPage;
