import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { mockUser, mockAdminUser } from './data/mockUser';
import { mockReports } from './data/mockReports';
import { mockNotifications } from './data/mockNotifications';
import { mockNotificationsAdmin } from './data/mockNotificationsAdmin';

function App() {
  const [user, setUser] = useState(mockUser);
  const [adminUser, setAdminUser] = useState(mockAdminUser);
  const [reports, setReports] = useState(mockReports);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [adminNotifications, setAdminNotifications] = useState(mockNotificationsAdmin);

  const handleLoginSuccess = (userData) => {
    if (userData?.role === 'Admin' || userData?.role === 'admin') {
      setAdminUser({ ...mockAdminUser, ...userData });
    } else {
      setUser({ ...mockUser, ...userData });
    }
  };

  const handleRegisterSuccess = (userData) => {
    setUser({ ...mockUser, ...userData });
  };

  const handleLogout = () => {
    setUser(null);
    setAdminUser(null);
  };

  const handleAddReport = (newReport) => {
    setReports((prev) => [newReport, ...prev]);

    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      category: 'Hari ini',
      title: 'Laporan Berhasil Dikirim',
      time: 'Baru saja',
      desc: `Laporan untuk ${newReport.lokasi} telah berhasil dikirim dan sedang menunggu verifikasi admin.`,
      isUnread: true
    };
    setNotifications((prev) => [newNotif, ...prev]);

    const newAdminNotif = {
      id: `NOTIF-ADM-${Date.now()}`,
      category: 'Hari ini',
      title: 'Laporan Baru',
      time: 'Baru saja',
      location: newReport.namaRuangan || newReport.lokasi,
      desc: `Laporan masalah di ${newReport.lokasi} telah masuk dan menunggu verifikasi`,
      isUnread: true
    };
    setAdminNotifications((prev) => [newAdminNotif, ...prev]);
  };

  const handleVerifyReport = (reportId) => {
    setReports((prev) =>
      prev.map((r) => (String(r.id) === String(reportId) ? { ...r, status: 'Diproses' } : r))
    );
  };

  const handleVerifyReports = (reportIds) => {
    const idSet = new Set((Array.isArray(reportIds) ? reportIds : [reportIds]).map(String));
    setReports((prev) =>
      prev.map((r) => (idSet.has(String(r.id)) ? { ...r, status: 'Diproses' } : r))
    );
  };

  const handleRejectReport = (reportId, reason) => {
    setReports((prev) =>
      prev.map((r) =>
        String(r.id) === String(reportId) ? { ...r, status: 'Ditolak', rejectReason: reason } : r
      )
    );
  };

  const handleCompleteReport = (reportId, proofImages) => {
    setReports((prev) =>
      prev.map((r) =>
        String(r.id) === String(reportId) ? { ...r, status: 'Selesai', completionProofs: proofImages } : r
      )
    );
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const handleMarkAllAdminNotificationsAsRead = () => {
    setAdminNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  return (
    <BrowserRouter>
      <AppRouter
        user={user}
        adminUser={adminUser}
        onLoginSuccess={handleLoginSuccess}
        onRegisterSuccess={handleRegisterSuccess}
        onLogout={handleLogout}
        reports={reports}
        onAddReport={handleAddReport}
        onVerifyReport={handleVerifyReport}
        onVerifyReports={handleVerifyReports}
        onRejectReport={handleRejectReport}
        onCompleteReport={handleCompleteReport}
        notifications={notifications}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
        adminNotifications={adminNotifications}
        onMarkAllAdminNotificationsAsRead={handleMarkAllAdminNotificationsAsRead}
      />
    </BrowserRouter>
  );
}

export default App;