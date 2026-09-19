import React from 'react';
import { NavLink } from 'react-router-dom';
import CaresLogoWhite from '../common/CaresLogoWhite';

const Icon = ({ children, fill = 'none' }) => <svg width="18" height="18" viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;

const AdminSidebar = ({ isCollapsed, onToggleCollapse }) => {
  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <Icon fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Icon> },
    { label: 'Daftar Laporan', path: '/admin/daftar-laporan', icon: <Icon><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h6" /></Icon> },
    { label: 'Data Statistik', path: '/admin/data-statistik', icon: <Icon><path d="M4 19V5M4 19h16" /><path d="m7 15 4-4 3 2 4-5" /></Icon> }
  ];
  const bottomItems = [
    { label: 'Panduan', path: '/panduan', icon: <Icon><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></Icon> },
    { label: 'FAQ', path: '/faq', icon: <Icon><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.7 2.7 0 1 1 4.7 1.8c-.9.9-2.2 1.4-2.2 3" /><path d="M12 17h.01" /></Icon> }
  ];
  const menuStyle = (isActive) => ({ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'flex-start', gap: '12px', padding: isCollapsed ? '12px' : '12px 16px', borderRadius: '12px', background: isActive ? '#FFFFFF' : 'transparent', color: isActive ? '#E11D48' : '#FFFFFF', fontSize: '14px', fontWeight: isActive ? 700 : 500, textDecoration: 'none', opacity: isActive ? 1 : 0.9, transition: 'all .15s ease' });
  const hover = (event, isActive, entering) => {
    if (!isActive) event.currentTarget.style.background = entering ? 'rgba(255,255,255,.12)' : 'transparent';
    event.currentTarget.style.opacity = entering || isActive ? '1' : '.9';
  };
  const renderItems = (items) => items.map((item) => <NavLink key={item.path} to={item.path} title={isCollapsed ? item.label : undefined} style={({ isActive }) => menuStyle(isActive)} onMouseEnter={(event) => hover(event, event.currentTarget.getAttribute('aria-current') === 'page', true)} onMouseLeave={(event) => hover(event, event.currentTarget.getAttribute('aria-current') === 'page', false)}>{item.icon}{!isCollapsed && <span>{item.label}</span>}</NavLink>);

  return <aside className="admin-sidebar" style={{ width: isCollapsed ? '80px' : '260px', minWidth: isCollapsed ? '80px' : '260px', minHeight: '100vh', alignSelf: 'stretch', background: '#ba181b', color: '#FFFFFF', borderTopRightRadius: '24px', borderBottomRightRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 16px', transition: 'width .25s cubic-bezier(.4,0,.2,1), min-width .25s cubic-bezier(.4,0,.2,1)', zIndex: 40, boxShadow: '4px 0 15px rgba(0,0,0,.04)', boxSizing: 'border-box', flexShrink: 0 }}>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', marginBottom: '32px', padding: '0 8px' }}>
        {!isCollapsed ? <div style={{ display: 'flex', alignItems: 'center', maxWidth: '170px' }}><CaresLogoWhite size="42px" /></div> : <img src="/normal logo.svg" alt="Cares" style={{ width: '32px', height: '32px', filter: 'brightness(0) invert(1)' }} />}
        <button type="button" onClick={onToggleCollapse} title={isCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'} style={{ background: 'transparent', border: 0, color: '#FFFFFF', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', opacity: .85 }} onMouseEnter={(event) => { event.currentTarget.style.opacity = '1'; }} onMouseLeave={(event) => { event.currentTarget.style.opacity = '.85'; }}><Icon><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18" /></Icon></button>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{renderItems(navItems)}</nav>
    </div>
    <div style={{ marginTop: '24px' }}>
      <div style={{ height: 1, background: 'rgba(255,255,255,.2)', margin: '20px 8px' }} />
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{renderItems(bottomItems)}</nav>
    </div>
  </aside>;
};

export default AdminSidebar;
