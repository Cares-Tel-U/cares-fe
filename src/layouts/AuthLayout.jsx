import React from 'react';
import CaresLogoWhite from '../components/common/CaresLogoWhite';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-container">
      {/* Left Promotional Banner - Hanya Desktop */}
      <div className="auth-desktop-banner">
        <div className="auth-desktop-banner-content">
          <div className="auth-desktop-greeting">
            Selamat Datang di
          </div>
          <div className="auth-desktop-logo-wrap">
            <CaresLogoWhite size="84px" style={{ width: '310px', height: 'auto' }} />
          </div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="auth-form-section">
        <div className="auth-form-wrapper">
          {/* Mobile Brand Header - Hanya Tampil di Mobile/Tablet <= 900px */}
          <div className="auth-mobile-header">
            <div className="auth-mobile-logo-row">
              <img
                src="/normal logo.svg"
                alt="CARES Logo"
                className="auth-mobile-logo"
              />
              <div className="auth-mobile-brand">
                <span className="auth-mobile-brand-title">CARES</span>
                <span className="auth-mobile-brand-tagline">Bersama Menjaga Fasilitas Kampus</span>
              </div>
            </div>
          </div>

          {title && (
            <h2 className="auth-form-title">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="auth-form-subtitle">
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
