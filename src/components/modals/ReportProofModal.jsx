import React from 'react';
import { createPortal } from 'react-dom';

const ReportProofModal = ({ proof, onClose }) => {
  if (!proof) return null;

  const content = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100001,
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

  return typeof document !== 'undefined' ? createPortal(content, document.body) : content;
};

export default ReportProofModal;
