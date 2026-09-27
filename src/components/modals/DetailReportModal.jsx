import React from 'react';
import Modal from '../common/Modal';
import BadgeStatus from '../common/BadgeStatus';

const DetailReportModal = ({
  report,
  isOpen = true,
  onClose,
  onVerify,
  onOpenReject,
  onNavigateToResponse
}) => {
  if (!report) return null;

  const photoList = report.foto && report.foto.length > 0 ? report.foto : [
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=300&q=80'
  ];

  return (
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
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
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
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
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
                  <span>Tanggapi / Selesaikan Laporan</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Detail Khusus Status: Selesai */}
        {report.status === 'Selesai' && report.completionProofs && report.completionProofs.length > 0 && (
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              Bukti Perbaikan Fasilitas
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {report.completionProofs.map((imgSrc, idx) => (
                <img
                  key={idx}
                  src={imgSrc}
                  alt={`Bukti perbaikan ${idx + 1}`}
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
        )}

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
  );
};

export default DetailReportModal;