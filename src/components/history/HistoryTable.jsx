import React, { useState } from 'react';
import BadgeStatus from '../common/BadgeStatus';
import EmptyTableState from '../common/EmptyTableState';

const ITEMS_PER_PAGE = 10;
const headerCell = (width, align = 'left', extra = {}) => ({ width, padding: '10px 8px', background: '#f3f3f3', color: '#7b7c82', fontSize: '12px', fontWeight: 600, textAlign: align, ...extra });
const cell = (align = 'left', extra = {}) => ({ padding: '12px 8px', color: '#4b5563', fontSize: '12.5px', verticalAlign: 'middle', textAlign: align, ...extra });

const HistoryTable = ({ reports = [], onSelectDetail }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(reports.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentReports = reports.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, reports.length);
  const changePage = (page) => setCurrentPage(Math.min(Math.max(page, 1), totalPages));

  return <>
    <div className="table-responsive-wrapper">
      <table style={{ width: '100%', minWidth: '785px', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead><tr style={{ borderBottom: '1px solid #d9d9d9' }}>
          <th style={headerCell('55px', 'center', { paddingLeft: '16px' })}>No</th>
          <th style={headerCell('165px')}>Lokasi</th>
          <th style={headerCell('210px')}>Deskripsi</th>
          <th style={headerCell('105px')}>Tanggal</th>
          <th style={headerCell('140px', 'center')}>Status</th>
          <th style={headerCell('110px', 'center', { paddingRight: '16px' })}>Aksi</th>
        </tr></thead>
        <tbody>{currentReports.length ? currentReports.map((report, index) => <tr key={report.id} style={{ borderBottom: '1px solid #ededed' }}>
          <td style={cell('center', { paddingLeft: '16px' })}>{startIndex + index + 1}</td>
          <td style={{ ...cell(), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={report.lokasi}>{report.lokasi}</td>
          <td style={{ ...cell(), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={report.deskripsi}>{report.deskripsi}</td>
          <td style={{ ...cell(), whiteSpace: 'nowrap' }}>{report.tanggal}</td>
          <td style={cell('center')}><BadgeStatus status={report.status} /></td>
          <td style={cell('center', { paddingRight: '16px' })}><button type="button" onClick={() => onSelectDetail(report)} style={{ border: '1px solid #ff5964', color: '#df1e2d', background: '#fff', borderRadius: '4px', padding: '5px 10px', fontSize: '11.5px', fontWeight: 500, lineHeight: 1.2, whiteSpace: 'nowrap', cursor: 'pointer' }}>Lihat detail</button></td>
        </tr>) : <EmptyTableState colSpan={6} />}</tbody>
      </table>
    </div>
    <footer style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', color: '#4b5563', fontSize: '12.5px', flexWrap: 'wrap', gap: '10px' }}>
      <span>Menampilkan {reports.length ? startIndex + 1 : 0} sampai {endIndex} dari {reports.length} data</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)} style={{ border: 0, borderRadius: '20px', padding: '6px 16px', background: '#ba181b', color: '#fff', fontSize: '12px', fontWeight: 600, opacity: currentPage === 1 ? .5 : 1, cursor: 'pointer' }}>Sebelumnya</button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button key={page} type="button" onClick={() => changePage(page)} style={{ border: 0, borderBottom: page === currentPage ? '1.5px solid #ba181b' : '1.5px solid transparent', padding: '3px 6px', background: 'transparent', color: page === currentPage ? '#ba181b' : '#73737a', fontSize: '12px', fontWeight: page === currentPage ? 700 : 500, cursor: 'pointer' }}>{page}</button>)}
        <button type="button" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)} style={{ border: 0, borderRadius: '20px', padding: '6px 16px', background: '#ba181b', color: '#fff', fontSize: '12px', fontWeight: 600, opacity: currentPage === totalPages ? .5 : 1, cursor: 'pointer' }}>Selanjutnya</button>
      </div>
    </footer>
  </>;
};

export default HistoryTable;
