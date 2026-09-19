import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import Header from '../components/layout/Header';

const AdminLayout = ({ title, subtitle, user, notifications = [], onLogout, children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: '#f8fafc', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
    <AdminSidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={() => setIsSidebarCollapsed((collapsed) => !collapsed)} />
    <main style={{ flex: 1, minWidth: 0, padding: '28px 36px', overflowY: 'auto', boxSizing: 'border-box' }}>
      <Header title={title} subtitle={subtitle} user={user} unreadCount={notifications.filter((item) => item.isUnread).length} onLogout={onLogout} />
      {children}
    </main>
  </div>;
};

export default AdminLayout;
