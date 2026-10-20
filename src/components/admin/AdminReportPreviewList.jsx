import React from 'react';

const AdminReportPreviewList = ({
  activeReports = [],
  onRemoveReport,
}) => {
  return (
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
          const photoList = report.foto && report.foto.length > 0 ? report.foto : [];

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
                  onClick={() => onRemoveReport(report.id)}
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
                  {report.deskripsi || '-'}
                </div>
              </div>

              {/* Bukti Foto */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: '700', color: '#374151', marginBottom: '6px' }}>
                  Bukti Foto
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {photoList.length > 0 ? (
                    photoList.map((imgSrc, imgIdx) => (
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
                    ))
                  ) : (
                    <span style={{ fontSize: '11.5px', color: '#9ca3af', fontStyle: 'italic' }}>
                      Tidak ada lampiran foto
                    </span>
                  )}
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
  );
};

export default AdminReportPreviewList;
