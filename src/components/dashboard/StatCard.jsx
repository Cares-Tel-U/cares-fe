import React from 'react';

const StatCard = ({ title, value, icon, isPrimary = false }) => {
  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: isPrimary ? '#ba181b' : '#ffffff',
        color: isPrimary ? '#ffffff' : '#111827',
        border: isPrimary ? 'none' : '1px solid #e5e7eb',
        borderRadius: '16px',
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '135px',
        boxShadow: isPrimary
          ? '0 4px 12px rgba(186, 24, 27, 0.25)'
          : '0 1px 3px rgba(0, 0, 0, 0.03)',
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}
    >
      {/* Decorative curve pattern for primary card */}
      {isPrimary && (
        <div
          style={{
            position: 'absolute',
            right: '-20px',
            top: '-20px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Top row: Title and Icon */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', zIndex: 1 }}>
        <span
          style={{
            fontSize: '13.5px',
            fontWeight: '600',
            color: isPrimary ? 'rgba(255, 255, 255, 0.92)' : '#4b5563',
            maxWidth: '75%'
          }}
        >
          {title}
        </span>
        <div
          style={{
            color: isPrimary ? '#ffffff' : '#374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </div>
      </div>

      {/* Bottom row: Value */}
      <div style={{ zIndex: 1, marginTop: '12px' }}>
        <span
          style={{
            fontSize: '44px',
            fontWeight: '800',
            lineHeight: '1',
            letterSpacing: '-1px'
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
};

export default StatCard;

