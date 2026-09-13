import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/pelapor/DashboardPage';
import CreateReportPage from '../pages/pelapor/CreateReportPage';
import ReportHistoryPage from '../pages/pelapor/ReportHistoryPage';
import FAQ from '../pages/FAQ';

const AppRouter = ({
  user,
  onLoginSuccess,
  onRegisterSuccess,
  onLogout,
  reports,
  onAddReport,
  notifications
}) => {
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

      {/* Pelapor Protected / Main Routes */}
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

      {/* Fallback routes */}
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="/panduan" element={<Navigate to="/dashboard" replace />} />
      <Route path="/faq" element={user ? <FAQ user={user} notifications={notifications} onLogout={onLogout} /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRouter;
