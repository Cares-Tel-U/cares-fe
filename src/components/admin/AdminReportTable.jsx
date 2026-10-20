import React from 'react';
import BadgeStatus from '../common/BadgeStatus';
import EmptyTableState from '../common/EmptyTableState';

const AdminReportTable = ({
  reports,
  startIndex,
  isSelectionMode,
  selectedIds,
  onToggleSelectReport,
  onSelectAllVisible,
  isAllVisibleSelected,
  onOpenDetail,
}) => {
  return (
    <div className="table-responsive-wrapper">
      <table
        style={{
          width: '100%',
          minWidth: isSelectionMode ? '820px' : '785px',
          tableLayout: 'fixed',
          borderCollapse: 'collapse',
          textAlign: 'left'
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid #d9d9d9', background: '#f3f3f3' }}>
            {isSelectionMode && (
              <th style={{ padding: '9px 4px 9px 16px', width: '45px', textAlign: 'center' }}>
                <div
                  onClick={onSelectAllVisible}
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
            <th
              style={{
                padding: isSelectionMode ? '10px 8px' : '10px 8px 10px 16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#7b7c82',
                width: isSelectionMode ? '45px' : '55px',
                textAlign: 'center'
              }}
            >
              No
            </th>
            <th style={{ padding: '10px 8px', fontSize: '12px', fontWeight: '600', color: '#7b7c82', width: '165px' }}>
              Lokasi
            </th>
            <th style={{ padding: '10px 8px', fontSize: '12px', fontWeight: '600', color: '#7b7c82', width: '210px' }}>
              Deskripsi
            </th>
            <th style={{ padding: '10px 8px', fontSize: '12px', fontWeight: '600', color: '#7b7c82', width: '105px' }}>
              Tanggal
            </th>
            <th style={{ padding: '10px 8px', fontSize: '12px', fontWeight: '600', color: '#7b7c82', width: '140px', textAlign: 'center' }}>
              Status
            </th>
            <th style={{ padding: '10px 16px 10px 8px', fontSize: '12px', fontWeight: '600', color: '#7b7c82', textAlign: 'center', width: '110px' }}>
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 ? (
            <EmptyTableState colSpan={isSelectionMode ? 7 : 6} />
          ) : (
            reports.map((item, index) => {
              const isSelected = selectedIds.includes(item.id);
              const rowBg = isSelected ? '#fff5f5' : '#ffffff';

              return (
                <tr
                  key={item.id}
                  onClick={() => {
                    if (isSelectionMode) onToggleSelectReport(item.id);
                  }}
                  style={{
                    backgroundColor: rowBg,
                    borderBottom: '1px solid #ededed',
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
                    <td style={{ padding: '11px 4px 11px 16px', textAlign: 'center', verticalAlign: 'middle' }}>
                      <div
                        data-testid="report-checkbox"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSelectReport(item.id);
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
                  <td
                    style={{
                      padding: isSelectionMode ? '12px 8px' : '12px 8px 12px 16px',
                      fontSize: '12.5px',
                      color: '#63636a',
                      textAlign: 'center',
                      verticalAlign: 'middle'
                    }}
                  >
                    {startIndex + index + 1}
                  </td>
                  <td
                    style={{
                      padding: '12px 8px',
                      fontSize: '12.5px',
                      color: '#63636a',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      verticalAlign: 'middle'
                    }}
                    title={item.lokasi}
                  >
                    {item.lokasi}
                  </td>
                  <td
                    style={{
                      padding: '12px 8px',
                      fontSize: '12.5px',
                      color: '#4b5563',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      verticalAlign: 'middle'
                    }}
                    title={item.deskripsi}
                  >
                    {item.deskripsi}
                  </td>
                  <td
                    style={{
                      padding: '12px 8px',
                      fontSize: '12.5px',
                      color: '#63636a',
                      whiteSpace: 'nowrap',
                      verticalAlign: 'middle'
                    }}
                  >
                    {item.tanggal}
                  </td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', verticalAlign: 'middle' }}>
                    <BadgeStatus status={item.status} />
                  </td>
                  <td style={{ padding: '12px 16px 12px 8px', textAlign: 'center', verticalAlign: 'middle' }}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenDetail(item);
                      }}
                      style={{
                        border: '1px solid #ff5964',
                        color: '#df1e2d',
                        backgroundColor: '#ffffff',
                        borderRadius: '4px',
                        padding: '5px 10px',
                        fontSize: '11.5px',
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
  );
};

export default AdminReportTable;
