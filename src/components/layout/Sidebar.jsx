import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CaresLogoWhite from '../common/CaresLogoWhite';

const Sidebar = ({ isCollapsed, onToggleCollapse, onOpenGuide, isGuideOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
        </svg>
      )
    },
    {
      label: 'Buat Laporan',
      path: '/buat-laporan',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="12" y1="18" x2="12" y2="12"></line>
          <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
      )
    },
    {
      label: 'Riwayat Laporan',
      path: '/riwayat-laporan',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    }
  ];

  const bottomItems = [
    {
      label: 'Panduan',
      path: '/panduan',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      )
    },
    {
      label: 'FAQ',
      path: '/faq',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      )
    }
  ];

  return (
    <aside
      className="app-sidebar"
      style={{
        width: isCollapsed ? '80px' : '260px',
        minWidth: isCollapsed ? '80px' : '260px',
        backgroundColor: '#ba181b',
        color: '#ffffff',
        borderTopRightRadius: '24px',
        borderBottomRightRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 40,
        boxShadow: '4px 0 15px rgba(0, 0, 0, 0.04)',
        minHeight: '100vh',
        boxSizing: 'border-box'
      }}
    >
      {/* Top Header & Brand */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            marginBottom: '32px',
            padding: '0 8px'
          }}
        >
          {!isCollapsed ? (
            <div style={{ display: 'flex', alignItems: 'center', maxWidth: '170px' }}>
              <CaresLogoWhite size="42px" />
            </div>
          ) : (
            <img
              src="/normal logo.svg"
              alt="Cares"
              style={{
                width: '32px',
                height: '32px',
                filter: 'brightness(0) invert(1)'
              }}
            />
          )}

          {/* Toggle sidebar button */}
          <button
            type="button"
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.85,
              transition: 'opacity 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.85')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="3" x2="9" y2="21"></line>
            </svg>
          </button>
        </div>

        {/* Main Navigation Menu */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: isCollapsed ? '12px' : '12px 16px',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#f3f4f6' : 'transparent',
                  color: isActive ? '#ba181b' : '#ffffff',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '14px',
                  transition: 'all 0.15s ease-in-out',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Divider & Help/FAQ */}
      <div>
        <div
          style={{
            height: '1px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            margin: '20px 8px'
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {bottomItems.map((item) => {
            const isActive = currentPath === item.path || (item.path === '/panduan' && isGuideOpen);
            return (
              <div
                key={item.path}
                onClick={() => item.path === '/panduan' ? onOpenGuide() : navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: isCollapsed ? '12px' : '12px 16px',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#ba181b' : '#ffffff',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '14px',
                  transition: 'all 0.15s ease-in-out',
                  userSelect: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

