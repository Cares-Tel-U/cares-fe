import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import DashboardPage from '../pages/pelapor/DashboardPage';
import CreateReportPage from '../pages/pelapor/CreateReportPage';
import ReportHistoryPage from '../pages/pelapor/ReportHistoryPage';
import FAQ from '../pages/FAQ';
import AdminFAQ from '../pages/AdminFAQ';

// Import Halaman Admin
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminReportListPage from '../pages/admin/AdminReportListPage';
import AdminReportResponsePage from '../pages/admin/AdminReportResponsePage';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';

const AppRouter = ({
  user,
  adminUser,
  onLoginSuccess,
  onRegisterSuccess,
  onLogout,
  reports,
  onAddReport,
  onVerifyReport,
  onVerifyReports,
  onRejectReport,
  onCompleteReport,
  notifications,
  onMarkAllNotificationsAsRead,
  onMarkNotificationAsRead,
  adminNotifications,
  onMarkAllAdminNotificationsAsRead,
  onUpdateAvatar,
  onToggleNotificationPreference,
  isLoadingData,
  onRefreshData
}) => {
  const currentAdminNotifs = adminNotifications || notifications;
  const currentAdminMarkRead = onMarkAllAdminNotificationsAsRead || onMarkAllNotificationsAsRead;
  const currentVerifyReports = onVerifyReports || onVerifyReport;

  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/login"
        element={<LoginPage onLoginSuccess={onLoginSuccess} />}
      />
      <Route
        path="/register"
        element={<RegisterPage onRegisterSuccess={onRegisterSuccess} />}
      />
      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />
      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />

      {/* Pelapor Routes */}
      <Route
        path="/dashboard"
        element={
          user ? (
            <DashboardPage
              user={user}
              reports={reports}
              notifications={notifications}
              onMarkAllNotificationsAsRead={onMarkAllNotificationsAsRead}
              onMarkNotificationAsRead={onMarkNotificationAsRead}
              onLogout={onLogout}
              onUpdateAvatar={onUpdateAvatar}
              onToggleNotificationPreference={onToggleNotificationPreference}
              onRefreshData={onRefreshData}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/buat-laporan"
        element={
          user ? (
            <CreateReportPage
              user={user}
              reports={reports}
              onAddReport={onAddReport}
              notifications={notifications}
              onMarkAllNotificationsAsRead={onMarkAllNotificationsAsRead}
              onMarkNotificationAsRead={onMarkNotificationAsRead}
              onLogout={onLogout}
              onUpdateAvatar={onUpdateAvatar}
              onToggleNotificationPreference={onToggleNotificationPreference}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/riwayat-laporan"
        element={
          user ? (
            <ReportHistoryPage
              user={user}
              reports={reports}
              notifications={notifications}
              onMarkAllNotificationsAsRead={onMarkAllNotificationsAsRead}
              onMarkNotificationAsRead={onMarkNotificationAsRead}
              onLogout={onLogout}
              onUpdateAvatar={onUpdateAvatar}
              onToggleNotificationPreference={onToggleNotificationPreference}
              onRefreshData={onRefreshData}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Admin Redirect Shortcut */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Admin Routes - Menggunakan adminUser */}
      <Route
        path="/admin/dashboard"
        element={
          adminUser ? (
            <AdminDashboardPage
              user={adminUser}
              reports={reports}
              notifications={currentAdminNotifs}
              onMarkAllNotificationsAsRead={currentAdminMarkRead}
              onMarkNotificationAsRead={onMarkNotificationAsRead}
              onVerifyReport={onVerifyReport}
              onRejectReport={onRejectReport}
              onLogout={onLogout}
              onUpdateAvatar={onUpdateAvatar}
              onToggleNotificationPreference={onToggleNotificationPreference}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/admin/daftar-laporan"
        element={
          adminUser ? (
            <AdminReportListPage
              user={adminUser}
              reports={reports}
              notifications={currentAdminNotifs}
              onMarkAllNotificationsAsRead={currentAdminMarkRead}
              onMarkNotificationAsRead={onMarkNotificationAsRead}
              onVerifyReport={onVerifyReport}
              onVerifyReports={currentVerifyReports}
              onRejectReport={onRejectReport}
              onLogout={onLogout}
              onUpdateAvatar={onUpdateAvatar}
              onToggleNotificationPreference={onToggleNotificationPreference}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/admin/respons-laporan"
        element={
          adminUser ? (
            <AdminReportResponsePage
              user={adminUser}
              reports={reports}
              notifications={currentAdminNotifs}
              onMarkAllNotificationsAsRead={currentAdminMarkRead}
              onMarkNotificationAsRead={onMarkNotificationAsRead}
              onVerifyReports={currentVerifyReports}
              onCompleteReport={onCompleteReport}
              onLogout={onLogout}
              onUpdateAvatar={onUpdateAvatar}
              onToggleNotificationPreference={onToggleNotificationPreference}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/admin/respons-laporan/:id"
        element={
          adminUser ? (
            <AdminReportResponsePage
              user={adminUser}
              reports={reports}
              notifications={currentAdminNotifs}
              onMarkAllNotificationsAsRead={currentAdminMarkRead}
              onMarkNotificationAsRead={onMarkNotificationAsRead}
              onVerifyReports={currentVerifyReports}
              onCompleteReport={onCompleteReport}
              onLogout={onLogout}
              onUpdateAvatar={onUpdateAvatar}
              onToggleNotificationPreference={onToggleNotificationPreference}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/admin/data-statistik"
        element={
          adminUser ? (
            <AdminAnalyticsPage
              user={adminUser}
              reports={reports}
              notifications={currentAdminNotifs}
              onMarkAllNotificationsAsRead={currentAdminMarkRead}
              onMarkNotificationAsRead={onMarkNotificationAsRead}
              onLogout={onLogout}
              onUpdateAvatar={onUpdateAvatar}
              onToggleNotificationPreference={onToggleNotificationPreference}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      {/* Route Baru untuk Admin FAQ */}
      <Route
        path="/admin/faq"
        element={
          adminUser ? (
            <AdminFAQ
              user={adminUser}
              notifications={currentAdminNotifs}
              onLogout={onLogout}
              onUpdateAvatar={onUpdateAvatar}
              onToggleNotificationPreference={onToggleNotificationPreference}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Fallback routes */}
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="/faq" element={user ? <FAQ user={user} notifications={notifications} onLogout={onLogout} onUpdateAvatar={onUpdateAvatar} onToggleNotificationPreference={onToggleNotificationPreference} /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;
