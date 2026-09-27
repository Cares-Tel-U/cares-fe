import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({
  title,
  subtitle,
  user,
  onOpenNotification,
  unreadCount = 0,
  notifications = [],
  onMarkAllAsRead,
  onLogout
}) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  const handleMarkAll = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };

  const renderFormattedDesc = (item) => {
    let text = item.desc || '';
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

  // Group notifications into 'Hari ini' and 'Sebelumnya'
  const todayNotifs = notifications.filter((n) => n.category === 'Hari ini');
  const previousNotifs = notifications.filter((n) => n.category !== 'Hari ini');

  return (
    <header
      className="app-header"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '28px',
        paddingBottom: '4px'
      }}
    >
      {/* Title & Subtitle */}
      <div>
        <h2
          style={{
            fontSize: '26px',
            fontWeight: '800',
            color: '#111827',
            margin: '0 0 4px 0',
            letterSpacing: '-0.4px'
          }}
        >
          {title}
        </h2>
        <p
          style={{
            fontSize: '13.5px',
            color: '#6b7280',
            margin: 0,
            fontWeight: '400'
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notifikasi Button with Anchored Popover */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => {
              setIsNotifOpen((prev) => !prev);
              if (onOpenNotification) onOpenNotification();
            }}
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

            {unreadCount > 0 && (
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

          {/* Popover Dropdown matching Screenshot 5 */}
          {isNotifOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
                border: '1px solid #f3f4f6',
                width: '380px',
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
                  onClick={handleMarkAll}
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
                            style={{
                              backgroundColor: item.isUnread ? '#fff1f2' : '#f9fafb',
                              borderRadius: '10px',
                              padding: '12px 14px',
                              border: item.isUnread ? '1px solid #fecdd3' : '1px solid #f3f4f6',
                              transition: 'background-color 0.15s ease'
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
                            style={{
                              backgroundColor: item.isUnread ? '#fff1f2' : '#f9fafb',
                              borderRadius: '10px',
                              padding: '12px 14px',
                              border: item.isUnread ? '1px solid #fecdd3' : '1px solid #f3f4f6',
                              transition: 'background-color 0.15s ease'
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

        {/* User Profile Avatar with Dropdown */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '2px',
              borderRadius: '9999px'
            }}
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
              alt={user?.name || "User Avatar"}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #e5e7eb'
              }}
            />
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.15s ease'
              }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {/* Profile Dropdown Menu (Matches Screenshot 2) */}
          {isProfileOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
                border: '1px solid #f3f4f6',
                width: '250px',
                zIndex: 60,
                overflow: 'hidden',
                animation: 'modalFadeIn 0.15s ease-out'
              }}
            >
              {/* User Info Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 18px'
                }}
              >
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                  alt={user?.name || "User"}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    flexShrink: 0
                  }}
                />
                <div style={{ overflow: 'hidden' }}>
                  <div
                    style={{
                      fontSize: '14.5px',
                      fontWeight: '700',
                      color: '#111827',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden'
                    }}
                  >
                    {user?.name || 'Amba Ngawi'}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#6b7280',
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden'
                    }}
                  >
                    {user?.email || 'amba@gmail.com'}
                  </div>
                </div>
              </div>

              {/* Logout Button Section */}
              <div
                onClick={() => {
                  setIsProfileOpen(false);
                  setShowLogoutModal(true);
                }}
                style={{
                  backgroundColor: '#f9fafb',
                  borderTop: '1px solid #f3f4f6',
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#fee2e2';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
              >
                {/* Red Exit/Logout Icon */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>

                <span
                  style={{
                    fontSize: '13.5px',
                    fontWeight: '600',
                    color: '#dc2626'
                  }}
                >
                  Keluar
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal: "Keluar dari Akun?" (Matches Screenshot 1) */}
      {showLogoutModal && (
        <div
          onClick={() => setShowLogoutModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '32px 28px',
              width: '100%',
              maxWidth: '380px',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
              animation: 'modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Red Circle Icon at Top */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                border: '1.5px solid #fca5a5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#dc2626"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </div>

            {/* Title & Subtitle */}
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '6px'
              }}
            >
              Keluar dari Akun?
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: '#6b7280',
                marginBottom: '24px',
                lineHeight: '1.4'
              }}
            >
              Tekan Keluar untuk keluar dari CARES
            </p>

            {/* Action Buttons (Side by Side) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '11px 0',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleConfirmLogout}
                style={{
                  backgroundColor: '#ba181b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '11px 0',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9e181c')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ba181b')}
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
