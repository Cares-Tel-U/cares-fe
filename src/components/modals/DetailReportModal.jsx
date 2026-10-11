import React, { useState } from 'react';
import Modal from '../common/Modal';
import BadgeStatus from '../common/BadgeStatus';

/* ─────────────────────────────────────────────
   Sub-modal: Bukti (photo + timestamp + note)
───────────────────────────────────────────── */
const BuktiModal = ({ proof, onClose }) => {
  if (!proof) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 11000,
        backgroundColor: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'modalFadeIn 0.18s ease-out'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '420px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          animation: 'modalFadeIn 0.2s ease-out'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #f3f4f6'
          }}
        >
          <span style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>Bukti</span>
          <button
            onClick={onClose}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>

        {/* Photo with overlay */}
        <div style={{ position: 'relative' }}>
          <img
            src={proof.foto}
            alt="Bukti perbaikan"
            style={{
              width: '100%',
              maxHeight: '320px',
              objectFit: 'cover',
              display: 'block'
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 100%)',
              padding: '40px 16px 14px',
              color: '#ffffff'
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '4px' }}>
              {proof.waktu}
            </div>
            {proof.keterangan && (
              <>
                <div style={{ fontSize: '11.5px', fontWeight: '600', marginBottom: '2px', opacity: 0.9 }}>
                  Keterangan:
                </div>
                <div style={{ fontSize: '12px', lineHeight: '1.45', opacity: 0.88 }}>
                  {proof.keterangan}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Timeline sub-component
───────────────────────────────────────────── */
const TimelineSection = ({ report, onLihatBukti }) => {
  // Helper: get date from report.timeline array by step index
  const tl = report.timeline || [];
  const tlDate = (idx) => (tl[idx] && tl[idx].date && tl[idx].date !== '-') ? tl[idx].date : null;

  const steps = [
    { key: 'terkirim',   label: 'Laporan terkirim',              date: report.tanggalTerkirim   || tlDate(0) || report.tanggal || null },
    { key: 'verifikasi', label: 'Laporan berhasil diverifikasi', date: report.tanggalVerifikasi || tlDate(1) || null },
    { key: 'proses',     label: 'Laporan dalam proses',          date: report.tanggalDiproses   || tlDate(2) || null },
    { key: 'selesai',    label: 'Laporan selesai',               date: report.tanggalSelesai    || tlDate(3) || null }
  ];

  // For Selesai all 4 steps are active
  const activeCount = 4;


  return (
    <div>
      <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
        Timeline Laporan
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {steps.map((step, idx) => {
          const isActive = idx < activeCount;
          const isLast = idx === steps.length - 1;
          const showBuktiBtn =
            step.key === 'selesai' &&
            report.completionProofs &&
            report.completionProofs.length > 0;

          return (
            <div key={step.key} style={{ display: 'flex', gap: '12px' }}>
              {/* Dot + connector line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    border: `2px solid ${isActive ? '#ba181b' : '#d1d5db'}`,
                    backgroundColor: isActive ? '#ba181b' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: isActive ? '#ffffff' : '#d1d5db'
                    }}
                  />
                </div>
                {!isLast && (
                  <div
                    style={{
                      width: '2px',
                      flex: 1,
                      minHeight: '20px',
                      backgroundColor: idx < activeCount - 1 ? '#ba181b' : '#e5e7eb',
                      margin: '3px 0'
                    }}
                  />
                )}
              </div>

              {/* Text + button */}
              <div
                style={{
                  paddingBottom: isLast ? 0 : '14px',
                  flex: 1,
                  display: 'flex',
                  alignItems: showBuktiBtn ? 'center' : 'flex-start',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: isActive ? '#111827' : '#9ca3af'
                    }}
                  >
                    {step.label}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#6b7280', marginTop: '2px' }}>
                    {step.date || (isActive ? '-' : '')}
                  </div>
                </div>

                {showBuktiBtn && (
                  <button
                    type="button"
                    onClick={onLihatBukti}
                    style={{
                      flexShrink: 0,
                      border: '1px solid #e5e7eb',
                      backgroundColor: '#ffffff',
                      color: '#374151',
                      borderRadius: '7px',
                      padding: '5px 12px',
                      fontSize: '11.5px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
                      e.currentTarget.style.borderColor = '#ba181b';
                      e.currentTarget.style.color = '#ba181b';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.color = '#374151';
                    }}
                  >
                    Lihat bukti
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DetailReportModal = ({
  report,
  isOpen = true,
  onClose,
  onVerify,
  onOpenReject,
  onNavigateToResponse
}) => {
  const [showBuktiModal, setShowBuktiModal] = useState(false);

  if (!report) return null;

  const photoList = report.foto && report.foto.length > 0 ? report.foto : [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=300&q=80'
  ];

  const proofData = report.completionProofs && report.completionProofs.length > 0
    ? {
      foto: report.completionProofs[0],
      waktu: report.tanggalSelesai || '05-09-2026 10:12 WIB',
      keterangan: report.keteranganBukti || report.completionNote || `Pengerjaan perbaikan di ${report.lokasi || 'lokasi'}`
    }
    : null;

  const isSelesai = report.status === 'Selesai';

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
                <div style={{ fontSize: '11.5px', color: '#9ca3af', marginBottom: '2px' }}>Nama Gedung</div>
                <div style={{ fontSize: '13px', color: '#1f2937', fontWeight: '500' }}>
                  {report.namaGedung || report.gedung || (report.lokasi ? report.lokasi.split(' - ')[0] : 'Gedung A')}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '11.5px', color: '#9ca3af', marginBottom: '2px' }}>Nama Ruangan</div>
                <div style={{ fontSize: '13px', color: '#1f2937', fontWeight: '500' }}>
                  {report.namaRuangan || report.ruangan || (report.lokasi ? report.lokasi.split(' - ')[1] : 'KU3.02.12')}
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
              {report.deskripsi || 'AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala'}
            </p>
          </div>

          {/* Bukti Foto */}
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              Bukti Foto
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {photoList.map((imgSrc, idx) => (
                <img
                  key={idx}
                  src={imgSrc}
                  alt={`Bukti foto ${idx + 1}`}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                    border: '1px solid #e5e7eb'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Timeline Laporan — hanya untuk status Selesai */}
          {isSelesai && (
            <TimelineSection
              report={report}
              onLihatBukti={() => setShowBuktiModal(true)}
            />
          )}

          {/* Pelapor */}
          <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', fontWeight: '500' }}>
              Pelapor
            </div>
            <div
              style={{
                fontSize: '13.5px',
                fontWeight: '700',
                color: report.isAnonim ? '#ba181b' : '#111827'
              }}
            >
              {report.isAnonim ? 'Anonim' : (report.pelapor || 'Publik (Identitas Terbuka)')}
            </div>
          </div>

          {/* Detail Khusus Status: Menunggu Verifikasi */}
          {report.status === 'Menunggu Verifikasi' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  backgroundColor: '#fff5f5',
                  border: '1px solid #fca5a5',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#dc2626' }}>
                    Perhatian
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#b91c1c', marginTop: '2px', lineHeight: '1.4' }}>
                    Verifikasi ini akan memberitahu pelapor bahwa laporan telah diterima dan sedang dalam antrean pengerjaan
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '4px' }}>
                <button
                  type="button"
                  onClick={onOpenReject}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '11px 0',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                >
                  Tolak Laporan
                </button>
                <button
                  type="button"
                  onClick={onVerify}
                  style={{
                    backgroundColor: '#ba181b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '11px 0',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9e181c')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ba181b')}
                >
                  Verifikasi Laporan
                </button>
              </div>
            </div>
          )}

          {/* Detail Khusus Status: Diproses */}
          {report.status === 'Diproses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: '700', color: '#1d4ed8' }}>
                    Dalam Pengerjaan
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#1e40af', marginTop: '2px', lineHeight: '1.4' }}>
                    Laporan sedang dalam proses penanganan. Anda dapat merespons dan menyelesaikan laporan dengan mengunggah bukti perbaikan fasilitas.
                  </div>
                </div>
              </div>

              {onNavigateToResponse && (
                <div style={{ paddingTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => onNavigateToResponse(report)}
                    style={{
                      width: '100%',
                      backgroundColor: '#ba181b',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 0',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9e181c')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ba181b')}
                  >
                    <span>Laporan Selesai</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Selesai: no extra block needed — Timeline handles it above */}

          {/* Detail Khusus Status: Ditolak */}
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
                  borderRadius: '10px',
                  padding: '12px 14px',
                  lineHeight: '1.5',
                  margin: 0
                }}
              >
                {report.rejectReason || 'Informasi lokasi kurang jelas dan bukti tidak memadai.'}
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Bukti sub-modal — rendered outside main Modal for correct z-index */}
      {showBuktiModal && proofData && (
        <BuktiModal proof={proofData} onClose={() => setShowBuktiModal(false)} />
      )}
    </>
  );
};

export default DetailReportModal;