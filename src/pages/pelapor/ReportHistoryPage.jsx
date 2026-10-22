import React, { useState, useMemo, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import HistoryFilter from '../../components/history/HistoryFilter';
import HistoryTable from '../../components/history/HistoryTable';
import ReportDetailModal from '../../components/report/ReportDetailModal';
import { reportService } from '../../services';

const ReportHistoryPage = ({
  user,
  reports = [],
  notifications = [],
  onMarkAllNotificationsAsRead,
  onMarkNotificationAsRead,
  onLogout,
  onUpdateAvatar,
  onToggleNotificationPreference,
  onRefreshData
}) => {
  const [sortBy, setSortBy] = useState('Terbaru');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [selectedReport, setSelectedReport] = useState(null);

  // Muat data riwayat terbaru dari backend saat halaman dibuka
  useEffect(() => {
    if (onRefreshData) {
      onRefreshData();
    }
  }, [onRefreshData]);

  // Handle buka detail laporan dengan sinkronisasi API jika ID valid
  const handleSelectDetail = async (report) => {
    setSelectedReport(report);
    if (report?.id) {
      try {
        const freshDetail = await reportService.getReportById(report.id);
        if (freshDetail) {
          setSelectedReport(freshDetail);
        }
      } catch (err) {
        console.warn('Gagal memuat detail laporan terbaru dari backend:', err.message);
      }
    }
  };

  // Filter & Sort logic
  const filteredAndSortedReports = useMemo(() => {
    let result = [...reports];

    // Filter by status
    if (statusFilter !== 'Semua Status') {
      result = result.filter((r) => r.status === statusFilter);
    }

    // Sort by Terbaru / Terlama
    if (sortBy === 'Terlama') {
      result.reverse();
    }

    return result;
  }, [reports, statusFilter, sortBy]);

  return (
    <MainLayout
      title="Riwayat Laporan"
      subtitle="Lihat dan pantau perkembangan laporan fasilitas yang telah Anda dikirimkan"
      user={user}
      notifications={notifications}
      onMarkAllNotificationsAsRead={onMarkAllNotificationsAsRead}
      onMarkNotificationAsRead={onMarkNotificationAsRead}
      onLogout={onLogout}
      onUpdateAvatar={onUpdateAvatar}
      onToggleNotificationPreference={onToggleNotificationPreference}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '9px',
          border: '1px solid #d9d9d9',
          overflow: 'hidden'
        }}
      >
        {/* Filters */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #d9d9d9' }}>
          <HistoryFilter
            sortBy={sortBy}
            onSortChange={setSortBy}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
        </div>

        {/* Table with Pagination */}
        <HistoryTable
          reports={filteredAndSortedReports}
          onSelectDetail={handleSelectDetail}
        />
      </div>

      {/* Detail Modal */}
      <ReportDetailModal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        report={selectedReport}
      />
    </MainLayout>
  );
};

export default ReportHistoryPage;

