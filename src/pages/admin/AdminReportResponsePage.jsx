import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import BadgeStatus from '../../components/common/BadgeStatus';
import SuccessModal from '../../components/modals/SuccessModal';
import ReportLoadingModal from '../../components/modals/ReportLoadingModal';
import RepairProofDropzone from '../../components/admin/RepairProofDropzone';
import AdminReportPreviewList from '../../components/admin/AdminReportPreviewList';

const AdminReportResponsePage = ({
  user,
  reports = [],
  notifications = [],
  onMarkAllNotificationsAsRead,
  onMarkNotificationAsRead,
  onVerifyReports,
  onCompleteReport,
  onLogout,
  onUpdateAvatar
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Initial reports from location state (batch mode) or from param id
  const initialReports = useMemo(() => {
    if (location.state?.selectedReports && location.state.selectedReports.length > 0) {
      return location.state.selectedReports;
    }
    if (location.state?.selectedIds && location.state.selectedIds.length > 0) {
      const found = reports.filter((r) => location.state.selectedIds.includes(r.id));
      if (found.length > 0) return found;
    }
    if (id) {
      const single = reports.find((r) => String(r.id) === String(id));
      if (single) return [single];
    }
    // Fallback: pick pending verification reports or empty array
    const pending = reports.filter((r) => r.status === 'Menunggu Verifikasi');
    if (pending.length > 0) return pending.slice(0, 3);
    return [];
  }, [location.state, id, reports]);

  const [activeReports, setActiveReports] = useState(initialReports);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingText, setLoadingText] = useState('Memproses pembaruan laporan...');

  const primaryReport = activeReports[0] || initialReports[0] || {};
  const isProcessMode = primaryReport.status === 'Diproses';

  // Handle file selection from input or drop
  const handleFilesSelected = useCallback((files) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter((f) => f.type.startsWith('image/'));
    const newEntries = imageFiles.map((f) => ({
      url: URL.createObjectURL(f),
      name: f.name
    }));
    setUploadedFiles((prev) => [...prev, ...newEntries]);
  }, []);

  const handleRemoveUploadedFile = (index) => {
    setUploadedFiles((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].url);
      copy.splice(index, 1);
      return copy;
    });
  };

  // Remove a report from preview list
  const handleRemoveReport = (reportId) => {
    setActiveReports((prev) => {
      const updated = prev.filter((r) => r.id !== reportId);
      if (updated.length === 0) {
        navigate('/admin/daftar-laporan');
      }
      return updated;
    });
  };

  // Handle Verify all reports
  const handleVerifyAll = async () => {
    setLoadingText('Memproses verifikasi laporan...');
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 600));
    const ids = activeReports.map((r) => r.id);
    if (onVerifyReports) {
      onVerifyReports(ids);
    }
    setIsProcessing(false);
    setSuccessMessage('Laporan berhasil diverifikasi');
    setShowSuccess(true);
  };

  // Handle Complete single report - pass uploaded proof image URLs
  const handleCompleteSingle = async () => {
    setLoadingText('Memproses penyelesaian laporan...');
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 600));
    if (onCompleteReport && primaryReport.id) {
      const proofUrls = uploadedFiles.map((f) => f.url);
      onCompleteReport(primaryReport.id, proofUrls);
    }
    setIsProcessing(false);
    setSuccessMessage('Laporan selesai ditangani');
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    navigate('/admin/daftar-laporan');
  };

  return (
    <AdminLayout
      title="Daftar Laporan"
      subtitle="Kelola, verifikasi, dan pantau seluruh laporan fasilitas kampus"
      user={user}
      notifications={notifications}
      onMarkAllNotificationsAsRead={onMarkAllNotificationsAsRead}
      onMarkNotificationAsRead={onMarkNotificationAsRead}
      onLogout={onLogout}
      onUpdateAvatar={onUpdateAvatar}
    >
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => navigate('/admin/daftar-laporan')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            color: '#111827',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            padding: 0
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Daftar Laporan</span>
        </button>
        <span style={{ color: '#9ca3af', fontSize: '14px' }}>/</span>
        <span style={{ color: '#dc2626', fontSize: '14px', fontWeight: '700' }}>
          Respons Laporan
        </span>
      </div>

      {/* Main 2-Column Grid */}
      <div className="admin-response-grid">
        {/* Left Column: Form Respon */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 18px 0' }}>
            Form Respon
          </h2>

          {/* Status saat ini */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #f3f4f6',
              paddingBottom: '16px',
              marginBottom: '18px'
            }}
          >
            <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: '500' }}>
              Status saat ini
            </span>
            <BadgeStatus status={primaryReport.status || 'Menunggu Verifikasi'} />
          </div>

          {/* Lokasi */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#111827', margin: '0 0 8px 0' }}>
              Lokasi
            </h3>
            <div style={{ fontSize: '11.5px', color: '#9ca3af', marginBottom: '2px' }}>
              Jenis Lokasi
            </div>
            <div style={{ fontSize: '13px', color: '#1f2937', fontWeight: '600', marginBottom: '12px' }}>
              {primaryReport.jenisLokasi || 'Dalam Gedung'}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '11.5px', color: '#9ca3af', marginBottom: '2px' }}>
                  {(primaryReport.jenisLokasi === 'Area Luar' || primaryReport.jenisLokasi === 'Luar Gedung') ? 'Area' : 'Nama Gedung'}
                </div>
                <div style={{ fontSize: '13px', color: '#1f2937', fontWeight: '600' }}>
                  {primaryReport.namaGedung || primaryReport.gedung || (primaryReport.lokasi ? primaryReport.lokasi.split(' - ')[0] : '-')}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11.5px', color: '#9ca3af', marginBottom: '2px' }}>
                  {(primaryReport.jenisLokasi === 'Area Luar' || primaryReport.jenisLokasi === 'Luar Gedung') ? 'Lokasi Spesifik' : 'Nama Ruangan'}
                </div>
                <div style={{ fontSize: '13px', color: '#1f2937', fontWeight: '600' }}>
                  {primaryReport.namaRuangan || primaryReport.ruangan || (primaryReport.lokasi ? primaryReport.lokasi.split(' - ')[1] : '-')}
                </div>
              </div>
            </div>
          </div>

          {/* Single Report Mode: Diproses -> Upload Bukti Perbaikan */}
          {isProcessMode && (
            <RepairProofDropzone
              uploadedFiles={uploadedFiles}
              onFilesSelected={handleFilesSelected}
              onRemoveFile={handleRemoveUploadedFile}
            />
          )}

          {/* Attention Box */}
          <div
            style={{
              backgroundColor: '#fff5f5',
              border: '1px solid #f87171',
              borderRadius: '12px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginTop: '16px'
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0, marginTop: '2px' }}
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#dc2626' }}>
                Perhatian
              </div>
              <div style={{ fontSize: '12px', color: '#b91c1c', marginTop: '2px', lineHeight: '1.45' }}>
                {isProcessMode
                  ? 'Proses ini akan memberitahu pelapor bahwa laporan telah selesai dan fasilitas yang dilaporkan sudah diperbaiki'
                  : 'Verifikasi ini akan memberitahu pelapor bahwa laporan telah diterima dan sedang dalam antrean pengerjaan'}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            {isProcessMode ? (
              <button
                type="button"
                onClick={handleCompleteSingle}
                style={{
                  backgroundColor: '#ba181b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '11px 26px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(186, 24, 27, 0.2)',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9e181c')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ba181b')}
              >
                Laporan Selesai
              </button>
            ) : (
              <button
                type="button"
                onClick={handleVerifyAll}
                style={{
                  backgroundColor: '#ba181b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '11px 24px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(186, 24, 27, 0.2)',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9e181c')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ba181b')}
              >
                Verifikasi semua laporan
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Preview Laporan */}
        <AdminReportPreviewList
          activeReports={activeReports}
          onRemoveReport={handleRemoveReport}
        />
      </div>

      <ReportLoadingModal isOpen={isProcessing} text={loadingText} />

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          message={successMessage}
          onClose={handleCloseSuccess}
        />
      )}
    </AdminLayout>
  );
};

export default AdminReportResponsePage;