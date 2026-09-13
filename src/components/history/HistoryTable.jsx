import React, { useState } from 'react';
import BadgeStatus from '../common/BadgeStatus';
import Button from '../common/Button';

const ITEMS_PER_PAGE = 10;

const HistoryTable = ({ reports = [], onSelectDetail }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = reports.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentReports = reports.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
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
                <td colSpan="6" style={{ padding: '36px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                  Tidak ada laporan yang sesuai dengan filter.
                </td>
              </tr>
            ) : (
              currentReports.map((report, index) => (
                <tr
                  key={report.id}
                  style={{
                    borderBottom: '1px solid #f3f4f6',
                    transition: 'background-color 0.1s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fafafa')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px', fontSize: '13px', color: '#374151' }}>
                    {startIndex + index + 1}
                  </td>
                  <td style={{ padding: '14px', fontSize: '13px', color: '#111827', fontWeight: '500' }}>
                    {report.lokasi}
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
                    title={report.deskripsi}
                  >
                    {report.deskripsi}
                  </td>
                  <td style={{ padding: '14px', fontSize: '13px', color: '#4b5563' }}>
                    {report.tanggal}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <BadgeStatus status={report.status} />
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectDetail(report)}
                    >
                      Lihat detail
                    </Button>
                  </td>
                </tr>
              ))
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
          {/* Tombol Sebelumnya */}
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

          {/* Number pagination */}
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

          {/* Tombol Selanjutnya */}
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
  );
};

export default HistoryTable;

