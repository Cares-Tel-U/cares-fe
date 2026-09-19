import React from 'react';
import StatusBadge from './StatusBadge';

const ReportTable = ({ reports = [], onSelectReport, showPagination = true, limit }) => {
  const displayReports = limit ? reports.slice(0, limit) : reports;

  return (
    <div style={{ background: '#fff', overflow: 'hidden' }}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid #e0e0e0', background: '#f4f4f4', color: '#85858c', fontSize: '10px', fontWeight: 500 }}>
              <th style={{ padding: '9px 12px', width: '40px', textAlign: 'center' }}>No</th>
              <th style={{ padding: '9px 12px' }}>Lokasi</th>
              <th style={{ padding: '9px 12px' }}>Deskripsi</th>
              <th style={{ padding: '9px 12px' }}>Tanggal</th>
              <th style={{ padding: '9px 12px' }}>Status</th>
              <th style={{ padding: '9px 12px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
            {displayReports.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">Tidak ada data laporan</td>
              </tr>
            ) : (
              displayReports.map((report, index) => (
                <tr key={report.id || index} style={{ color: '#63636a', fontSize: '9px' }}>
                  <td style={{ padding: '11px 12px', textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ padding: '11px 12px', whiteSpace: 'nowrap' }}>{report.lokasi || 'Gedung A - KU3.02.12'}</td>
                  <td style={{ padding: '11px 12px', maxWidth: '230px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{report.deskripsi || 'AC dikelas KU3.03.12 tidak dingin...'}</td>
                  <td style={{ padding: '11px 12px', whiteSpace: 'nowrap' }}>{report.tanggal || '12/02/2026'}</td>
                  <td style={{ padding: '11px 12px' }}>
                    <StatusBadge status={report.status} />
                  </td>
                  <td style={{ padding: '11px 12px', textAlign: 'center' }}>
                    <button
                      onClick={() => onSelectReport(report)}
                      style={{ border: '1px solid #ff5964', color: '#df1e2d', background: '#fff', fontSize: '9px', padding: '4px 9px', borderRadius: '3px', cursor: 'pointer' }}
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
