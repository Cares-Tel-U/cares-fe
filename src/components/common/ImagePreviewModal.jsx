import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const ImagePreviewModal = ({
  isOpen = false,
  onClose,
  images = [],
  currentIndex = 0,
  onNavigate,
}) => {
  const currentImage = images[currentIndex] || '';

  const handleKeyDown = useCallback(
    (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && onNavigate && currentIndex < images.length - 1) {
        onNavigate(currentIndex + 1);
      } else if (e.key === 'ArrowLeft' && onNavigate && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      }
    },
    [isOpen, onClose, onNavigate, currentIndex, images.length]
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !currentImage) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pratinjau Foto Bukti"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        backgroundColor: 'rgba(10, 10, 10, 0.82)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '92vw',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Tombol Tutup */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup pratinjau"
          style={{
            position: 'absolute',
            top: '-44px',
            right: 0,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.35)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Gambar Penuh */}
        <img
          src={currentImage}
          alt={`Pratinjau Foto ${currentIndex + 1}`}
          style={{
            maxWidth: '100%',
            maxHeight: '82vh',
            objectFit: 'contain',
            borderRadius: '8px',
            boxShadow: '0 20px 45px rgba(0, 0, 0, 0.5)',
            userSelect: 'none',
          }}
        />

        {/* Indikator dan Kontrol Navigasi (jika ada lebih dari 1 foto) */}
        {images.length > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '14px',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            <button
              type="button"
              disabled={currentIndex <= 0}
              onClick={() => onNavigate && onNavigate(currentIndex - 1)}
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                border: 'none',
                color: currentIndex <= 0 ? 'rgba(255, 255, 255, 0.3)' : '#ffffff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: currentIndex <= 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <span>
              Foto {currentIndex + 1} dari {images.length}
            </span>

            <button
              type="button"
              disabled={currentIndex >= images.length - 1}
              onClick={() => onNavigate && onNavigate(currentIndex + 1)}
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                border: 'none',
                color: currentIndex >= images.length - 1 ? 'rgba(255, 255, 255, 0.3)' : '#ffffff',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: currentIndex >= images.length - 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ImagePreviewModal;
