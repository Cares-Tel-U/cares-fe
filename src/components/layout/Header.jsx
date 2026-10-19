import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { authService, notificationService } from '../../services';
import { resolveMediaUrl } from '../../services/api';

const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect width='64' height='64' rx='32' fill='%23E5E7EB'/><circle cx='32' cy='25' r='12' fill='%239CA3AF'/><path d='M12 54c0-11.046 8.954-20 20-20s20 8.954 20 20' fill='%239CA3AF'/></svg>";

const Header = ({
  title,
  subtitle,
  user,
  onOpenNotification,
  unreadCount = 0,
  notifications = [],
  onMarkAllAsRead,
  onMarkNotificationAsRead,
  onLogout,
  onUpdateAvatar
}) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [avatarSuccessMsg, setAvatarSuccessMsg] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isNotifActive, setIsNotifActive] = useState(() => {
    if (user?.notificationPreference !== undefined) {
      return Boolean(user.notificationPreference);
    }
    const saved = localStorage.getItem('user_notif_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  const handleToggleNotif = async (e) => {
    e.stopPropagation();
    const next = !isNotifActive;
    setIsNotifActive(next);
    localStorage.setItem('user_notif_enabled', String(next));
    try {
      await authService.updateNotificationPreference(next);
    } catch (err) {
      console.warn('Gagal sinkron preferensi notifikasi ke backend:', err.message);
    }
  };
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const avatarInputRef = useRef(null);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar (JPG, PNG, dll).');
      return;
    }

    try {
      setIsUploadingAvatar(true);
      if (onUpdateAvatar) {
        await onUpdateAvatar(file);
      } else {
        await authService.updateAvatar(file);
      }
      setAvatarSuccessMsg('Foto profil berhasil diperbarui.');
      setTimeout(() => setAvatarSuccessMsg(''), 3500);
    } catch (err) {
      console.warn('Gagal unggah avatar via API, mencoba fallback lokal:', err.message);
      const reader = new FileReader();
      reader.onload = (event) => {
        const newAvatarUrl = event.target?.result;
        if (newAvatarUrl && onUpdateAvatar) {
          onUpdateAvatar(newAvatarUrl);
        }
        setAvatarSuccessMsg('Foto profil berhasil diperbarui.');
        setTimeout(() => setAvatarSuccessMsg(''), 3500);
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleNotificationClick = async (item) => {
    if (!item.isUnread) return;
    try {
      await notificationService.markAsRead(item.id);
    } catch (err) {
      console.warn('Gagal tandai notifikasi dibaca via API:', err.message);
    }
    if (onMarkNotificationAsRead) {
      onMarkNotificationAsRead(item.id);
    }
  };

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
                            onClick={() => handleNotificationClick(item)}
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
                            onClick={() => handleNotificationClick(item)}
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
              src={resolveMediaUrl(user?.avatar) || DEFAULT_AVATAR}
              alt={user?.name || "User Avatar"}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_AVATAR;
              }}
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
              {/* Hidden Avatar File Input */}
              <input
                type="file"
                ref={avatarInputRef}
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
              />

              {/* User Info Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px 18px',
                  borderBottom: '1px solid #f3f4f6'
                }}
              >
                <div
                  onClick={() => avatarInputRef.current && avatarInputRef.current.click()}
                  title="Klik untuk mengganti foto profil"
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flexShrink: 0,
                    width: '46px',
                    height: '46px'
                  }}
                >
                  <img
                    src={resolveMediaUrl(user?.avatar) || DEFAULT_AVATAR}
                    alt={user?.name || "User"}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_AVATAR;
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                      borderRadius: '50%'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </div>
                </div>

                <div style={{ overflow: 'hidden', flex: 1 }}>
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
                    {user?.name || user?.nama || '-'}
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
                    {user?.email || '-'}
                  </div>
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current && avatarInputRef.current.click()}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      margin: '4px 0 0 0',
                      color: '#ba181b',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    Ubah Foto Profil
                  </button>
                  {avatarSuccessMsg && (
                    <div style={{ color: '#16a34a', fontSize: '10.5px', marginTop: '4px', fontWeight: '600' }}>
                      {avatarSuccessMsg}
                    </div>
                  )}
                  {isUploadingAvatar && (
                    <div style={{ color: '#6b7280', fontSize: '10.5px', marginTop: '4px' }}>
                      Mengunggah foto...
                    </div>
                  )}
                </div>
              </div>

              {/* Notifikasi Toggle Row */}
              <div
                onClick={handleToggleNotif}
                style={{
                  padding: '12px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  borderTop: '1px solid #f3f4f6',
                  userSelect: 'none',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                <span
                  style={{
                    fontSize: '13.5px',
                    fontWeight: '600',
                    color: '#374151'
                  }}
                >
                  Notifikasi
                </span>

                {/* Switch Toggle */}
                <div
                  style={{
                    width: '38px',
                    height: '20px',
                    borderRadius: '9999px',
                    backgroundColor: isNotifActive ? '#ba181b' : '#cbd5e1',
                    position: 'relative',
                    transition: 'background-color 0.2s ease',
                    cursor: 'pointer'
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      position: 'absolute',
                      top: '2px',
                      left: isNotifActive ? '20px' : '2px',
                      transition: 'left 0.2s ease',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
                    }}
                  />
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

      {/* Confirmation Modal: "Keluar dari Akun?" (Rendered via Portal to document.body) */}
      {showLogoutModal && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setShowLogoutModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
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
        </div>,
        document.body
      )}
    </header>
  );
};

export default Header;
