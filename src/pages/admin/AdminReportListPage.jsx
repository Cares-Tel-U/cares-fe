import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import DetailReportModal from '../../components/modals/DetailReportModal';
import RejectReportModal from '../../components/modals/RejectReportModal';
import SuccessModal from '../../components/modals/SuccessModal';
import AdminReportTableToolbar from '../../components/admin/AdminReportTableToolbar';
import AdminReportTable from '../../components/admin/AdminReportTable';
import TablePagination from '../../components/common/TablePagination';
import AdminBulkStatusModal from '../../components/admin/AdminBulkStatusModal';
import { reportService } from '../../services';

const ITEMS_PER_PAGE = 10;

const AdminReportListPage = ({
  user,
  reports = [],
  notifications = [],
  onMarkAllNotificationsAsRead,
  onMarkNotificationAsRead,
  onVerifyReport,
  onVerifyReports,
  onRejectReport,
  onLogout,
  onUpdateAvatar,
  onRefreshData
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (onRefreshData) {
      onRefreshData();
    }
  }, [onRefreshData]);

  // Filters & Sorting state
  const [filterSort, setFilterSort] = useState('Terbaru');
  const [filterStatus, setFilterStatus] = useState('Semua Status');

  // Bulk selection mode state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportToReject, setReportToReject] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Filtered & Sorted reports
  const filteredAndSortedReports = useMemo(() => {
    let result = [...reports];

    // Filter by status
    if (filterStatus !== 'Semua Status') {
      result = result.filter((r) => r.status === filterStatus);
    }

    // Sort by Terbaru / Terlama
    if (filterSort === 'Terlama') {
      result.reverse();
    }

    return result;
  }, [reports, filterStatus, filterSort]);

  // Pagination calculations
  const totalItems = filteredAndSortedReports.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentReports = filteredAndSortedReports.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Toggle selection for a single report
  const toggleSelectReport = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select / Deselect all visible on the current page
  const handleSelectAllVisible = () => {
    const visibleIds = currentReports.map((r) => r.id);
    const allSelected = visibleIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  // Handle open detail modal
  const handleOpenDetail = async (report) => {
    setSelectedReport(report);
    if (report?.id) {
      try {
        const freshDetail = await reportService.getReportById(report.id);
        if (freshDetail) {
          setSelectedReport(freshDetail);
        }
      } catch (err) {
        console.warn('Gagal memuat detail laporan admin dari backend:', err.message);
      }
    }
  };

  // Handle single verify
  const handleVerifySingle = () => {
    if (selectedReport) {
      if (onVerifyReport) {
        onVerifyReport(selectedReport.id);
      }
      setSelectedReport(null);
      setSuccessMessage('Laporan berhasil diverifikasi');
      setShowSuccessModal(true);
    }
  };

  // Handle single reject
  const handleRejectSubmit = (reason) => {
    const target = reportToReject || selectedReport;
    if (target) {
      if (onRejectReport) {
        onRejectReport(target.id, reason);
      }
      setShowRejectModal(false);
      setReportToReject(null);
      setSelectedReport(null);
    }
  };

  // Confirm bulk update: go to Respons Laporan page
  const handleConfirmUpdate = () => {
    setShowUpdateModal(false);
    const selectedReportsList = reports.filter((r) => selectedIds.includes(r.id));
    navigate('/admin/respons-laporan', {
      state: {
        selectedReports: selectedReportsList,
        selectedIds
      }
    });
  };

  const isAllVisibleSelected =
    currentReports.length > 0 &&
    currentReports.every((r) => selectedIds.includes(r.id));

  return (
    <AdminLayout
      title="Daftar Laporan"
      subtitle="Kelola, verifikasi, dan pantau seluruh laporan fasilitas kampus"
      user={user}
      notifications={notifications}
      onMarkAllNotificationsAsRead={onMarkAllNotificationsAsRead}
      onMarkNotificationAsRead={onMarkNotificationAsRead}
      onLogout={onLogout}
      onUpdateAvatar={onUpdateAvatar}
    >
      <div className="admin-card-container">
        {/* Toolbar Filter & Bulk Action */}
        <AdminReportTableToolbar
          filterSort={filterSort}
          onSortChange={(val) => {
            setFilterSort(val);
            setCurrentPage(1);
          }}
          filterStatus={filterStatus}
          onStatusChange={(val) => {
            setFilterStatus(val);
            setCurrentPage(1);
          }}
          isSelectionMode={isSelectionMode}
          onEnableSelectionMode={() => setIsSelectionMode(true)}
          onCancelSelectionMode={() => {
            setIsSelectionMode(false);
            setSelectedIds([]);
          }}
          selectedCount={selectedIds.length}
          onOpenUpdateModal={() => setShowUpdateModal(true)}
        />

        {/* Data Table */}
        <AdminReportTable
          reports={currentReports}
          startIndex={startIndex}
          isSelectionMode={isSelectionMode}
          selectedIds={selectedIds}
          onToggleSelectReport={toggleSelectReport}
          onSelectAllVisible={handleSelectAllVisible}
          isAllVisibleSelected={isAllVisibleSelected}
          onOpenDetail={handleOpenDetail}
        />

        {/* Pagination Footer */}
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Confirmation Modal: Update Status Laporan Massal */}
      <AdminBulkStatusModal
        isOpen={showUpdateModal}
        selectedCount={selectedIds.length}
        onClose={() => setShowUpdateModal(false)}
        onConfirm={handleConfirmUpdate}
      />

      {/* Detail Report Modal */}
      {selectedReport && (
        <DetailReportModal
          report={selectedReport}
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          onVerify={handleVerifySingle}
          onOpenReject={() => {
            setReportToReject(selectedReport);
            setSelectedReport(null);
            setShowRejectModal(true);
          }}
          onNavigateToResponse={(rep) => {
            setSelectedReport(null);
            navigate(`/admin/respons-laporan/${rep.id}`);
          }}
        />
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <RejectReportModal
          onClose={() => setShowRejectModal(false)}
          onSubmit={handleRejectSubmit}
        />
      )}

      {/* Single Verify Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          message={successMessage}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </AdminLayout>
  );
};

export default AdminReportListPage;
