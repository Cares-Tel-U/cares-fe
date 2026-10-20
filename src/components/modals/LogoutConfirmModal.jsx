import React from 'react';
import { createPortal } from 'react-dom';

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const modalContent = (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '32px 28px',
          width: '100%',
          maxWidth: '380px',
          textAlign: 'center',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
          animation: 'modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Red Circle Icon at Top */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            border: '1.5px solid #fca5a5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#dc2626"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </div>

        {/* Title & Subtitle */}
        <h3
          style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '6px'
          }}
        >
          Keluar dari Akun?
        </h3>
        <p
          style={{
            fontSize: '13px',
            color: '#6b7280',
            marginBottom: '24px',
            lineHeight: '1.4'
          }}
        >
          Tekan Keluar untuk keluar dari CARES
        </p>

        {/* Action Buttons (Side by Side) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              border: 'none',
              borderRadius: '10px',
              padding: '11px 0',
              fontSize: '13.5px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            style={{
              backgroundColor: '#ba181b',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '11px 0',
              fontSize: '13.5px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9e181c')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ba181b')}
          >
            Keluar
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};

export default LogoutConfirmModal;
