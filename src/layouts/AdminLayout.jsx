import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import Header from '../components/layout/Header';
import NotificationCenter from '../components/layout/NotificationCenter';

const AdminLayout = ({
  title,
  subtitle,
  user,
  notifications = [],
  onMarkAllNotificationsAsRead,
  onLogout,
  children
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: '#f8fafc', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <AdminSidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={() => setIsSidebarCollapsed((collapsed) => !collapsed)} />
      <main style={{ flex: 1, minWidth: 0, padding: '28px 36px', overflowY: 'auto', boxSizing: 'border-box' }}>
        <Header 
          title={title} 
          subtitle={subtitle} 
          user={user} 
          unreadCount={notifList.filter((item) => item.isUnread).length} 
          onOpenNotification={() => setIsNotifOpen(true)}
          onLogout={onLogout} 
        />
        {children}
      </main>
      <NotificationCenter 
        isOpen={isNotifOpen} 
        onClose={() => setIsNotifOpen(false)} 
        notifications={notifList} 
        onMarkAllAsRead={handleMarkAllAsRead} 
      />
    </div>
  );
};

export default AdminLayout;