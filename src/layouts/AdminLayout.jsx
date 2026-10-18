import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import Header from '../components/layout/Header';
import AdminGuideModal from '../components/AdminGuideModal';

const AdminLayout = ({
  title,
  subtitle,
  user,
  notifications = [],
  onMarkAllNotificationsAsRead,
  onMarkNotificationAsRead,
  onLogout,
  onUpdateAvatar,
  children
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [notifList, setNotifList] = useState(notifications);

  useEffect(() => {
    setNotifList(notifications);
  }, [notifications]);

  const handleMarkAllAsRead = () => {
    setNotifList((prev) => prev.map((item) => ({ ...item, isUnread: false })));
    if (onMarkAllNotificationsAsRead) {
      onMarkAllNotificationsAsRead();
    }
  };

  const handleMarkNotificationAsRead = (id) => {
    setNotifList((prev) =>
      prev.map((item) => (String(item.id) === String(id) ? { ...item, isUnread: false } : item))
    );
    if (onMarkNotificationAsRead) {
      onMarkNotificationAsRead(id);
    }
  };

  return (
    <div
      className="admin-shell"
      style={{
        display: 'flex',
        height: '100vh',
        maxHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: '#f8fafc',
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif"
      }}
    >
      <AdminSidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed((c) => !c)} 
        onOpenGuide={() => setIsGuideOpen(true)}
        isGuideOpen={isGuideOpen}
      />
      <main
        className="admin-main"
        style={{
          flex: 1,
          height: '100vh',
          maxHeight: '100vh',
          minWidth: 0,
          padding: '28px 36px',
          overflowY: 'auto',
          overflowX: 'hidden',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Header
          title={title}
          subtitle={subtitle}
          user={user}
          unreadCount={notifList.filter((item) => item.isUnread).length}
          notifications={notifList}
          onMarkAllAsRead={handleMarkAllAsRead}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onLogout={onLogout}
          onUpdateAvatar={onUpdateAvatar}
        />
        <div style={{ flex: 1 }}>
          {children}
        </div>
      </main>

      <AdminGuideModal 
        isOpen={isGuideOpen} 
        onClose={() => setIsGuideOpen(false)} 
      />
    </div>
  );
};

export default AdminLayout;