import React from 'react';
import Modal from '../common/Modal';

const NotificationCenter = ({ isOpen, onClose, notifications = [], onMarkAllAsRead }) => {
  const todayNotifs = notifications.filter((n) => n.category === 'Hari ini');
  const previousNotifs = notifications.filter((n) => n.category === 'Sebelumnya');
  const hasUnread = notifications.some((n) => n.isUnread);

  const renderFormattedDesc = (item) => {
    let text = item.desc;
    if (item.location && text.includes(item.location)) {
      const parts = text.split(item.location);
      return (
        <>
          {parts[0]}
          <strong style={{ color: '#111827', fontWeight: '700' }}>{item.location}</strong>
          {parts[1]}
        </>
      );
    }
    if (item.statusText && text.includes(item.statusText)) {
      const parts = text.split(item.statusText);
      return (
        <>
          {parts[0]}
          <strong style={{ color: '#111827', fontWeight: '700' }}>{item.statusText}</strong>
          {parts[1]}
        </>
      );
    }
    return text;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Notifikasi" maxWidth="480px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {hasUnread && onMarkAllAsRead && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-8px' }}>
            <button
              type="button"
              onClick={onMarkAllAsRead}
              style={{
                background: 'none',
                border: 'none',
                color: '#ba181b',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px'
              }}
            >
              Tandai semua telah dibaca
            </button>
          </div>
        )}

        {/* Section: Hari ini */}
        {todayNotifs.length > 0 && (
          <div>
            <div
              style={{
                fontSize: '12.5px',
                fontWeight: '700',
                color: '#6b7280',
                marginBottom: '10px'
              }}
            >
              Hari ini
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {todayNotifs.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: item.isUnread ? '#fff1f2' : '#ffffff',
                    border: item.isUnread ? '1px solid #fecdd3' : '1px solid #f3f4f6',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.15s ease',
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {item.isUnread && (
                        <span
                          style={{
                            width: '7px',
                            height: '7px',
                            backgroundColor: '#e11d48',
                            borderRadius: '50%',
                            display: 'inline-block'
                          }}
                        />
                      )}
                      <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#111827' }}>
                        {item.title}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '400' }}>
                      {item.time}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '12.5px',
                      color: '#4b5563',
                      lineHeight: '1.45',
                      margin: 0
                    }}
                  >
                    {renderFormattedDesc(item)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section: Sebelumnya */}
        {previousNotifs.length > 0 && (
          <div>
            <div
              style={{
                fontSize: '12.5px',
                fontWeight: '700',
                color: '#6b7280',
                marginBottom: '10px'
              }}
            >
              Sebelumnya
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {previousNotifs.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: item.isUnread ? '#fff1f2' : '#ffffff',
                    border: item.isUnread ? '1px solid #fecdd3' : '1px solid #f3f4f6',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {item.isUnread && (
                        <span
                          style={{
                            width: '7px',
                            height: '7px',
                            backgroundColor: '#e11d48',
                            borderRadius: '50%',
                            display: 'inline-block'
                          }}
                        />
                      )}
                      <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#111827' }}>
                        {item.title}
                      </span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '400' }}>
                      {item.time}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '12.5px',
                      color: '#4b5563',
                      lineHeight: '1.45',
                      margin: 0
                    }}
                  >
                    {renderFormattedDesc(item)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NotificationCenter;

