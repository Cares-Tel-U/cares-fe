import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import MetricCards from '../../components/admin/MetricCards';
import ReportChart from '../../components/admin/ReportChart';
import LocationStatsCard from '../../components/admin/LocationStatsCard';
import ReportTable from '../../components/admin/ReportTable';
import DetailReportModal from '../../components/modals/DetailReportModal';
import RejectReportModal from '../../components/modals/RejectReportModal';
import SuccessModal from '../../components/modals/SuccessModal';

const AdminDashboardPage = ({
  user,
  reports = [],
  notifications = [],
  onMarkAllNotificationsAsRead,
  onVerifyReport,
  onRejectReport,
  onLogout
}) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleVerify = () => {
    if (selectedReport) {
      onVerifyReport(selectedReport.id);
      setSelectedReport(null);
      setShowSuccessModal(true);
    }
  };

  const handleRejectSubmit = (reason) => {
    if (selectedReport) {
      onRejectReport(selectedReport.id, reason);
      setShowRejectModal(false);
      setSelectedReport(null);
    }
  };

  return (
    <AdminLayout
      title="Halo, Admin"
      subtitle="Pantau dan kelola laporan fasilitas kampus dengan lebih mudah"
      user={user}
      notifications={notifications}
      onMarkAllNotificationsAsRead={onMarkAllNotificationsAsRead}
      onLogout={onLogout}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Metric Cards (5 Cards) */}
        <MetricCards reports={reports} />

        {/* Section Chart & Location Stats (Grid 2 Kolom) */}
        <div className="admin-dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '2.12fr 1fr', gap: '12px', alignItems: 'stretch' }}>
          <div style={{ minWidth: 0 }}>
            <ReportChart />
          </div>
          <div style={{ minWidth: 0 }}>
            <LocationStatsCard />
          </div>
        </div>

        {/* Section Laporan Terbaru */}
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #d7d7d7', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 16px', borderBottom: '1px solid #d7d7d7' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '700', color: '#303038', margin: 0 }}>Laporan Terbaru</h2>
          </div>
          
          <ReportTable
            reports={reports}
            limit={5}
            showPagination={false}
            onSelectReport={(r) => setSelectedReport(r)}
          />
          <div style={{ display: 'flex', justifyContent: 'center', padding: '14px', borderTop: '1px solid #e5e7eb' }}>
            <Link to="/admin/daftar-laporan" style={{ color: '#ba181b', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}>
              Lihat semua laporan
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedReport && (
        <DetailReportModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onVerify={handleVerify}
          onOpenReject={() => setShowRejectModal(true)}
        />
      )}

      {showRejectModal && (
        <RejectReportModal
          onClose={() => setShowRejectModal(false)}
          onSubmit={handleRejectSubmit}
        />
      )}

      {showSuccessModal && (
        <SuccessModal
          message="Laporan berhasil diverifikasi"
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </AdminLayout>
  );
};

export default AdminDashboardPage;
