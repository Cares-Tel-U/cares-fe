import React from 'react';

const ImportantInfoCard = () => {
  return (
    <div
      style={{
        backgroundColor: '#ba181b',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 12px rgba(186, 24, 27, 0.2)',
        height: 'fit-content'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <h4 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>
          Informasi Penting
        </h4>
      </div>

      <ul
        style={{
          margin: 0,
          paddingLeft: '20px',
          fontSize: '13px',
          lineHeight: '1.7',
          opacity: 0.95,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <li>Laporan akan diverifikasi oleh admin sebelum ditindaklanjuti oleh teknisi.</li>
        <li>Anda dapat memantau perkembangan laporan melalui menu Riwayat Laporan.</li>
        <li>Identitas dapat disembunyikan saat membuat laporan jika Anda menginginkan privasi.</li>
        <li>Laporan yang tidak sesuai atau tidak dapat diverifikasi dapat ditolak dengan alasan yang tertera.</li>
      </ul>
    </div>
  );
};

export default ImportantInfoCard;

