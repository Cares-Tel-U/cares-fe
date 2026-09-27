import React from 'react';

const NotificationModal = ({ isOpen, onClose, notifications = [], onMarkAllAsRead }) => {
  if (!isOpen) return null;

  const groupedNotifications = notifications.reduce((acc, item) => {
    const category = item.category || 'Hari ini';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const renderFormattedDesc = (item) => {
    let text = item.desc;
    if (item.location && text.includes(item.location)) {
      const parts = text.split(item.location);
      return (
        <>
          {parts[0]}
          <strong>{item.location}</strong>
          {parts[1]}
        </>
      );
    }
    if (item.statusText && text.includes(item.statusText)) {
      const parts = text.split(item.statusText);
      return (
        <>
          {parts[0]}
          <strong>{item.statusText}</strong>
          {parts[1]}
        </>
      );
    }
    return text;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Notifikasi</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {onMarkAllAsRead && (
              <button 
                onClick={onMarkAllAsRead} 
                style={{ background: 'none', border: 'none', color: '#888888', fontSize: '12px', cursor: 'pointer' }}
              >
                Tandai telah dibaca
              </button>
            )}
            <button className="modal-close" onClick={onClose}>X</button>
          </div>
        </div>

        <div className="modal-body" style={{ overflowY: 'auto', maxHeight: '60vh' }}>
          {Object.keys(groupedNotifications).map((category) => (
            <div key={category} style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', color: '#888888', marginBottom: '8px', fontWeight: '600' }}>
                {category}
              </div>

              {groupedNotifications[category].map((item) => (
                <div 
                  key={item.id} 
                  style={{ 
                    marginBottom: '10px', 
                    padding: '10px 12px', 
                    borderRadius: '8px',
                    backgroundColor: item.isUnread ? '#FFF0F1' : 'transparent',
                    borderBottom: item.isUnread ? 'none' : '1px solid #f0f0f0' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {item.isUnread && (
                        <span style={{ width: '6px', height: '6px', backgroundColor: '#E52535', borderRadius: '50%' }} />
                      )}
                      <span>{item.title}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#888888', fontWeight: 'normal' }}>{item.time}</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666666', marginTop: '4px', lineHeight: '1.4' }}>
                    {renderFormattedDesc(item)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;