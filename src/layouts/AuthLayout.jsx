import React from 'react';
import CaresLogoWhite from '../components/common/CaresLogoWhite';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#ffffff',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      {/* Left Promotional Banner */}
      <div
        style={{
          flex: 1.25,
          background: 'radial-gradient(circle at 60% 50%, #d83035 0%, #ba181b 55%, #8f1214 100%)',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '60px 80px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ zIndex: 1, maxWidth: '460px' }}>
          <div
            style={{
              fontSize: '21px',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#ffffff',
              letterSpacing: '-0.2px'
            }}
          >
            Selamat Datang di
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CaresLogoWhite size="84px" style={{ width: '310px', height: 'auto' }} />
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px 80px',
          backgroundColor: '#ffffff'
        }}
      >
        <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
          {title && (
            <h2
              style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#111827',
                marginBottom: '8px',
                letterSpacing: '-0.5px'
              }}
            >
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              style={{
                fontSize: '13.5px',
                color: '#6b7280',
                marginBottom: '28px',
                lineHeight: '1.5'
              }}
            >
              {subtitle}
            </p>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

