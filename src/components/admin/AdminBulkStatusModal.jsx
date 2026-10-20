import React from 'react';
import { createPortal } from 'react-dom';

const AdminBulkStatusModal = ({
  isOpen,
  selectedCount,
  onClose,
  onConfirm,
}) => {
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
        {/* Red Circle Icon with reload arrows */}
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
            margin: '0 auto 16px auto',
            color: '#dc2626'
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>

        <h3
          style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: '6px'
          }}
        >
          Update Status Laporan?
        </h3>
        <p
          style={{
            fontSize: '13px',
            color: '#6b7280',
            marginBottom: '24px',
            lineHeight: '1.4'
          }}
        >
          Status {selectedCount} laporan terpilih akan diupdate
        </p>

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
            Update
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};

export default AdminBulkStatusModal;
