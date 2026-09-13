import React, { useState } from 'react';

const RiwayatLaporan = ({ reports, onSelectDetail }) => {
  const [filterSort, setFilterSort] = useState('Terbaru');
  const [filterStatus, setFilterStatus] = useState('Semua Status');

  const filteredReports = reports.filter((r) => {
    if (filterStatus === 'Semua Status') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="section-card">
      <div className="filter-bar">
        <div>
          <span style={{ fontSize: '13px', marginRight: '8px' }}>Sort by:</span>
          <select className="select-input" value={filterSort} onChange={(e) => setFilterSort(e.target.value)}>
            <option value="Terbaru">Terbaru</option>
            <option value="Terlama">Terlama</option>
          </select>
        </div>
        <div>
          <select className="select-input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="Semua Status">Semua Status</option>
            <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
            <option value="Ditolak">Ditolak</option>
          </select>
        </div>
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
          {filteredReports.map((item, index) => (
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

      <div className="pagination">
        <div>Menampilkan 1 sampai {filteredReports.length} dari {filteredReports.length} data</div>
        <div className="pagination-controls">
          <button className="btn-page">Sebelumnya</button>
          <button className="btn-page active">1</button>
          <button className="btn-page">Selanjutnya</button>
        </div>
      </div>
    </div>
  );
};

export default RiwayatLaporan;