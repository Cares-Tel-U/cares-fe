import React from 'react';

const MetricCards = ({ reports = [] }) => {
  const total = reports.length || 124;
  const waiting = reports.filter((r) => r.status === 'Menunggu Verifikasi').length || 2;
  const inProgress = reports.filter((r) => r.status === 'Diproses').length || 2;
  const completed = reports.filter((r) => r.status === 'Selesai').length || 110;
  const rejected = reports.filter((r) => r.status === 'Ditolak').length || 10;

  const cards = [
    {
      title: 'Total Laporan Masuk',
      value: total,
      isPrimary: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      )
    },
    {
      title: 'Menunggu Verifikasi',
      value: waiting,
      isPrimary: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          <circle cx="12" cy="14" r="3"></circle>
          <polyline points="12 12 12 14 13 14"></polyline>
        </svg>
      )
    },
    {
      title: 'Laporan Diproses',
      value: inProgress,
      isPrimary: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
          <path d="M5 22h14"></path>
          <path d="M5 2h14"></path>
          <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path>
          <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path>
        </svg>
      )
    },
    {
      title: 'Laporan Selesai',
      value: completed,
      isPrimary: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      )
    },
    {
      title: 'Laporan Ditolak',
      value: rejected,
      isPrimary: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      )
    }
  ];

  return (
    <div className="admin-metric-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '16px' }}>
      {cards.map((card, idx) => (
        <div
          key={idx}
          style={{
            backgroundColor: card.isPrimary ? '#ba181b' : '#ffffff',
            color: card.isPrimary ? '#ffffff' : '#1f2937',
            padding: '22px 24px',
            borderRadius: '16px',
            border: card.isPrimary ? 'none' : '1px solid #e5e7eb',
            boxShadow: card.isPrimary ? '0 4px 12px rgba(186, 24, 27, 0.25)' : '0 1px 3px rgba(0, 0, 0, 0.03)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            minHeight: '135px',
            boxSizing: 'border-box'
          }}
        >
          {card.isPrimary && <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,.08)', pointerEvents: 'none' }} />}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', zIndex: 1 }}>
            <span style={{ fontSize: '13.5px', fontWeight: 600, color: card.isPrimary ? 'rgba(255,255,255,.92)' : '#4b5563', maxWidth: '75%' }}>
              {card.title}
            </span>
            <span style={{ display: 'flex', color: card.isPrimary ? '#fff' : '#374151' }}>{card.icon}</span>
          </div>
          <div style={{ zIndex: 1, marginTop: '12px', fontSize: '44px', fontWeight: 800, lineHeight: 1, letterSpacing: '-1px' }}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricCards;
