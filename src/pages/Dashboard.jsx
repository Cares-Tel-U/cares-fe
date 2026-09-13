import React from 'react';

const Dashboard = ({ reports, onNavigateBuat, onNavigateRiwayat, onSelectDetail }) => {
  const total = reports.length;
  const menunggu = reports.filter((r) => r.status === 'Menunggu Verifikasi').length;
  const diproses = reports.filter((r) => r.status === 'Diproses').length;
  const selesai = reports.filter((r) => r.status === 'Selesai').length;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button className="btn-primary" style={{ width: 'auto', padding: '10px 20px' }} onClick={onNavigateBuat}>
          + Buat Laporan
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card primary">
          <div className="stat-title">Total Laporan Anda</div>
          <div className="stat-value">{total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Menunggu Verifikasi</div>
          <div className="stat-value">{menunggu}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Laporan Diproses</div>
          <div className="stat-value">{diproses}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Laporan Selesai</div>
          <div className="stat-value">{selesai}</div>
        </div>
      </div>

      <div className="section-card">
        <div className="section-header">
          <div className="section-title">Riwayat Laporan</div>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Lokasi</th>
              <th>Deskripsi</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {reports.slice(0, 5).map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.lokasi}</td>
                <td>{item.deskripsi}</td>
                <td>{item.tanggal}</td>
                <td>
                  <span className={`badge badge-${item.statusType}`}>{item.status}</span>
                </td>
                <td>
                  <button className="btn-detail" onClick={() => onSelectDetail(item)}>
                    Lihat detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <span
            style={{ color: '#cb2a2a', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
            onClick={onNavigateRiwayat}
          >
            Lihat semua laporan
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;