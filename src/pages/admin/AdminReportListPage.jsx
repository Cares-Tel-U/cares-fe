import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import BadgeStatus from '../../components/common/BadgeStatus';
import DetailReportModal from '../../components/modals/DetailReportModal';
import RejectReportModal from '../../components/modals/RejectReportModal';
import SuccessModal from '../../components/modals/SuccessModal';

const ITEMS_PER_PAGE = 10;

const AdminReportListPage = ({
  user,
  reports = [],
  notifications = [],
  onMarkAllNotificationsAsRead,
  onVerifyReport,
  onVerifyReports,
  onRejectReport,
  onLogout
}) => {
  const navigate = useNavigate();

  // Filters & Sorting state
  const [filterSort, setFilterSort] = useState('Terbaru');
  const [filterStatus, setFilterStatus] = useState('Semua Status');

  // Bulk selection mode state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals state
  const [selectedReport, setSelectedReport] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Laporan berhasil diverifikasi');

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

  // Select / Deselect all visible on the page
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
  const handleOpenDetail = (report) => {
    setSelectedReport(report);
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
    if (selectedReport) {
      if (onRejectReport) {
        onRejectReport(selectedReport.id, reason);
      }
      setShowRejectModal(false);
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
      onLogout={onLogout}
    >
      {/* Main Card Container */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e5e7eb',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
        }}
      >
        {/* Top Bar / Filters */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          {!isSelectionMode ? (
            /* Mode Normal: Sort, Status, and "Pilih beberapa" button */
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: '500' }}>
                    Sort by:
                  </span>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={filterSort}
                      onChange={(e) => {
                        setFilterSort(e.target.value);
                        setCurrentPage(1);
                      }}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '7px 32px 7px 14px',
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#374151',
                        cursor: 'pointer',
                        outline: 'none',
                        appearance: 'none',
                        fontFamily: 'inherit',
                        minWidth: '110px'
                      }}
                    >
                      <option value="Terbaru">Terbaru</option>
                      <option value="Terlama">Terlama</option>
                    </select>
                    <div
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        pointerEvents: 'none',
                        color: '#6b7280'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div style={{ position: 'relative' }}>
                  <select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '7px 32px 7px 14px',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#374151',
                      cursor: 'pointer',
                      outline: 'none',
                      appearance: 'none',
                      fontFamily: 'inherit',
                      minWidth: '150px'
                    }}
                  >
                    <option value="Semua Status">Semua Status</option>
                    <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                  <div
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      color: '#6b7280'
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setIsSelectionMode(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #ef4444',
                    color: '#dc2626',
                    borderRadius: '8px',
                    padding: '7px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                  <span>Pilih beberapa</span>
                </button>
              </div>
            </>
          ) : (
            /* Mode Selection: Count + Action buttons */
            <>
              <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#111827' }}>
                {selectedIds.length} Laporan dipilih
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  disabled={selectedIds.length === 0}
                  onClick={() => setShowUpdateModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    backgroundColor: '#ba181b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: selectedIds.length === 0 ? 'not-allowed' : 'pointer',
                    opacity: selectedIds.length === 0 ? 0.6 : 1,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedIds.length > 0) e.currentTarget.style.backgroundColor = '#9e181c';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedIds.length > 0) e.currentTarget.style.backgroundColor = '#ba181b';
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Update status</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSelectionMode(false);
                    setSelectedIds([]);
                  }}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#4b5563',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 18px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                >
                  Batal
                </button>
              </div>
            </>
          )}
        </div>

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left'
            }}
          >
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                {isSelectionMode && (
                  <th style={{ padding: '12px 14px', width: '38px', textAlign: 'center' }}>
                    <div
                      onClick={handleSelectAllVisible}
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        backgroundColor: isAllVisibleSelected ? '#ba181b' : '#ffffff',
                        border: isAllVisibleSelected ? 'none' : '1.5px solid #d1d5db',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: '700',
                        margin: '0 auto',
                        userSelect: 'none'
                      }}
                    >
                      {isAllVisibleSelected && '✓'}
                    </div>
                  </th>
                )}
                <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: '#4b5563', width: '50px' }}>
                  No
                </th>
                <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: '#4b5563', minWidth: '170px' }}>
                  Lokasi
                </th>
                <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>
                  Deskripsi
                </th>
                <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: '#4b5563', minWidth: '110px' }}>
                  Tanggal
                </th>
                <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: '#4b5563', minWidth: '140px' }}>
                  Status
                </th>
                <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: '#4b5563', textAlign: 'center', width: '100px' }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {currentReports.length === 0 ? (
                <tr>
                  <td colSpan={isSelectionMode ? 7 : 6} style={{ padding: '36px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                    Tidak ada data laporan yang sesuai.
                  </td>
                </tr>
              ) : (
                currentReports.map((item, index) => {
                  const isSelected = selectedIds.includes(item.id);
                  const rowBg = isSelected ? '#fff5f5' : '#ffffff';

                  return (
                    <tr
                      key={item.id}
                      onClick={() => {
                        if (isSelectionMode) toggleSelectReport(item.id);
                      }}
                      style={{
                        backgroundColor: rowBg,
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'background-color 0.1s ease',
                        cursor: isSelectionMode ? 'pointer' : 'default'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = isSelected ? '#ffecec' : '#fafafa';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = rowBg;
                      }}
                    >
                      {isSelectionMode && (
                        <td style={{ padding: '14px', textAlign: 'center' }}>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelectReport(item.id);
                            }}
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              backgroundColor: isSelected ? '#ba181b' : '#ffffff',
                              border: isSelected ? 'none' : '1.5px solid #d1d5db',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              color: '#ffffff',
                              fontSize: '12px',
                              fontWeight: '700',
                              margin: '0 auto',
                              userSelect: 'none'
                            }}
                          >
                            {isSelected && '✓'}
                          </div>
                        </td>
                      )}
                      <td style={{ padding: '14px', fontSize: '13px', color: '#374151' }}>
                        {startIndex + index + 1}
                      </td>
                      <td style={{ padding: '14px', fontSize: '13px', color: '#111827', fontWeight: '500' }}>
                        {item.lokasi}
                      </td>
                      <td
                        style={{
                          padding: '14px',
                          fontSize: '13px',
                          color: '#4b5563',
                          maxWidth: '320px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={item.deskripsi}
                      >
                        {item.deskripsi}
                      </td>
                      <td style={{ padding: '14px', fontSize: '13px', color: '#4b5563' }}>
                        {item.tanggal}
                      </td>
                      <td style={{ padding: '14px' }}>
                        <BadgeStatus status={item.status} />
                      </td>
                      <td style={{ padding: '14px', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetail(item);
                          }}
                          style={{
                            border: '1px solid #ff5964',
                            color: '#df1e2d',
                            backgroundColor: '#ffffff',
                            borderRadius: '4px',
                            padding: '4px 10px',
                            fontSize: '11px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fff5f5')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                        >
                          Lihat detail
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid #f3f4f6',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ fontSize: '12.5px', color: '#4b5563' }}>
            Menampilkan {totalItems === 0 ? 0 : startIndex + 1} sampai {endIndex} dari {totalItems} data
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              style={{
                backgroundColor: '#ba181b',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '6px 18px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1,
                transition: 'opacity 0.15s ease'
              }}
            >
              Sebelumnya
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '0 6px' }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                const isActive = page === currentPage;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderBottom: isActive ? '2px solid #ba181b' : '2px solid transparent',
                      color: isActive ? '#ba181b' : '#6b7280',
                      fontSize: '13px',
                      fontWeight: isActive ? '700' : '500',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      minWidth: '24px'
                    }}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              style={{
                backgroundColor: '#ba181b',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '6px 18px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1,
                transition: 'opacity 0.15s ease'
              }}
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal: Update Status Laporan? (Screenshot 3) */}
      {showUpdateModal && (
        <div
          onClick={() => setShowUpdateModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '32px 28px',
              width: '100%',
              maxWidth: '380px',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15)',
              animation: 'modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Red Circle Icon with reload arrows */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                border: '1.5px solid #fca5a5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: '#dc2626'
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>

            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '6px'
              }}
            >
              Update Status Laporan?
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: '#6b7280',
                marginBottom: '24px',
                lineHeight: '1.4'
              }}
            >
              Status {selectedIds.length} laporan terpilih akan diupdate
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setShowUpdateModal(false)}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#4b5563',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '11px 0',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmUpdate}
                style={{
                  backgroundColor: '#ba181b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '11px 0',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#9e181c')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ba181b')}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Detail Report Modal */}
      {selectedReport && (
        <DetailReportModal
          report={selectedReport}
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          onVerify={handleVerifySingle}
          onOpenReject={() => setShowRejectModal(true)}
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