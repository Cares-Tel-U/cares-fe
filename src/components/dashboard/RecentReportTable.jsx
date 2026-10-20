import React from 'react';
import { useNavigate } from 'react-router-dom';
import BadgeStatus from '../common/BadgeStatus';
import EmptyTableState from '../common/EmptyTableState';

const headerCell = (width, align = 'left', extra = {}) => ({ width, padding: '10px 8px', background: '#f3f3f3', color: '#7b7c82', fontSize: '12px', fontWeight: 600, textAlign: align, ...extra });
const cell = (align = 'left', extra = {}) => ({ padding: '12px 8px', color: '#4b5563', fontSize: '12.5px', verticalAlign: 'middle', textAlign: align, ...extra });

const RecentReportTable = ({ reports = [], onSelectDetail }) => {
  const navigate = useNavigate();
  const displayReports = reports.slice(0, 5);

  return <section style={{ marginTop: '18px', background: '#fff', border: '1px solid #d9d9d9', borderRadius: '9px', overflow: 'hidden' }}>
    <h3 style={{ margin: 0, padding: '15px 16px', color: '#303038', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #d9d9d9' }}>Riwayat Laporan</h3>
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
        <tbody>{displayReports.length > 0 ? (
          displayReports.map((report, index) => <tr key={report.id} style={{ borderBottom: '1px solid #ededed' }}>
            <td style={cell('center', { paddingLeft: '16px' })}>{index + 1}</td>
            <td style={{ ...cell(), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={report.lokasi}>{report.lokasi}</td>
            <td style={{ ...cell(), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={report.deskripsi}>{report.deskripsi}</td>
            <td style={{ ...cell(), whiteSpace: 'nowrap' }}>{report.tanggal}</td>
            <td style={cell('center')}><BadgeStatus status={report.status} /></td>
            <td style={cell('center', { paddingRight: '16px' })}><button type="button" onClick={() => onSelectDetail(report)} style={{ border: '1px solid #ff5964', color: '#df1e2d', background: '#fff', borderRadius: '4px', padding: '5px 10px', fontSize: '11.5px', fontWeight: 500, lineHeight: 1.2, whiteSpace: 'nowrap', cursor: 'pointer' }}>Lihat detail</button></td>
          </tr>)
        ) : (
          <EmptyTableState colSpan={6} />
        )}</tbody>
      </table>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', padding: '13px', borderTop: '1px solid #d9d9d9' }}><button type="button" onClick={() => navigate('/riwayat-laporan')} style={{ border: 0, background: 'transparent', color: '#ba181b', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>Lihat semua laporan</button></div>
  </section>;
};

export default RecentReportTable;
