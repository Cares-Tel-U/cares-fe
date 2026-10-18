import React, { useState } from 'react';
import BadgeStatus from '../common/BadgeStatus';

const ITEMS_PER_PAGE = 10;
const headerCell = (width, align = 'left') => ({ width, padding: '9px 8px', background: '#f3f3f3', color: '#7b7c82', fontSize: '10px', fontWeight: 500, textAlign: align });
const cell = (align = 'left') => ({ padding: '11px 8px', color: '#63636a', fontSize: '9px', verticalAlign: 'middle', textAlign: align });

const HistoryTable = ({ reports = [], onSelectDetail }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(reports.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentReports = reports.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, reports.length);
  const changePage = (page) => setCurrentPage(Math.min(Math.max(page, 1), totalPages));

  return <>
    <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table style={{ width: '100%', minWidth: '580px', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead><tr style={{ borderBottom: '1px solid #d9d9d9' }}><th style={headerCell('5%', 'center')}>No</th><th style={headerCell('20%')}>Lokasi</th><th style={headerCell('31%')}>Deskripsi</th><th style={headerCell('13%')}>Tanggal</th><th style={headerCell('18%', 'center')}>Status</th><th style={headerCell('13%', 'center')}>Aksi</th></tr></thead>
        <tbody>{currentReports.length ? currentReports.map((report, index) => <tr key={report.id} style={{ borderBottom: '1px solid #ededed' }}>
          <td style={cell('center')}>{startIndex + index + 1}</td>
          <td style={{ ...cell(), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={report.lokasi}>{report.lokasi}</td>
          <td style={{ ...cell(), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={report.deskripsi}>{report.deskripsi}</td>
          <td style={{ ...cell(), whiteSpace: 'nowrap' }}>{report.tanggal}</td>
          <td style={cell('center')}><BadgeStatus status={report.status} /></td>
          <td style={cell('center')}><button type="button" onClick={() => onSelectDetail(report)} style={{ border: '1px solid #ff5964', color: '#df1e2d', background: '#fff', borderRadius: '3px', padding: '4px 8px', fontSize: '9px', lineHeight: 1.2, whiteSpace: 'nowrap', cursor: 'pointer' }}>Lihat detail</button></td>
        </tr>) : <tr><td colSpan="6" style={{ padding: '28px', textAlign: 'center', color: '#9ca3af', fontSize: '11px' }}>Tidak ada laporan yang sesuai dengan filter.</td></tr>}</tbody>
      </table>
    </div>
    <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', color: '#73737a', fontSize: '9px', flexWrap: 'wrap', gap: '10px' }}>
      <span>Menampilkan {reports.length ? startIndex + 1 : 0} sampai {endIndex} dari {reports.length} data</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)} style={{ border: 0, borderRadius: '20px', padding: '6px 13px', background: '#ba181b', color: '#fff', fontSize: '9px', opacity: currentPage === 1 ? .5 : 1, cursor: 'pointer' }}>Sebelumnya</button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button key={page} type="button" onClick={() => changePage(page)} style={{ border: 0, borderBottom: page === currentPage ? '1px solid #ba181b' : '1px solid transparent', padding: '2px 4px', background: 'transparent', color: page === currentPage ? '#ba181b' : '#73737a', fontSize: '9px', cursor: 'pointer' }}>{page}</button>)}
        <button type="button" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)} style={{ border: 0, borderRadius: '20px', padding: '6px 13px', background: '#ba181b', color: '#fff', fontSize: '9px', opacity: currentPage === totalPages ? .5 : 1, cursor: 'pointer' }}>Selanjutnya</button>
      </div>
    </footer>
  </>;
};

export default HistoryTable;
