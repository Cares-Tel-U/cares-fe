import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ activePage, setActivePage, title, subtitle, user, onOpenNotification, onLogout, children }) => {
  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-content">
        <Topbar
          title={title}
          subtitle={subtitle}
          user={user}
          onOpenNotification={onOpenNotification}
          onLogout={onLogout}
        />
        {children}
      </div>
    </div>
  );
};

export default Layout;