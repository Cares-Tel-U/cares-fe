import React, { useState } from 'react';
import Modal from '../common/Modal';
import BadgeStatus from '../common/BadgeStatus';
import ImagePreviewModal from '../common/ImagePreviewModal';

const ReportDetailModal = ({ isOpen, onClose, report }) => {
  const [previewState, setPreviewState] = useState({
    isOpen: false,
    images: [],
    index: 0,
  });

  if (!report) return null;

  const handleOpenPreview = (imgs, idx) => {
    if (Array.isArray(imgs) && imgs.length > 0) {
      setPreviewState({
        isOpen: true,
        images: imgs,
        index: idx,
      });
    }
  };

  const handleClosePreview = () => {
    setPreviewState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleNavigatePreview = (newIndex) => {
    setPreviewState((prev) => ({ ...prev, index: newIndex }));
  };

  const completionProofs = Array.isArray(report.completionProofs) ? report.completionProofs : [];
  const initialPhotos = Array.isArray(report.foto) ? report.foto : [];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Detail Laporan" maxWidth="560px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Status Laporan */}
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontWeight: '500' }}>
              Status Laporan
            </div>
            <BadgeStatus status={report.status} />
          </div>

          {/* Alasan Penolakan jika Status Ditolak */}
          {report.status === 'Ditolak' && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#dc2626', marginBottom: '6px' }}>
                Alasan Penolakan
              </div>
              <p
                style={{
                  fontSize: '12.5px',
                  color: '#7f1d1d',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  lineHeight: '1.5',
                  margin: 0,
                  fontWeight: '500',
                }}
              >
                {report.rejectReason || report.rejectionReason || 'Alasan penolakan tidak dicantumkan oleh petugas.'}
              </p>
            </div>
          )}

          {/* Lokasi */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              Lokasi
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '11.5px', color: '#9ca3af', marginBottom: '2px' }}>Jenis Lokasi</div>
                <div style={{ fontSize: '13px', color: '#1f2937', fontWeight: '500' }}>
                  {report.jenisLokasi || 'Dalam Gedung'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11.5px', color: '#9ca3af', marginBottom: '2px' }}>
                  {(report.jenisLokasi === 'Area Luar' || report.jenisLokasi === 'Luar Gedung') ? 'Area' : 'Nama Gedung'}
                </div>
                <div style={{ fontSize: '13px', color: '#1f2937', fontWeight: '500' }}>
                  {report.namaGedung || (report.lokasi ? report.lokasi.split(' - ')[0] : '-')}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11.5px', color: '#9ca3af', marginBottom: '2px' }}>
                  {(report.jenisLokasi === 'Area Luar' || report.jenisLokasi === 'Luar Gedung') ? 'Lokasi Spesifik' : 'Nama Ruangan'}
                </div>
                <div style={{ fontSize: '13px', color: '#1f2937', fontWeight: '500' }}>
                  {report.namaRuangan || (report.lokasi ? report.lokasi.split(' - ')[1] : '-')}
                </div>
              </div>
            </div>
          </div>

          {/* Deskripsi Masalah */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '6px' }}>
              Deskripsi Masalah
            </div>
            <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.5', margin: 0 }}>
              {report.deskripsi}
            </p>
          </div>

          {/* Bukti Foto Awal Pelapor */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>
                Bukti Foto Masalah
              </div>
              {initialPhotos.length > 0 && (
                <span style={{ fontSize: '11px', color: '#6b7280' }}>
                  Klik foto untuk memperbesar
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {initialPhotos.length > 0 ? (
                initialPhotos.map((imgSrc, idx) => (
                  <img
                    key={idx}
                    src={imgSrc}
                    alt={`Bukti foto ${idx + 1}`}
                    onClick={() => handleOpenPreview(initialPhotos, idx)}
                    title="Klik untuk memperbesar foto"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                ))
              ) : (
                <span style={{ fontSize: '12.5px', color: '#9ca3af', fontStyle: 'italic' }}>
                  Tidak ada lampiran foto
                </span>
              )}
            </div>
          </div>

          {/* Bukti Foto Laporan Selesai */}
          {completionProofs.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#15803d' }}>
                  Bukti Foto Penyelesaian
                </div>
                <span style={{ fontSize: '11px', color: '#6b7280' }}>
                  Klik foto untuk memperbesar
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: report.keteranganBukti ? '8px' : 0 }}>
                {completionProofs.map((imgSrc, idx) => (
                  <img
                    key={idx}
                    src={imgSrc}
                    alt={`Bukti selesai ${idx + 1}`}
                    onClick={() => handleOpenPreview(completionProofs, idx)}
                    title="Klik untuk memperbesar foto penyelesaian"
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      border: '2px solid #86efac',
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                ))}
              </div>
              {report.keteranganBukti && (
                <div
                  style={{
                    fontSize: '12px',
                    color: '#166534',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    marginTop: '8px',
                  }}
                >
                  <strong>Catatan Petugas:</strong> {report.keteranganBukti}
                </div>
              )}
            </div>
          )}

          {/* Timeline Laporan */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '14px' }}>
              Timeline Laporan
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '8px' }}>
              {(report.timeline || [
                { step: 'Laporan terkirim', date: report.tanggalTerkirim || `${report.tanggal}, 14:30 WIB`, completed: true, current: report.status === 'Menunggu Verifikasi' },
                { step: 'Laporan berhasil diverifikasi', date: report.tanggalVerifikasi || '-', completed: report.status === 'Diproses' || report.status === 'Selesai', current: report.status === 'Diproses' },
                { step: 'Laporan dalam proses', date: report.tanggalDiproses || '-', completed: report.status === 'Diproses' || report.status === 'Selesai', current: report.status === 'Diproses' },
                { step: report.status === 'Ditolak' ? 'Laporan ditolak' : 'Laporan selesai', date: report.status === 'Ditolak' ? (report.tanggalDitolak || 'Laporan Ditolak') : (report.tanggalSelesai || '-'), completed: report.status === 'Selesai' || report.status === 'Ditolak', current: report.status === 'Selesai' || report.status === 'Ditolak' }
              ]).map((item, idx, arr) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', position: 'relative' }}>
                  {/* Connecting line */}
                  {idx < arr.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '8px',
                        top: '18px',
                        bottom: '-14px',
                        width: '2px',
                        backgroundColor: item.completed ? '#ba181b' : '#e5e7eb',
                      }}
                    />
                  )}

                  {/* Node icon */}
                  <div style={{ zIndex: 1, marginTop: '2px' }}>
                    {item.current ? (
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: '2px solid #ba181b',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#ba181b',
                          }}
                        />
                      </div>
                    ) : item.completed ? (
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: '#ba181b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontSize: '10px',
                        }}
                      >
                        ✓
                      </div>
                    ) : (
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: '#d1d5db',
                          margin: '3px',
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: item.current ? '700' : '500',
                        color: item.current ? '#111827' : '#4b5563',
                      }}
                    >
                      {item.step}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#6b7280', marginTop: '2px' }}>
                      {item.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Pelapor */}
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>
              Status Pelapor
            </div>
            <div
              style={{
                fontSize: '13.5px',
                fontWeight: '700',
                color: report.isAnonim ? '#ba181b' : '#16a34a',
              }}
            >
              {report.isAnonim ? 'Anonim' : 'Publik (Identitas Terbuka)'}
            </div>
          </div>
        </div>
      </Modal>

      {/* Image Preview Lightbox */}
      <ImagePreviewModal
        isOpen={previewState.isOpen}
        onClose={handleClosePreview}
        images={previewState.images}
        currentIndex={previewState.index}
        onNavigate={handleNavigatePreview}
      />
    </>
  );
};

export default ReportDetailModal;
