import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/common/Button';
import StatCard from '../../components/dashboard/StatCard';
import RecentReportTable from '../../components/dashboard/RecentReportTable';
import ReportDetailModal from '../../components/report/ReportDetailModal';


const DashboardPage = ({ user, reports = [], notifications = [], onLogout }) => {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState(null);

  // Statistics
  const totalCount = reports.length;
  const waitingCount = reports.filter((r) => r.status === 'Menunggu Verifikasi').length;
  const inProgressCount = reports.filter((r) => r.status === 'Diproses').length;
  const completedCount = reports.filter((r) => r.status === 'Selesai').length;

  return (
    <MainLayout
      title={`Halo, ${user?.name || 'Amba Ngawi'}`}
      subtitle="Laporkan masalah fasilitas kampus dengan mudah"
      user={user}
      notifications={notifications}
      onLogout={onLogout}
    >
      {/* Action Button: + Buat Laporan */}
      <div style={{ marginBottom: '22px' }}>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/buat-laporan')}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          }
        >
          Buat Laporan
        </Button>
      </div>

      {/* 4 Stat Cards in a Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '18px'
        }}
      >
        <StatCard
          isPrimary
          title="Total Laporan Anda"
          value={totalCount}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          }
        />

        <StatCard
          title="Menunggu Verifikasi"
          value={waitingCount}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          }
        />

        <StatCard
          title="Laporan Diproses"
          value={inProgressCount}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 22h14"></path>
              <path d="M5 2h14"></path>
              <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"></path>
              <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"></path>
            </svg>
          }
        />

        <StatCard
          title="Laporan Selesai"
          value={completedCount}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          }
        />
      </div>

      {/* Recent Report Table */}
      <RecentReportTable
        reports={reports}
        onSelectDetail={(report) => setSelectedReport(report)}
      />

      {/* Modal Detail Laporan */}
      <ReportDetailModal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
      />
    </MainLayout>
  );
};

export default DashboardPage;

