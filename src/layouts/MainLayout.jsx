import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import NotificationCenter from '../components/layout/NotificationCenter';
import GuideModal from '../components/GuideModal';

const MainLayout = ({
  children,
  title,
  subtitle,
  user,
  notifications = [],
  onLogout
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

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
          onOpenNotification={() => setIsNotificationOpen(true)}
          onLogout={onLogout}
        />

        <div style={{ flex: 1 }}>
          {children}
        </div>
      </main>

      {/* Notification Center Modal */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
      />
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};

export default MainLayout;
