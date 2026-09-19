import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import ReportTable from '../../components/admin/ReportTable';
import DetailReportModal from '../../components/modals/DetailReportModal';

const AdminReportListPage = ({
  user,
  reports = [],
  notifications = [],
  onMarkAllNotificationsAsRead,
  onVerifyReport,
  onLogout
}) => {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState(null);

  const handleOpenDetail = (report) => {
    if (report.status === 'Diproses') {
      navigate(`/admin/respons-laporan/${report.id || 1}`);
    } else {
      setSelectedReport(report);
    }
  };

  return (
    <AdminLayout
      user={user}
      notifications={notifications}
      onMarkAllNotificationsAsRead={onMarkAllNotificationsAsRead}
      onLogout={onLogout}
    >
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Laporan</h1>
          <p className="text-xs text-gray-500">Kelola, verifikasi, dan pantau seluruh laporan fasilitas kampus</p>
        </div>
        <div className="flex gap-3">
          <select className="border border-gray-200 bg-white rounded-xl text-xs px-3 py-2 text-gray-600 focus:outline-none shadow-sm">
            <option>Sort by: Terbaru</option>
            <option>Terlama</option>
          </select>
          <select className="border border-gray-200 bg-white rounded-xl text-xs px-3 py-2 text-gray-600 focus:outline-none shadow-sm">
            <option>Semua Status</option>
            <option>Menunggu Verifikasi</option>
            <option>Diproses</option>
            <option>Selesai</option>
            <option>Ditolak</option>
          </select>
          <button className="border border-red-300 text-red-600 font-semibold text-xs px-4 py-2 rounded-xl hover:bg-red-50 flex items-center gap-1.5 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pilih beberapa
          </button>
        </div>
      </div>

      <ReportTable
        reports={reports}
        showPagination={true}
        onSelectReport={handleOpenDetail}
      />

      {selectedReport && (
        <DetailReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onVerify={() => {
            onVerifyReport(selectedReport.id);
            setSelectedReport(null);
          }}
        />
      )}
    </AdminLayout>
  );
};

export default AdminReportListPage;