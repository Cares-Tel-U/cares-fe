import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import BadgeStatus from '../../components/common/BadgeStatus';
import SuccessModal from '../../components/modals/SuccessModal';

const AdminReportResponsePage = ({
  user,
  reports = [],
  notifications = [],
  onMarkAllNotificationsAsRead,
  onVerifyReports,
  onCompleteReport,
  onLogout
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

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
    // Fallback: pick pending verification reports or default mock report
    const pending = reports.filter((r) => r.status === 'Menunggu Verifikasi');
    if (pending.length > 0) return pending.slice(0, 3);
    return [
      {
        id: 'LAP-001',
        status: 'Menunggu Verifikasi',
        jenisLokasi: 'Dalam Gedung',
        namaGedung: 'Gedung A',
        namaRuangan: 'KU3.02.12',
        deskripsi: 'AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala',
        isAnonim: true,
        foto: [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
        ]
      }
    ];
  }, [location.state, id, reports]);

  const [activeReports, setActiveReports] = useState(initialReports);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Laporan berhasil diverifikasi');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

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

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(e.target.files);
      e.target.value = '';
    }
  };

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
  const handleVerifyAll = () => {
    const ids = activeReports.map((r) => r.id);
    if (onVerifyReports) {
      onVerifyReports(ids);
    }
    setSuccessMessage('Laporan berhasil diverifikasi');
    setShowSuccess(true);
  };

  // Handle Complete single report - pass uploaded proof image URLs
  const handleCompleteSingle = () => {
    if (onCompleteReport && primaryReport.id) {
      const proofUrls = uploadedFiles.map((f) => f.url);
      onCompleteReport(primaryReport.id, proofUrls);
    }
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
      onLogout={onLogout}
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.45fr 1fr',
          gap: '24px',
          alignItems: 'flex-start'
        }}
      >
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
                  Nama Gedung
                </div>
                <div style={{ fontSize: '13px', color: '#1f2937', fontWeight: '600' }}>
                  {primaryReport.namaGedung || primaryReport.gedung || (primaryReport.lokasi ? primaryReport.lokasi.split(' - ')[0] : 'Gedung A')}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11.5px', color: '#9ca3af', marginBottom: '2px' }}>
                  Nama Ruangan
                </div>
                <div style={{ fontSize: '13px', color: '#1f2937', fontWeight: '600' }}>
                  {primaryReport.namaRuangan || primaryReport.ruangan || (primaryReport.lokasi ? primaryReport.lokasi.split(' - ')[1] : 'KU3.02.12')}
                </div>
              </div>
            </div>
          </div>

          {/* Single Report Mode: Diproses -> Upload Bukti Perbaikan */}
          {isProcessMode && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '10px' }}>
                Bukti Perbaikan Fasilitas
              </label>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />

              {/* Drop Zone */}
              <div
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files?.length) handleFilesSelected(e.dataTransfer.files); }}
                style={{
                  border: `2px dashed ${isDragOver ? '#dc2626' : '#d1d5db'}`,
                  borderRadius: '16px',
                  padding: '28px 16px',
                  textAlign: 'center',
                  backgroundColor: isDragOver ? '#fff5f5' : '#f9fafb',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    backgroundColor: isDragOver ? '#fee2e2' : '#e5e7eb',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDragOver ? '#dc2626' : '#6b7280',
                    marginBottom: '10px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                  Seret ke sini <span style={{ fontWeight: '400', color: '#6b7280' }}>atau klik untuk dipilih</span>
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', marginBottom: '14px' }}>
                  Format JPG, PNG · Maks. 5 MB per foto
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current && fileInputRef.current.click(); }}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #f87171',
                    color: '#dc2626',
                    borderRadius: '8px',
                    padding: '7px 16px',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Pilih dari perangkat
                </button>
              </div>

              {/* Uploaded file thumbnails */}
              {uploadedFiles.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={file.url}
                        alt={file.name}
                        style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveUploadedFile(idx)}
                        title="Hapus foto"
                        style={{
                          position: 'absolute', top: '-6px', right: '-6px',
                          width: '18px', height: '18px',
                          backgroundColor: '#dc2626', color: '#ffffff',
                          border: 'none', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', fontSize: '9px', lineHeight: 1, padding: 0
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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

          {/* Action Button on bottom right */}
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
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
          }}
        >
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: '0 0 16px 0' }}>
            Preview Laporan ({activeReports.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeReports.map((report, index) => {
              const photoList = report.foto && report.foto.length > 0 ? report.foto : [
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
              ];

              return (
                <div
                  key={report.id || index}
                  style={{
                    backgroundColor: '#fafafa',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '16px',
                    position: 'relative'
                  }}
                >
                  {/* Card Header: Laporan X & Trash Icon */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#ba181b' }}>
                      Laporan {index + 1}
                    </span>
                    <button
                      type="button"
                      title="Hapus dari daftar"
                      onClick={() => handleRemoveReport(report.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        transition: 'color 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#9ca3af')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>

                  {/* Deskripsi Masalah */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#374151', marginBottom: '4px' }}>
                      Deskripsi Masalah
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#4b5563', lineHeight: '1.45' }}>
                      {report.deskripsi || 'AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala'}
                    </div>
                  </div>

                  {/* Bukti Foto */}
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                      Bukti Foto
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {photoList.map((imgSrc, imgIdx) => (
                        <img
                          key={imgIdx}
                          src={imgSrc}
                          alt={`Bukti Foto ${imgIdx + 1}`}
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            border: '1px solid #e5e7eb'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Pelapor */}
                  <div>
                    <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#374151', marginBottom: '2px' }}>
                      Pelapor
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#374151' }}>
                      {report.isAnonim ? 'Anonim' : (report.pelapor || 'Anonim')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Success Modal (Screenshot 5) */}
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