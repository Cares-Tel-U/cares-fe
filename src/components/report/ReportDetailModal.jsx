import React from 'react';
import Modal from '../common/Modal';
import BadgeStatus from '../common/BadgeStatus';

const ReportDetailModal = ({ isOpen, onClose, report }) => {
  if (!report) return null;

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
                {report.namaGedung || report.lokasi.split(' - ')[0] || '-'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11.5px', color: '#9ca3af', marginBottom: '2px' }}>Nama Ruangan</div>
              <div style={{ fontSize: '13px', color: '#1f2937', fontWeight: '500' }}>
                {report.namaRuangan || report.lokasi.split(' - ')[1] || '-'}
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

        {/* Bukti Foto */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            Bukti Foto
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {(report.foto && report.foto.length > 0 ? report.foto : [
              'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=300&q=80',
              'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=300&q=80'
            ]).map((imgSrc, idx) => (
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

        {/* Timeline Laporan */}
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '14px' }}>
            Timeline Laporan
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', paddingLeft: '8px' }}>
            {(report.timeline || [
              { step: 'Laporan terkirim', date: `${report.tanggal}, 14:30 WIB`, completed: true, current: true },
              { step: 'Laporan berhasil diverifikasi', date: '-', completed: false, current: false },
              { step: 'Laporan dalam proses', date: '-', completed: false, current: false },
              { step: 'Laporan selesai', date: '-', completed: false, current: false }
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
                      backgroundColor: item.completed ? '#ba181b' : '#e5e7eb'
                    }}
                  />
                )}

                {/* Node icon */}
                <div style={{ zIndex: 1, marginTop: '2px' }}>
                  {item.current ? (
                    /* Red Bullseye Ring Icon matching Screenshot 3 */
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: '2px solid #ba181b',
                        backgroundColor: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#ba181b'
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
                        fontSize: '10px'
                      }}
                    >
                      ✓
                    </div>
                  ) : (
                    /* Gray dot */
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: '#d1d5db',
                        margin: '3px'
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
                      color: item.current ? '#111827' : '#4b5563'
                    }}
                  >
                    {item.step}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#9ca3af', marginTop: '2px' }}>
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
              color: report.isAnonim ? '#ba181b' : '#16a34a'
            }}
          >
            {report.isAnonim ? 'Anonim' : 'Publik (Identitas Terbuka)'}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReportDetailModal;

