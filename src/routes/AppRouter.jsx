import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/pelapor/DashboardPage';
import CreateReportPage from '../pages/pelapor/CreateReportPage';
import ReportHistoryPage from '../pages/pelapor/ReportHistoryPage';
import FAQ from '../pages/FAQ';

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
  adminNotifications,
  onMarkAllAdminNotificationsAsRead
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

      {/* Pelapor Routes */}
      <Route
        path="/dashboard"
        element={
          user ? (
            <DashboardPage
              user={user}
              reports={reports}
              notifications={notifications}
              onLogout={onLogout}
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
              onAddReport={onAddReport}
              notifications={notifications}
              onLogout={onLogout}
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
              onLogout={onLogout}
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
              onVerifyReport={onVerifyReport}
              onRejectReport={onRejectReport}
              onLogout={onLogout}
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
              onVerifyReport={onVerifyReport}
              onVerifyReports={currentVerifyReports}
              onRejectReport={onRejectReport}
              onLogout={onLogout}
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
              onVerifyReports={currentVerifyReports}
              onCompleteReport={onCompleteReport}
              onLogout={onLogout}
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
              onVerifyReports={currentVerifyReports}
              onCompleteReport={onCompleteReport}
              onLogout={onLogout}
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
              onLogout={onLogout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Fallback routes */}
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="/faq" element={user ? <FAQ user={user} notifications={notifications} onLogout={onLogout} /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;