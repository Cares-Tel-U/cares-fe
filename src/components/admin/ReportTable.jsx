import React from 'react';
import StatusBadge from './StatusBadge';

const ReportTable = ({ reports = [], onSelectReport, showPagination = true, limit }) => {
  const displayReports = limit ? reports.slice(0, limit) : reports;

  return (
    <div style={{ background: '#fff', overflow: 'hidden' }}>
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
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
                  <td style={{ padding: '11px 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>{report.lokasi || 'Gedung A - KU3.02.12'}</td>
                  <td style={{ padding: '11px 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>{report.deskripsi || 'AC dikelas KU3.03.12 tidak dingin...'}</td>
                  <td style={{ padding: '11px 8px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>{report.tanggal || '12/02/2026'}</td>
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

      {showPagination && (
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <span>Menampilkan 1 sampai 10 dari 38 data</span>
          <div className="flex items-center space-x-2">
            <button className="bg-[#800000] text-white px-3 py-1.5 rounded-lg hover:opacity-90">Sebelumnya</button>
            <span className="font-bold text-gray-800 px-1">1</span>
            <span className="px-1 text-gray-400">2</span>
            <span className="px-1 text-gray-400">3</span>
            <button className="bg-[#800000] text-white px-3 py-1.5 rounded-lg hover:opacity-90">Selanjutnya</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTable;
