import React from 'react';

const IdentitySection = ({ user, isAnonim, onToggleAnonim }) => {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        overflow: 'hidden',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
      }}
    >
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', padding: '18px 20px', margin: 0, borderBottom: '1px solid #e5e7eb' }}>
        Identitas Pelapor
      </h3>

      <div style={{ display: 'grid', gap: '10px', padding: '16px 20px 18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '132px minmax(0, 1fr)', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '13px', color: '#4b5563', fontWeight: '500' }}>Nama Pelapor</div>
          <div style={{ fontSize: '13px', color: '#9ca3af', fontWeight: '500', overflowWrap: 'anywhere' }}>
            {user?.name || 'Amba Ngawi'}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '132px minmax(0, 1fr)', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '13px', color: '#4b5563', fontWeight: '500' }}>Email Pelapor</div>
          <div style={{ fontSize: '13px', color: '#9ca3af', fontWeight: '500', overflowWrap: 'anywhere' }}>
            {user?.email || 'ambangawi@telkomuniversity.ac.id'}
          </div>
        </div>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            color: '#6b7280',
            userSelect: 'none'
          }}
        >
          <input
            type="checkbox"
            checked={isAnonim}
            onChange={(e) => onToggleAnonim(e.target.checked)}
            style={{
              width: '16px',
              height: '16px',
              accentColor: '#ba181b',
              cursor: 'pointer'
            }}
          />
          <span>Sembunyikan identitas pelapor</span>
        </label>
      </div>
    </div>
  );
};

export default IdentitySection;
