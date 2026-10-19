import React from 'react';
import StatusBadge from './StatusBadge';

const ReportTable = ({ reports = [], onSelectReport, showPagination = true, limit }) => {
  const displayReports = limit ? reports.slice(0, limit) : reports;

  return (
    <div style={{ background: '#fff', overflow: 'hidden' }}>
      <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', minWidth: '580px', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #d9d9d9', background: '#f3f3f3', color: '#7b7c82', fontSize: '10px', fontWeight: 500 }}>
              <th style={{ width: '5%', padding: '9px 8px', textAlign: 'center' }}>No</th>
              <th style={{ width: '20%', padding: '9px 8px' }}>Lokasi</th>
              <th style={{ width: '31%', padding: '9px 8px' }}>Deskripsi</th>
              <th style={{ width: '13%', padding: '9px 8px' }}>Tanggal</th>
              <th style={{ width: '18%', padding: '9px 8px', textAlign: 'center' }}>Status</th>
              <th style={{ width: '13%', padding: '9px 8px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
            {displayReports.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">Tidak ada data laporan</td>
              </tr>
            ) : (
              displayReports.map((report, index) => (
                <tr key={report.id || index} style={{ borderBottom: '1px solid #ededed', color: '#63636a', fontSize: '9px' }}>
                  <td style={{ padding: '11px 8px', textAlign: 'center', verticalAlign: 'middle' }}>{index + 1}</td>
                  <td style={{ padding: '11px 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>{report.lokasi || '-'}</td>
                  <td style={{ padding: '11px 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>{report.deskripsi || '-'}</td>
                  <td style={{ padding: '11px 8px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>{report.tanggal || '-'}</td>
                  <td style={{ padding: '11px 8px', textAlign: 'center', verticalAlign: 'middle' }}>
                    <StatusBadge status={report.status} />
                  </td>
                  <td style={{ padding: '11px 8px', textAlign: 'center', verticalAlign: 'middle' }}>
                    <button
                      onClick={() => onSelectReport(report)}
                      style={{ border: '1px solid #ff5964', color: '#df1e2d', background: '#fff', fontSize: '9px', lineHeight: 1.2, padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', whiteSpace: 'nowrap' }}
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
