import React, { useState, useMemo } from 'react';
import MainLayout from '../../layouts/MainLayout';
import HistoryFilter from '../../components/history/HistoryFilter';
import HistoryTable from '../../components/history/HistoryTable';
import ReportDetailModal from '../../components/report/ReportDetailModal';

const ReportHistoryPage = ({ user, reports = [], notifications = [], onLogout }) => {
  const [sortBy, setSortBy] = useState('Terbaru');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [selectedReport, setSelectedReport] = useState(null);

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
      onLogout={onLogout}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
        }}
      >
        {/* Filters */}
        <HistoryFilter
          sortBy={sortBy}
          onSortChange={setSortBy}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {/* Table with Pagination */}
        <HistoryTable
          reports={filteredAndSortedReports}
          onSelectDetail={(report) => setSelectedReport(report)}
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

