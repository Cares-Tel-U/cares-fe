import React from 'react';
import StatusBadge from './StatusBadge';
import EmptyTableState from '../common/EmptyTableState';

const ReportTable = ({ reports = [], onSelectReport, showPagination = true, limit }) => {
  const displayReports = limit ? reports.slice(0, limit) : reports;

  return (
    <div style={{ background: '#fff', overflow: 'hidden' }}>
      <div className="table-responsive-wrapper">
        <table style={{ width: '100%', minWidth: '785px', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #d9d9d9', background: '#f3f3f3', color: '#7b7c82', fontSize: '12px', fontWeight: 600 }}>
              <th style={{ width: '55px', padding: '10px 8px 10px 16px', textAlign: 'center' }}>No</th>
              <th style={{ width: '165px', padding: '10px 8px' }}>Lokasi</th>
              <th style={{ width: '210px', padding: '10px 8px' }}>Deskripsi</th>
              <th style={{ width: '105px', padding: '10px 8px' }}>Tanggal</th>
              <th style={{ width: '140px', padding: '10px 8px', textAlign: 'center' }}>Status</th>
              <th style={{ width: '110px', padding: '10px 16px 10px 8px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
            {displayReports.length === 0 ? (
              <EmptyTableState colSpan={6} />
            ) : (
              displayReports.map((report, index) => (
                <tr key={report.id || index} style={{ borderBottom: '1px solid #ededed', color: '#4b5563', fontSize: '12.5px' }}>
                  <td style={{ padding: '12px 8px 12px 16px', textAlign: 'center', verticalAlign: 'middle' }}>{index + 1}</td>
                  <td style={{ padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }} title={report.lokasi || '-'}>{report.lokasi || '-'}</td>
                  <td style={{ padding: '12px 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }} title={report.deskripsi || '-'}>{report.deskripsi || '-'}</td>
                  <td style={{ padding: '12px 8px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>{report.tanggal || '-'}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'center', verticalAlign: 'middle' }}>
                    <StatusBadge status={report.status} />
                  </td>
                  <td style={{ padding: '12px 16px 12px 8px', textAlign: 'center', verticalAlign: 'middle' }}>
                    <button
                      onClick={() => onSelectReport(report)}
                      style={{ border: '1px solid #ff5964', color: '#df1e2d', background: '#fff', fontSize: '11.5px', fontWeight: 500, lineHeight: 1.2, padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      Lihat detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && reports.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <span>Menampilkan 1 sampai {displayReports.length} dari {reports.length} data</span>
        </div>
      )}
    </div>
  );
};

export default ReportTable;
