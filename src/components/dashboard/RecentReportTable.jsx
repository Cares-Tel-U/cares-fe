import React from 'react';
import { useNavigate } from 'react-router-dom';
import BadgeStatus from '../common/BadgeStatus';

const headerCell = (width, align = 'left') => ({ width, padding: '9px 8px', background: '#f3f3f3', color: '#7b7c82', fontSize: '10px', fontWeight: 500, textAlign: align });
const cell = (align = 'left') => ({ padding: '11px 8px', color: '#63636a', fontSize: '9px', verticalAlign: 'middle', textAlign: align });

const RecentReportTable = ({ reports = [], onSelectDetail }) => {
  const navigate = useNavigate();
  const displayReports = reports.slice(0, 5);

  return <section style={{ marginTop: '18px', background: '#fff', border: '1px solid #d9d9d9', borderRadius: '9px', overflow: 'hidden' }}>
    <h3 style={{ margin: 0, padding: '15px 16px', color: '#303038', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #d9d9d9' }}>Riwayat Laporan</h3>
    <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', textAlign: 'left' }}>
      <thead><tr style={{ borderBottom: '1px solid #d9d9d9' }}><th style={headerCell('5%', 'center')}>No</th><th style={headerCell('20%')}>Lokasi</th><th style={headerCell('31%')}>Deskripsi</th><th style={headerCell('13%')}>Tanggal</th><th style={headerCell('18%', 'center')}>Status</th><th style={headerCell('13%', 'center')}>Aksi</th></tr></thead>
      <tbody>{displayReports.map((report, index) => <tr key={report.id} style={{ borderBottom: '1px solid #ededed' }}>
        <td style={cell('center')}>{index + 1}</td>
        <td style={{ ...cell(), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={report.lokasi}>{report.lokasi}</td>
        <td style={{ ...cell(), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={report.deskripsi}>{report.deskripsi}</td>
        <td style={{ ...cell(), whiteSpace: 'nowrap' }}>{report.tanggal}</td>
        <td style={cell('center')}><BadgeStatus status={report.status} /></td>
        <td style={cell('center')}><button type="button" onClick={() => onSelectDetail(report)} style={{ border: '1px solid #ff5964', color: '#df1e2d', background: '#fff', borderRadius: '3px', padding: '4px 8px', fontSize: '9px', lineHeight: 1.2, whiteSpace: 'nowrap', cursor: 'pointer' }}>Lihat detail</button></td>
      </tr>)}</tbody>
    </table>
    <div style={{ display: 'flex', justifyContent: 'center', padding: '13px', borderTop: '1px solid #d9d9d9' }}><button type="button" onClick={() => navigate('/riwayat-laporan')} style={{ border: 0, background: 'transparent', color: '#ba181b', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Lihat semua laporan</button></div>
  </section>;
};

export default RecentReportTable;
