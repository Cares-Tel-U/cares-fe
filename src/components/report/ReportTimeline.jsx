import React from 'react';

const ReportTimeline = ({ report, onLihatBukti }) => {
  // Helper: get date from report.timeline array by step index
  const tl = report.timeline || [];
  const tlDate = (idx) => (tl[idx] && tl[idx].date && tl[idx].date !== '-') ? tl[idx].date : null;

  const steps = [
    { key: 'terkirim',   label: 'Laporan terkirim',              date: report.tanggalTerkirim   || tlDate(0) || report.tanggal || null },
    { key: 'verifikasi', label: 'Laporan berhasil diverifikasi', date: report.tanggalVerifikasi || tlDate(1) || null },
    { key: 'proses',     label: 'Laporan dalam proses',          date: report.tanggalDiproses   || tlDate(2) || null },
    { key: 'selesai',    label: 'Laporan selesai',               date: report.tanggalSelesai    || tlDate(3) || null }
  ];

  // Untuk status Selesai, seluruh 4 langkah aktif
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

export default ReportTimeline;
