import React from 'react';

const TablePagination = ({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
}) => {
  return (
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
          onClick={() => onPageChange(currentPage - 1)}
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
                onClick={() => onPageChange(page)}
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
          onClick={() => onPageChange(currentPage + 1)}
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
  );
};

export default TablePagination;
