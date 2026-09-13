import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { mockUser } from './data/mockUser';
import { mockReports } from './data/mockReports';
import { mockNotifications } from './data/mockNotifications';

function App() {
  const [user, setUser] = useState(mockUser);
  const [reports, setReports] = useState(mockReports);
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleLoginSuccess = (userData) => {
    setUser({ ...mockUser, ...userData });
  };

  const handleRegisterSuccess = (userData) => {
    setUser({ ...mockUser, ...userData });
  };

  const handleLogout = () => {
    // Bisa reset user dan redirect ke login
    setUser(null);
  };

  const handleAddReport = (newReport) => {
    setReports((prev) => [newReport, ...prev]);

    // Tambah notifikasi baru bahwa laporan berhasil dikirim
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      category: 'Hari ini',
      title: 'Laporan Berhasil Dikirim',
      time: 'Baru saja',
      desc: `Laporan untuk ${newReport.lokasi} telah berhasil dikirim dan sedang menunggu verifikasi admin.`,
      isUnread: true
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <BrowserRouter>
      <AppRouter
        user={user}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
        onLogout={handleLogout}
        reports={reports}
        onAddReport={handleAddReport}
        notifications={notifications}
      />
    </BrowserRouter>
  );
}

export default App;