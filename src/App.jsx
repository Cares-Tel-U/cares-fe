import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import {
  authService,
  reportService,
  notificationService,
  adminService,
  getAuthToken,
  getStoredUser,
  setStoredUser,
  connectRealtimeEvents,
} from './services';

function App() {
  const [user, setUser] = useState(() => {
    const stored = getStoredUser();
    if (stored) {
      const isAdmin = stored.role === 'SARPRAS' || stored.role === 'ADMIN' || stored.role === 'Admin';
      return isAdmin ? null : { ...stored, name: stored.nama || stored.name };
    }
    return null;
  });

  const [adminUser, setAdminUser] = useState(() => {
    const stored = getStoredUser();
    if (stored) {
      const isAdmin = stored.role === 'SARPRAS' || stored.role === 'ADMIN' || stored.role === 'Admin';
      return isAdmin ? { ...stored, name: stored.nama || stored.name } : null;
    }
    return null;
  });

  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Fungsi memuat data riil dari backend API (mendukung silent refresh untuk update realtime tanpa kedip)
  const refreshBackendData = useCallback(async (isSilent = false) => {
    const token = getAuthToken();
    if (!token) return;

    if (!isSilent) {
      setIsLoadingData(true);
    }

    try {
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
          setAdminUser((prev) => (prev ? { ...prev, ...formattedUser } : formattedUser));
          setUser(null);
        } else {
          setUser((prev) => (prev ? { ...prev, ...formattedUser } : formattedUser));
          setAdminUser(null);
        }

        // 2. Muat Laporan Riil Sesuai Role
        if (isAdmin) {
          const adminReportsRes = await adminService.getAdminReports({ per_page: 50 }).catch(() => null);
          if (adminReportsRes?.data) {
            setReports(adminReportsRes.data);
          }
        } else {
          const myReportsRes = await reportService.getMyReports({ per_page: 50 }).catch(() => null);
          if (myReportsRes?.data) {
            setReports(myReportsRes.data);
          }
        }
      }

      // 3. Muat Notifikasi Riil Pengguna
      const notifsRes = await notificationService.getNotifications().catch(() => null);
      if (Array.isArray(notifsRes)) {
        setNotifications(notifsRes);
        setAdminNotifications(notifsRes);
      }
    } catch (err) {
      console.warn('Gagal memuat data dari backend API:', err.message);
    } finally {
      if (!isSilent) {
        setIsLoadingData(false);
      }
    }
  }, []);

  // Real-time synchronization & revalidasi latar belakang tanpa perlu reload web manual
  useEffect(() => {
    // 1. Muat data awal
    refreshBackendData(false);

    // 2. Berlangganan Server-Sent Events (SSE) untuk sinkronisasi seketika saat ada perubahan data
    const unsubscribeSSE = connectRealtimeEvents((event) => {
      if (event?.type === 'USER_AVATAR_CHANGED') {
        const changedUserId = event?.data?.userId;
        const newAvatar = event?.data?.avatar;
        const updatedUserData = event?.data?.user;

        if (newAvatar) {
          setUser((prev) => {
            if (prev && String(prev.id) === String(changedUserId)) {
              return { ...prev, avatar: newAvatar, ...(updatedUserData || {}) };
            }
            return prev;
          });
          setAdminUser((prev) => {
            if (prev && String(prev.id) === String(changedUserId)) {
              return { ...prev, avatar: newAvatar, ...(updatedUserData || {}) };
            }
            return prev;
          });
          const stored = getStoredUser();
          if (stored && String(stored.id) === String(changedUserId)) {
            setStoredUser({ ...stored, avatar: newAvatar, ...(updatedUserData || {}) });
          }
        }
      }
      refreshBackendData(true);
    });

    // 3. Sinkronisasi latar belakang setiap 4 detik saat pengguna login dan tab aktif
    const pollInterval = setInterval(() => {
      if (getAuthToken() && document.visibilityState === 'visible') {
        refreshBackendData(true);
      }
    }, 4000);

    // 4. Sinkronisasi seketika saat jendela/tab browser kembali aktif (fokus)
    const handleFocus = () => {
      if (getAuthToken()) {
        refreshBackendData(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && getAuthToken()) {
        refreshBackendData(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      unsubscribeSSE();
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshBackendData]);

  const handleLoginSuccess = async (userData) => {
    if (userData?.role === 'Admin' || userData?.role === 'admin' || userData?.rawRole === 'SARPRAS') {
      setAdminUser({ ...userData, name: userData.nama || userData.name });
      setUser(null);
    } else {
      setUser({ ...userData, name: userData.nama || userData.name });
      setAdminUser(null);
    }

    // Refresh data riil dari backend setelah login sukses
    await refreshBackendData();
  };

  const handleRegisterSuccess = (userData) => {
    setUser({ ...userData, name: userData.nama || userData.name });
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
      await adminService.updateReportStatus(reportId, { status: 'SELESAI', completionPhotos: proofImages });
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
      console.warn('Gagal update avatar via API:', err.message);
      throw err;
    }

    if (!finalAvatarUrl && typeof newAvatarPayload === 'string') {
      finalAvatarUrl = newAvatarPayload;
    }

    if (finalAvatarUrl) {
      setUser((prev) => (prev ? { ...prev, avatar: finalAvatarUrl } : prev));
      setAdminUser((prev) => (prev ? { ...prev, avatar: finalAvatarUrl } : prev));
      const stored = getStoredUser();
      if (stored) {
        setStoredUser({ ...stored, avatar: finalAvatarUrl });
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
    }
  };

  const handleToggleNotificationPreference = async (newPreference) => {
    const nextVal = Boolean(newPreference);
    setUser((prev) => (prev ? { ...prev, notificationPreference: nextVal } : prev));
    setAdminUser((prev) => (prev ? { ...prev, notificationPreference: nextVal } : prev));
    localStorage.setItem('user_notif_enabled', String(nextVal));

    const stored = getStoredUser();
    if (stored) {
      setStoredUser({ ...stored, notificationPreference: nextVal });
    }

    try {
      const updated = await authService.updateNotificationPreference(nextVal);
      if (updated && updated.notificationPreference !== undefined) {
        setUser((prev) => (prev ? { ...prev, notificationPreference: updated.notificationPreference } : prev));
        setAdminUser((prev) => (prev ? { ...prev, notificationPreference: updated.notificationPreference } : prev));
      }
    } catch (err) {
      console.warn('Gagal sinkron preferensi notifikasi:', err.message);
    }
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
        onToggleNotificationPreference={handleToggleNotificationPreference}
        isLoadingData={isLoadingData}
        onRefreshData={refreshBackendData}
      />
    </BrowserRouter>
  );
}

export default App;