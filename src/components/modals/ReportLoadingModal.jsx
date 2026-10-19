import React from 'react';
import { createPortal } from 'react-dom';

const ReportLoadingModal = ({
  isOpen,
  text = 'loading to laporan berhasil',
  card = true
}) => {
  if (!isOpen) return null;

  const spinnerContent = (
    <>
      {/* Teks Petunjuk Loading */}
      <p
        style={{
          margin: '0 0 24px 0',
          fontSize: '14.5px',
          fontWeight: 600,
          color: '#374151',
          letterSpacing: '-0.2px',
          textAlign: 'center',
          userSelect: 'none'
        }}
      >
        {text}
      </p>

      {/* Circular Ring Spinner */}
      <div
        style={{
          width: '110px',
          height: '110px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <svg
          width="110"
          height="110"
          viewBox="0 0 120 120"
          style={{
            animation: 'spin 1s linear infinite',
            transformOrigin: 'center center'
          }}
        >
          <defs>
            <linearGradient id="caresLoadingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e8052b" stopOpacity="1" />
              <stop offset="60%" stopColor="#e8052b" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#e8052b" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Background Track Circle */}
          <circle
            cx="60"
            cy="60"
            r="46"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="13"
          />

          {/* Active Animated Gradient Arc */}
          <circle
            cx="60"
            cy="60"
            r="46"
            fill="none"
            stroke="url(#caresLoadingGrad)"
            strokeWidth="13"
            strokeDasharray="289"
            strokeDashoffset="138"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </>
  );

  const modalNode = (
    <div
      role="status"
      aria-live="polite"
      aria-label={text}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100002,
        backgroundColor: card ? 'rgba(0, 0, 0, 0.4)' : 'rgba(248, 250, 252, 0.94)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      {card ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '36px 32px',
            width: '100%',
            maxWidth: '340px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
            border: '1px solid #f3f4f6',
            animation: 'modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {spinnerContent}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {spinnerContent}
        </div>
      )}
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};

export default ReportLoadingModal;
