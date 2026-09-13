import React from 'react';

const Topbar = ({ title, subtitle, user, onOpenNotification, onLogout }) => {
  return (
    <div className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        <div className="topbar-subtitle">{subtitle}</div>
      </div>
      <div className="topbar-actions">
        <button className="btn-notification" onClick={onOpenNotification}>
          Notifikasi
        </button>
        <div className="user-profile" onClick={onLogout}>
          <img
            src="https://via.placeholder.com/40"
            alt="User"
            className="avatar"
          />
          <span style={{ fontSize: '13px', fontWeight: '500' }}>{user.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;