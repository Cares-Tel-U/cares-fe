import React from 'react';

const AdminGuideTerimaPreview = ({ currentStep }) => {
  return (
    <>
      {currentStep === 1 && (
        <div className="admin-preview-table-card">
          <div className="admin-preview-table-header">
            <button className="admin-preview-bulk-btn" type="button" disabled>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}>
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <polyline points="9 11 12 14 22 4"></polyline>
              </svg>
              Pilih beberapa
            </button>
          </div>
          <table className="admin-preview-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>12/02/2026</td>
                <td><span className="admin-preview-badge yellow">Menunggu Verifikasi</span></td>
                <td><button className="admin-preview-action-btn">Lihat detail</button></td>
              </tr>
              <tr className="highlighted-row">
                <td>12/02/2026</td>
                <td><span className="admin-preview-badge yellow">Menunggu Verifikasi</span></td>
                <td><button className="admin-preview-action-btn highlighted">Lihat detail</button></td>
              </tr>
              <tr>
                <td>12/02/2026</td>
                <td><span className="admin-preview-badge yellow">Menunggu Verifikasi</span></td>
                <td><button className="admin-preview-action-btn">Lihat detail</button></td>
              </tr>
            </tbody>
          </table>
          <div className="admin-preview-pagination">
            <button className="admin-preview-page-btn red">Sebelumnya</button>
            <span className="admin-preview-page-num active">1</span>
            <span className="admin-preview-page-num">2</span>
            <span className="admin-preview-page-num">3</span>
            <button className="admin-preview-page-btn red">Selanjutnya</button>
          </div>
        </div>
      )}

      {(currentStep === 2 || currentStep === 3) && (
        <div className="admin-preview-detail-card">
          <div className="admin-preview-detail-header">
            <h3>Detail Laporan</h3>
            <span className="admin-preview-close-icon">&times;</span>
          </div>

          {currentStep === 2 && (
            <div className="admin-preview-detail-row">
              <span className="admin-preview-label">Status Laporan</span>
              <span className="admin-preview-badge yellow">Menunggu Verifikasi</span>
            </div>
          )}

          {currentStep === 2 && (
            <div className="admin-preview-section">
              <div className="admin-preview-section-title">Lokasi</div>
              <div className="admin-preview-sublabel">Jenis Lokasi</div>
              <div className="admin-preview-value">Dalam Gedung</div>
              <div className="admin-preview-grid-2col">
                <div>
                  <div className="admin-preview-sublabel">Nama Gedung</div>
                  <div className="admin-preview-value bold">Gedung A</div>
                </div>
                <div>
                  <div className="admin-preview-sublabel">Nama Ruangan</div>
                  <div className="admin-preview-value bold">KU3.02.12</div>
                </div>
              </div>
            </div>
          )}

          <div className="admin-preview-section">
            <div className="admin-preview-section-title">Deskripsi Masalah</div>
            <p className="admin-preview-desc">
              AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala
            </p>
          </div>

          <div className="admin-preview-section">
            <div className="admin-preview-section-title">Bukti Foto</div>
            <div className="admin-preview-photos">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Bukti 1" />
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Bukti 2" />
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Bukti 3" />
            </div>
          </div>

          <div className="admin-preview-section">
            <div className="admin-preview-sublabel">Pelapor</div>
            <div className="admin-preview-reporter">Anonim</div>
          </div>

          {currentStep === 3 && (
            <div className="admin-preview-warning-box">
              <div className="admin-preview-warning-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" style={{ marginRight: '6px' }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Perhatian
              </div>
              <p className="admin-preview-warning-text">
                Verifikasi ini akan memberitahu pelapor bahwa laporan telah diterima dan sedang dalam antrean pengerjaan
              </p>
            </div>
          )}

          {currentStep === 3 && (
            <div className="admin-preview-actions-row">
              <button className="admin-preview-btn-grey" type="button">Tolak Laporan</button>
              <button className="admin-preview-btn-red" type="button">Verifikasi Laporan</button>
            </div>
          )}
        </div>
      )}

      {currentStep === 4 && (
        <div className="admin-preview-detail-card">
          <div className="admin-preview-detail-header">
            <h3>Detail Laporan</h3>
            <span className="admin-preview-close-icon">&times;</span>
          </div>

          <div className="admin-preview-section">
            <div className="admin-preview-section-title">Deskripsi Masalah</div>
            <p className="admin-preview-desc">
              AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala
            </p>
          </div>

          <div className="admin-preview-section">
            <div className="admin-preview-section-title">Bukti Foto</div>
            <div className="admin-preview-photos">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Bukti 1" />
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Bukti 2" />
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Bukti 3" />
            </div>
          </div>

          <div className="admin-preview-section">
            <div className="admin-preview-sublabel">Pelapor</div>
            <div className="admin-preview-reporter">Anonim</div>
          </div>

          <div className="admin-preview-warning-box">
            <div className="admin-preview-warning-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" style={{ marginRight: '6px' }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Perhatian
            </div>
            <p className="admin-preview-warning-text">
              Verifikasi ini akan memberitahu pelapor bahwa laporan telah diterima dan sedang dalam antrean pengerjaan
            </p>
          </div>

          <div className="admin-preview-actions-row">
            <button className="admin-preview-btn-grey" type="button">Tolak Laporan</button>
            <button className="admin-preview-btn-red active-glow" type="button">Verifikasi Laporan</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminGuideTerimaPreview;
