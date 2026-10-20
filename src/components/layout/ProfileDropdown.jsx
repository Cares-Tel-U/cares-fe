import React, { useRef, useState, useEffect } from 'react';
import { resolveMediaUrl } from '../../services/api';
import { authService } from '../../services';

const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='none'><rect width='64' height='64' rx='32' fill='%23E5E7EB'/><circle cx='32' cy='25' r='12' fill='%239CA3AF'/><path d='M12 54c0-11.046 8.954-20 20-20s20 8.954 20 20' fill='%239CA3AF'/></svg>";

const ProfileDropdown = ({
  user,
  isOpen,
  onToggle,
  onClose,
  isNotifActive,
  onToggleNotif,
  onOpenLogoutModal,
  onUpdateAvatar,
}) => {
  const profileRef = useRef(null);
  const avatarInputRef = useRef(null);
  const [avatarSuccessMsg, setAvatarSuccessMsg] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
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

  const avatarSrc = resolveMediaUrl(user?.avatar) || DEFAULT_AVATAR;

  return (
    <div ref={profileRef} style={{ position: 'relative' }}>
      <div
        onClick={onToggle}
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
          src={avatarSrc}
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
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.15s ease'
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
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
                src={avatarSrc}
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
            onClick={onToggleNotif}
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
              onClose();
              onOpenLogoutModal();
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
  );
};

export default ProfileDropdown;
