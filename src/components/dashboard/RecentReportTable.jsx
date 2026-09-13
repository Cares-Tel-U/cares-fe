import React from 'react';
import { useNavigate } from 'react-router-dom';
import BadgeStatus from '../common/BadgeStatus';
import Button from '../common/Button';

const RecentReportTable = ({ reports = [], onSelectDetail }) => {
  const navigate = useNavigate();
  const displayReports = reports.slice(0, 5);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        padding: '24px',
        marginTop: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
          Riwayat Laporan
        </h3>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left'
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: '#4b5563', width: '50px' }}>
                No
              </th>
              <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: '#4b5563', minWidth: '170px' }}>
                Lokasi
              </th>
              <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: '#4b5563' }}>
                Deskripsi
              </th>
              <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: '#4b5563', minWidth: '110px' }}>
                Tanggal
              </th>
              <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: '#4b5563', minWidth: '140px' }}>
                Status
              </th>
              <th style={{ padding: '12px 14px', fontSize: '13px', fontWeight: '600', color: '#4b5563', textAlign: 'center', width: '100px' }}>
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {displayReports.map((report, index) => (
              <tr
                key={report.id}
                style={{
                  borderBottom: '1px solid #f3f4f6',
                  transition: 'background-color 0.1s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fafafa')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '14px', fontSize: '13px', color: '#374151' }}>
                  {index + 1}
                </td>
                <td style={{ padding: '14px', fontSize: '13px', color: '#111827', fontWeight: '500' }}>
                  {report.lokasi}
                </td>
                <td
                  style={{
                    padding: '14px',
                    fontSize: '13px',
                    color: '#4b5563',
                    maxWidth: '320px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  title={report.deskripsi}
                >
                  {report.deskripsi}
                </td>
                <td style={{ padding: '14px', fontSize: '13px', color: '#4b5563' }}>
                  {report.tanggal}
                </td>
                <td style={{ padding: '14px' }}>
                  <BadgeStatus status={report.status} />
                </td>
                <td style={{ padding: '14px', textAlign: 'center' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectDetail(report)}
                  >
                    Lihat detail
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom Link: Lihat semua laporan */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          type="button"
          onClick={() => navigate('/riwayat-laporan')}
          style={{
            background: 'none',
            border: 'none',
            color: '#ba181b',
            fontSize: '13.5px',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '4px 12px',
            transition: 'opacity 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
        >
          Lihat semua laporan
        </button>
      </div>
    </div>
  );
};

export default RecentReportTable;

