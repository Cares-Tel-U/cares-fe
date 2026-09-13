import React, { useState } from 'react';

const BuatLaporan = ({ user, onSubmitSuccess }) => {
  const [anonim, setAnonim] = useState(false);
  const [jenisLokasi, setJenisLokasi] = useState('Dalam Gedung');
  const [namaGedung, setNamaGedung] = useState('');
  const [namaRuangan, setNamaRuangan] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReport = {
      id: Date.now(),
      lokasi: `${namaGedung} - ${namaRuangan}`,
      deskripsi: deskripsi,
      tanggal: '12/02/2026',
      status: 'Menunggu Verifikasi',
      statusType: 'warning',
      isAnonim: anonim
    };
    onSubmitSuccess(newReport);
  };

  return (
    <div className="form-layout">
      <div className="section-card">
        <div style={{ marginBottom: '20px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
          <h3>Identitas Pelapor</h3>
          <div style={{ marginTop: '10px', fontSize: '13px' }}>
            <div><strong>Nama Pelapor:</strong> {user.name}</div>
            <div><strong>Email Pelapor:</strong> {user.email}</div>
          </div>
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <input
              type="checkbox"
              id="anonim"
              checked={anonim}
              onChange={(e) => setAnonim(e.target.checked)}
            />
            <label htmlFor="anonim">Sembunyikan identitas pelapor</label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h3>Form Laporan</h3>
          <div className="form-group" style={{ marginTop: '12px' }}>
            <label>Jenis Lokasi</label>
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
              <label>
                <input
                  type="radio"
                  name="jenisLokasi"
                  value="Dalam Gedung"
                  checked={jenisLokasi === 'Dalam Gedung'}
                  onChange={(e) => setJenisLokasi(e.target.value)}
                /> Dalam Gedung
              </label>
              <label>
                <input
                  type="radio"
                  name="jenisLokasi"
                  value="Area Luar"
                  checked={jenisLokasi === 'Area Luar'}
                  onChange={(e) => setJenisLokasi(e.target.value)}
                /> Area Luar
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label>Nama Gedung</label>
              <select className="form-input" value={namaGedung} onChange={(e) => setNamaGedung(e.target.value)} required>
                <option value="">Pilih gedung</option>
                <option value="Gedung A">Gedung A</option>
                <option value="Gedung B">Gedung B</option>
                <option value="Parkir TULT">Parkir TULT</option>
              </select>
            </div>
            <div className="form-group">
              <label>Nama Ruangan</label>
              <select className="form-input" value={namaRuangan} onChange={(e) => setNamaRuangan(e.target.value)} required>
                <option value="">Pilih ruangan</option>
                <option value="KU3.02.12">KU3.02.12</option>
                <option value="KU3.02.13">KU3.02.13</option>
                <option value="Area Parkir Motor">Area Parkir Motor</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Deskripsi</label>
            <textarea
              className="form-input"
              rows="4"
              placeholder="Tuliskan deskripsi masalah"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label>Foto</label>
            <div className="upload-area">
              <div style={{ fontSize: '13px', color: '#666666' }}>Seret ke sini atau klik untuk dipilih</div>
              <div style={{ fontSize: '11px', color: '#999999', marginTop: '4px' }}>Format JPG, PNG - Maks. 5 MB per foto</div>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>Kirim Laporan</button>
        </form>
      </div>

      <div className="info-box">
        <h4>Informasi Penting</h4>
        <ul>
          <li>Laporan akan diverifikasi sebelum ditindaklanjuti.</li>
          <li>Anda dapat memantau perkembangan laporan melalui Riwayat Laporan.</li>
          <li>Identitas dapat disembunyikan saat membuat laporan.</li>
          <li>Laporan yang tidak sesuai atau tidak dapat diverifikasi dapat ditolak.</li>
        </ul>
      </div>
    </div>
  );
};

export default BuatLaporan;