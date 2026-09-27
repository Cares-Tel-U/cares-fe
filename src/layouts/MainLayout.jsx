import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import GuideModal from '../components/GuideModal';

const MainLayout = ({
  children,
  title,
  subtitle,
  user,
  notifications = [],
  onMarkAllNotificationsAsRead,
  onLogout
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [notifList, setNotifList] = useState(notifications);

  // Sync when parent updates notifications
  React.useEffect(() => {
    setNotifList(notifications);
  }, [notifications]);

  const unreadCount = notifList.filter((n) => n.isUnread).length;

  const handleMarkAllAsRead = () => {
    setNotifList((prev) => prev.map((n) => ({ ...n, isUnread: false })));
    if (onMarkAllNotificationsAsRead) {
      onMarkAllNotificationsAsRead();
    }
  };

  return (
    <div
      className="app-shell"
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f8fafc',
        fontFamily: "'Plus Jakarta Sans', sans-serif"
      }}
    >
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenGuide={() => setIsGuideOpen(true)}
        isGuideOpen={isGuideOpen}
      />

      {/* Main Content Area */}
      <main
        className="app-main"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '28px 36px',
          overflowY: 'auto',
          minWidth: 0,
          boxSizing: 'border-box'
        }}
      >
        <Header
          title={title}
          subtitle={subtitle}
          user={user}
          unreadCount={unreadCount}
          notifications={notifList}
          onMarkAllAsRead={handleMarkAllAsRead}
          onLogout={onLogout}
        />

        <div style={{ flex: 1 }}>
          {children}
        </div>
      </main>

      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};

export default MainLayout;
