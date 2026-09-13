import React from 'react';
import Modal from '../common/Modal';

const NotificationCenter = ({ isOpen, onClose, notifications = [] }) => {
  const todayNotifs = notifications.filter((n) => n.category === 'Hari ini');
  const previousNotifs = notifications.filter((n) => n.category === 'Sebelumnya');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Notifikasi" maxWidth="480px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Section: Hari ini */}
        <div>
          <div
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '12px'
            }}
          >
            Hari ini
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {todayNotifs.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #f3f4f6',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
                  transition: 'background-color 0.15s ease'
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
                  <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#111827' }}>
                    {item.title}
                  </span>
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
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Sebelumnya */}
        {previousNotifs.length > 0 && (
          <div>
            <div
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px'
              }}
            >
              Sebelumnya
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {previousNotifs.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #f3f4f6',
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
                    <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#111827' }}>
                      {item.title}
                    </span>
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
                    {item.desc}
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

