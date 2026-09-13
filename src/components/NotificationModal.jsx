import React from 'react';

const NotificationModal = ({ isOpen, onClose, notifications }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Notifikasi</h3>
          <button className="modal-close" onClick={onClose}>X</button>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: '#888888', marginBottom: '8px' }}>Hari ini</div>
          {notifications.map((item) => (
            <div key={item.id} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600' }}>
                <span>{item.title}</span>
                <span style={{ fontSize: '11px', color: '#888888', fontWeight: 'normal' }}>{item.time}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#666666', marginTop: '4px' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;