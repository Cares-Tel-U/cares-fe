import React, { useRef, useEffect } from 'react';

const NotificationDropdown = ({
  isOpen,
  onToggle,
  onClose,
  unreadCount = 0,
  notifications = [],
  isNotifActive = true,
  onMarkAllAsRead,
  onNotificationClick,
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const renderFormattedDesc = (item) => {
    const text = item.desc || '';
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

  const todayNotifs = notifications.filter((n) => n.category === 'Hari ini');
  const previousNotifs = notifications.filter((n) => n.category !== 'Hari ini');

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '9999px',
          padding: '8px 18px',
          fontSize: '13px',
          fontWeight: '600',
          color: '#374151',
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f9fafb';
          e.currentTarget.style.borderColor = '#d1d5db';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#ffffff';
          e.currentTarget.style.borderColor = '#e5e7eb';
        }}
      >
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <span>Notifikasi</span>

        {isNotifActive && unreadCount > 0 && (
          <span
            style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#dc2626',
              borderRadius: '50%',
              display: 'inline-block'
            }}
          />
        )}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
            width: 'min(380px, calc(100vw - 28px))',
            maxWidth: 'calc(100vw - 28px)',
            zIndex: 80,
            padding: '18px 20px',
            maxHeight: '480px',
            overflowY: 'auto',
            animation: 'modalFadeIn 0.15s ease-out'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px'
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#111827', margin: 0 }}>
              Notifikasi
            </h3>
            <button
              type="button"
              onClick={onMarkAllAsRead}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '12px',
                color: '#6b7280',
                cursor: 'pointer',
                padding: 0
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#111827')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
            >
              Tandai telah dibaca
            </button>
          </div>

          {!isNotifActive && (
            <div
              data-testid="notification-inactive-banner"
              style={{
                backgroundColor: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px',
                marginBottom: '12px',
                fontSize: '11.5px',
                color: '#4b5563',
                lineHeight: '1.4'
              }}
            >
              Pemberitahuan sedang dinonaktifkan. Anda dapat mengaktifkannya kembali melalui menu profil.
            </div>
          )}

          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: '#9ca3af', fontSize: '13px' }}>
              Tidak ada notifikasi
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {todayNotifs.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', marginBottom: '8px' }}>
                    Hari ini
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {todayNotifs.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onNotificationClick(item)}
                        style={{
                          backgroundColor: item.isUnread ? '#fff1f2' : '#f9fafb',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          border: item.isUnread ? '1px solid #fecdd3' : '1px solid #f3f4f6',
                          transition: 'background-color 0.15s ease',
                          cursor: item.isUnread ? 'pointer' : 'default'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {item.isUnread && (
                              <span style={{ width: '6px', height: '6px', backgroundColor: '#e11d48', borderRadius: '50%' }} />
                            )}
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>
                              {item.title}
                            </span>
                          </div>
                          <span style={{ fontSize: '11px', color: '#9ca3af' }}>{item.time}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.45', margin: 0 }}>
                          {renderFormattedDesc(item)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previousNotifs.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#6b7280', marginBottom: '8px' }}>
                    Sebelumnya
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {previousNotifs.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onNotificationClick(item)}
                        style={{
                          backgroundColor: item.isUnread ? '#fff1f2' : '#f9fafb',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          border: item.isUnread ? '1px solid #fecdd3' : '1px solid #f3f4f6',
                          transition: 'background-color 0.15s ease',
                          cursor: item.isUnread ? 'pointer' : 'default'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {item.isUnread && (
                              <span style={{ width: '6px', height: '6px', backgroundColor: '#e11d48', borderRadius: '50%' }} />
                            )}
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>
                              {item.title}
                            </span>
                          </div>
                          <span style={{ fontSize: '11px', color: '#9ca3af' }}>{item.time}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.45', margin: 0 }}>
                          {renderFormattedDesc(item)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
