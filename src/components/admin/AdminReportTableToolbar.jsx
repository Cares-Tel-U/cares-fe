import React from 'react';

const AdminReportTableToolbar = ({
  filterSort,
  onSortChange,
  filterStatus,
  onStatusChange,
  isSelectionMode,
  onEnableSelectionMode,
  onCancelSelectionMode,
  selectedCount,
  onOpenUpdateModal,
}) => {
  return (
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
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: '500' }}>
                Sort by:
              </span>
              <div style={{ position: 'relative' }}>
                <select
                  value={filterSort}
                  onChange={(e) => onSortChange(e.target.value)}
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

            {/* Status Filter */}
            <div style={{ position: 'relative' }}>
              <select
                value={filterStatus}
                onChange={(e) => onStatusChange(e.target.value)}
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
              onClick={onEnableSelectionMode}
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
        <>
          <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#111827' }}>
            {selectedCount} Laporan dipilih
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={onOpenUpdateModal}
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
                cursor: selectedCount === 0 ? 'not-allowed' : 'pointer',
                opacity: selectedCount === 0 ? 0.6 : 1,
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (selectedCount > 0) e.currentTarget.style.backgroundColor = '#9e181c';
              }}
              onMouseLeave={(e) => {
                if (selectedCount > 0) e.currentTarget.style.backgroundColor = '#ba181b';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Update status</span>
            </button>

            <button
              type="button"
              onClick={onCancelSelectionMode}
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
  );
};

export default AdminReportTableToolbar;
