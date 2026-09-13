import React from 'react';

const Sidebar = ({ activePage, setActivePage }) => {
  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-header">
          <span className="sidebar-brand">Cares</span>
        </div>
        <div className="sidebar-menu">
          <div
            className={`sidebar-item ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActivePage('dashboard')}
          >
            Dashboard
          </div>
          <div
            className={`sidebar-item ${activePage === 'buat-laporan' ? 'active' : ''}`}
            onClick={() => setActivePage('buat-laporan')}
          >
            Buat Laporan
          </div>
          <div
            className={`sidebar-item ${activePage === 'riwayat-laporan' ? 'active' : ''}`}
            onClick={() => setActivePage('riwayat-laporan')}
          >
            Riwayat Laporan
          </div>
        </div>
      </div>
      <div>
        <div className="sidebar-divider"></div>
        <div className="sidebar-menu">
          <div className="sidebar-item">Panduan</div>
          <div className="sidebar-item">FAQ</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;