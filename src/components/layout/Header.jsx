import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, notificationService } from '../../services';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import LogoutConfirmModal from '../modals/LogoutConfirmModal';

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
  onUpdateAvatar,
  onToggleNotificationPreference,
}) => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isNotifActive, setIsNotifActive] = useState(() => {
    if (user?.notificationPreference !== undefined) {
      return Boolean(user.notificationPreference);
    }
    const saved = localStorage.getItem('user_notif_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  // Sinkronkan state lokal saat user prop berubah dari revalidasi background
  useEffect(() => {
    if (user?.notificationPreference !== undefined) {
      setIsNotifActive(Boolean(user.notificationPreference));
    }
  }, [user?.notificationPreference]);

  const handleToggleNotif = async (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    const next = !isNotifActive;
    setIsNotifActive(next);
    localStorage.setItem('user_notif_enabled', String(next));

    if (onToggleNotificationPreference) {
      onToggleNotificationPreference(next);
    } else {
      try {
        await authService.updateNotificationPreference(next);
      } catch (err) {
        console.warn('Gagal sinkron preferensi notifikasi ke backend:', err.message);
      }
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

      {/* Actions: Notifikasi & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <NotificationDropdown
          isOpen={isNotifOpen}
          onToggle={() => {
            setIsNotifOpen((prev) => !prev);
            if (onOpenNotification) onOpenNotification();
          }}
          onClose={() => setIsNotifOpen(false)}
          unreadCount={unreadCount}
          notifications={notifications}
          isNotifActive={isNotifActive}
          onMarkAllAsRead={handleMarkAll}
          onNotificationClick={handleNotificationClick}
        />

        <ProfileDropdown
          user={user}
          isOpen={isProfileOpen}
          onToggle={() => setIsProfileOpen((prev) => !prev)}
          onClose={() => setIsProfileOpen(false)}
          isNotifActive={isNotifActive}
          onToggleNotif={handleToggleNotif}
          onOpenLogoutModal={() => setShowLogoutModal(true)}
          onUpdateAvatar={onUpdateAvatar}
        />
      </div>

      {/* Modal Konfirmasi Logout */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </header>
  );
};

export default Header;
