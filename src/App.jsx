import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { mockUser, mockAdminUser } from './data/mockUser';
import { mockReports } from './data/mockReports';
import { mockNotifications } from './data/mockNotifications';
import { mockNotificationsAdmin } from './data/mockNotificationsAdmin';
import {
  authService,
  reportService,
  notificationService,
  adminService,
  getAuthToken,
  getStoredUser,
} from './services';

function App() {
  const [user, setUser] = useState(() => {
    const stored = getStoredUser();
    if (stored) {
      const isAdmin = stored.role === 'SARPRAS' || stored.role === 'ADMIN' || stored.role === 'Admin';
      return isAdmin ? null : { ...mockUser, ...stored, name: stored.nama || stored.name };
    }
    return mockUser;
  });

  const [adminUser, setAdminUser] = useState(() => {
    const stored = getStoredUser();
    if (stored) {
      const isAdmin = stored.role === 'SARPRAS' || stored.role === 'ADMIN' || stored.role === 'Admin';
      return isAdmin ? { ...mockAdminUser, ...stored, name: stored.nama || stored.name } : null;
    }
    return mockAdminUser;
  });

  const [reports, setReports] = useState(mockReports);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [adminNotifications, setAdminNotifications] = useState(mockNotificationsAdmin);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fungsi memuat data riil dari backend API
  const refreshBackendData = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      setIsLoadingData(true);

      // 1. Sinkronisasi Profil Pengguna
      const profile = await authService.getProfile().catch(() => null);
      if (profile) {
        const isAdmin = profile.role === 'SARPRAS' || profile.role === 'ADMIN';
        const formattedUser = {
          id: profile.id,
          name: profile.nama,
          nama: profile.nama,
          email: profile.email,
          role: isAdmin ? 'Admin' : 'Mahasiswa',
          rawRole: profile.role,
          avatar: profile.avatar,
          notificationPreference: profile.notificationPreference,
        };

        if (isAdmin) {
          setAdminUser((prev) => ({ ...mockAdminUser, ...prev, ...formattedUser }));
        } else {
          setUser((prev) => ({ ...mockUser, ...prev, ...formattedUser }));
        }

        // 2. Muat Laporan Riil Sesuai Role
        if (isAdmin) {
          const adminReportsRes = await adminService.getAdminReports({ per_page: 50 }).catch(() => null);
          if (adminReportsRes?.data && adminReportsRes.data.length > 0) {
            setReports(adminReportsRes.data);
          }
        } else {
          const myReportsRes = await reportService.getMyReports({ per_page: 50 }).catch(() => null);
          if (myReportsRes?.data && myReportsRes.data.length > 0) {
            setReports(myReportsRes.data);
          }
        }
      }

      // 3. Muat Notifikasi Riil Pengguna
      const notifsRes = await notificationService.getNotifications().catch(() => null);
      if (Array.isArray(notifsRes) && notifsRes.length > 0) {
        setNotifications(notifsRes);
      }
    } catch (err) {
      console.warn('Backend API tidak dapat dijangkau, menggunakan data cadangan lokal:', err.message);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  // Muat data saat aplikasi pertama kali dimuat
  useEffect(() => {
    refreshBackendData();
  }, [refreshBackendData]);

  const handleLoginSuccess = async (userData) => {
    if (userData?.role === 'Admin' || userData?.role === 'admin' || userData?.rawRole === 'SARPRAS') {
      setAdminUser({ ...mockAdminUser, ...userData });
      setUser(null);
    } else {
      setUser({ ...mockUser, ...userData });
      setAdminUser(null);
    }

    // Refresh data riil dari backend setelah login sukses
    await refreshBackendData();
  };

  const handleRegisterSuccess = (userData) => {
    setUser({ ...mockUser, ...userData });
  };

  const handleLogout = () => {
    authService.logout();
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
      isUnread: true,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    const newAdminNotif = {
      id: `NOTIF-ADM-${Date.now()}`,
      category: 'Hari ini',
      title: 'Laporan Baru',
      time: 'Baru saja',
      location: newReport.namaRuangan || newReport.lokasi,
      desc: `Laporan masalah di ${newReport.lokasi} telah masuk dan menunggu verifikasi`,
      isUnread: true,
    };
    setAdminNotifications((prev) => [newAdminNotif, ...prev]);
  };

  const handleVerifyReport = async (reportId) => {
    try {
      await adminService.updateReportStatus(reportId, { status: 'DIPROSES' });
    } catch (err) {
      console.warn('Gagal verifikasi via API, memperbarui state lokal:', err.message);
    }
    setReports((prev) =>
      prev.map((r) => (String(r.id) === String(reportId) ? { ...r, status: 'Diproses' } : r))
    );
  };

  const handleVerifyReports = async (reportIds) => {
    const ids = Array.isArray(reportIds) ? reportIds : [reportIds];
    try {
      await adminService.updateBulkReportStatus(ids, 'DIPROSES');
    } catch (err) {
      console.warn('Gagal bulk verifikasi via API, memperbarui state lokal:', err.message);
    }
    const idSet = new Set(ids.map(String));
    setReports((prev) =>
      prev.map((r) => (idSet.has(String(r.id)) ? { ...r, status: 'Diproses' } : r))
    );
  };

  const handleRejectReport = async (reportId, reason) => {
    try {
      await adminService.updateReportStatus(reportId, { status: 'DITOLAK', rejectionReason: reason });
    } catch (err) {
      console.warn('Gagal menolak laporan via API, memperbarui state lokal:', err.message);
    }
    setReports((prev) =>
      prev.map((r) =>
        String(r.id) === String(reportId) ? { ...r, status: 'Ditolak', rejectReason: reason } : r
      )
    );
  };

  const handleCompleteReport = async (reportId, proofImages) => {
    try {
      await adminService.updateReportStatus(reportId, { status: 'SELESAI' });
    } catch (err) {
      console.warn('Gagal menyelesaikan laporan via API, memperbarui state lokal:', err.message);
    }
    setReports((prev) =>
      prev.map((r) =>
        String(r.id) === String(reportId) ? { ...r, status: 'Selesai', completionProofs: proofImages } : r
      )
    );
  };

  const handleMarkAllNotificationsAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
    } catch (err) {
      console.warn('Gagal mark all as read via API:', err.message);
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const handleMarkNotificationAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
    } catch (err) {
      console.warn('Gagal tandai notifikasi dibaca via API:', err.message);
    }
    setNotifications((prev) =>
      prev.map((n) => (String(n.id) === String(id) ? { ...n, isUnread: false } : n))
    );
    setAdminNotifications((prev) =>
      prev.map((n) => (String(n.id) === String(id) ? { ...n, isUnread: false } : n))
    );
  };

  const handleMarkAllAdminNotificationsAsRead = () => {
    setAdminNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const handleUpdateAvatar = async (newAvatarPayload) => {
    let finalAvatarUrl = '';
    try {
      const res = await authService.updateAvatar(newAvatarPayload);
      finalAvatarUrl = res?.avatar || '';
    } catch (err) {
      console.warn('Gagal update avatar via API, memperbarui state lokal:', err.message);
    }

    if (!finalAvatarUrl && typeof newAvatarPayload === 'string') {
      finalAvatarUrl = newAvatarPayload;
    }

    if (finalAvatarUrl) {
      setUser((prev) => (prev ? { ...prev, avatar: finalAvatarUrl } : prev));
      setAdminUser((prev) => (prev ? { ...prev, avatar: finalAvatarUrl } : prev));
    }

    const newNotif = {
      id: `NOTIF-AVATAR-${Date.now()}`,
      category: 'Hari ini',
      title: 'Foto Profil Diperbarui',
      time: 'Baru saja',
      desc: 'Foto profil akun Anda telah berhasil diperbarui dengan gambar baru.',
      isUnread: true,
    };
    setNotifications((prev) => [newNotif, ...prev]);
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
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
        adminNotifications={adminNotifications}
        onMarkAllAdminNotificationsAsRead={handleMarkAllAdminNotificationsAsRead}
        onUpdateAvatar={handleUpdateAvatar}
        isLoadingData={isLoadingData}
        onRefreshData={refreshBackendData}
      />
    </BrowserRouter>
  );
}

export default App;