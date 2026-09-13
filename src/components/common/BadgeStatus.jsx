import React from 'react';

const BadgeStatus = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Menunggu Verifikasi':
      case 'Menunggu':
        return {
          bg: '#FEF9C3',
          border: '#FDE047',
          color: '#CA8A04'
        };
      case 'Diproses':
        return {
          bg: '#E0F2FE',
          border: '#7DD3FC',
          color: '#0284C7'
        };
      case 'Selesai':
        return {
          bg: '#DCFCE7',
          border: '#86EFAC',
          color: '#16A34A'
        };
      case 'Ditolak':
        return {
          bg: '#FEE2E2',
          border: '#FCA5A5',
          color: '#DC2626'
        };
      default:
        return {
          bg: '#F3F4F6',
          border: '#E5E7EB',
          color: '#4B5563'
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        color: style.color,
        borderRadius: '9999px',
        padding: '3px 12px',
        fontSize: '11.5px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        lineHeight: '1.4'
      }}
    >
      {status}
    </span>
  );
};

export default BadgeStatus;

