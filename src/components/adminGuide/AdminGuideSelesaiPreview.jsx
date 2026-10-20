import React from 'react';

const AdminGuideSelesaiPreview = ({ currentStep }) => {
  return (
    <>
      {(currentStep === 1 || currentStep === 2) && (
        <div className="admin-preview-table-card">
          <div className="admin-preview-table-header">
            <button className="admin-preview-bulk-btn red-border" type="button" disabled>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '5px' }}>
                <rect x="3" y="3" width="18" height="18" rx="2"></rect>
                <polyline points="9 11 12 14 22 4"></polyline>
              </svg>
              Pilih beberapa
            </button>
          </div>
          <table className="admin-preview-table">
            <thead>
              <tr>
                <th style={{ width: '28%' }}></th>
                <th style={{ width: '24%' }}>Tanggal</th>
                <th style={{ width: '28%' }}>Status</th>
                <th style={{ width: '20%' }}></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="admin-preview-snippet-cell">n dan yan...</td>
                <td>12/02/2026</td>
                <td><span className="admin-preview-badge cyan">Diproses</span></td>
                <td><button className="admin-preview-action-btn red-outline">Lihat detail</button></td>
              </tr>
              <tr className={currentStep === 2 ? 'highlighted-row' : ''}>
                <td className="admin-preview-snippet-cell">n dan yan...</td>
                <td>12/02/2026</td>
                <td><span className="admin-preview-badge cyan">Diproses</span></td>
                <td>
                  <button className={`admin-preview-action-btn red-outline ${currentStep === 2 ? 'highlighted' : ''}`}>
                    Lihat detail
                  </button>
                </td>
              </tr>
              <tr>
                <td className="admin-preview-snippet-cell">n dan yan...</td>
                <td>12/02/2026</td>
                <td><span className="admin-preview-badge cyan">Diproses</span></td>
                <td><button className="admin-preview-action-btn red-outline">Lihat detail</button></td>
              </tr>
            </tbody>
          </table>
          <div className="admin-preview-pagination">
            <button className="admin-preview-page-btn red">Sebelumnya</button>
            <span className="admin-preview-page-num active-underline">1</span>
            <span className="admin-preview-page-num">2</span>
            <span className="admin-preview-page-num">3</span>
            <button className="admin-preview-page-btn red">Selanjutnya</button>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="admin-preview-detail-card">
          <div className="admin-preview-detail-header">
            <h3>Detail Laporan</h3>
            <span className="admin-preview-close-icon">&times;</span>
          </div>

          <div className="admin-preview-detail-row">
            <span className="admin-preview-label">Status Laporan</span>
            <span className="admin-preview-badge cyan">Diproses</span>
          </div>

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

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <button 
              className="admin-preview-btn-red" 
              type="button"
              style={{ padding: '9px 32px', minWidth: '170px' }}
            >
              Laporan selesai
            </button>
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="admin-preview-list-card">
          <div className="admin-preview-list-header">
            Preview Laporan (1)
          </div>

          <div className="admin-preview-inner-card">
            <div className="admin-preview-inner-header">
              <span className="admin-preview-inner-title">Laporan 1</span>
              <button className="admin-preview-trash-btn" type="button" aria-label="Hapus">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
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

            <div className="admin-preview-section" style={{ marginBottom: 0 }}>
              <div className="admin-preview-sublabel">Pelapor</div>
              <div style={{ fontSize: '12px', fontWeight: '500', color: '#374151' }}>Anonim</div>
            </div>
          </div>
        </div>
      )}

      {(currentStep === 5 || currentStep === 6) && (
        <div className="admin-preview-form-card">
          <h3 className="admin-preview-form-header">Form Respon</h3>

          <div className="admin-preview-detail-row">
            <span className="admin-preview-label">Status saat ini</span>
            <span className="admin-preview-badge cyan">Diproses</span>
          </div>

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

          <div className="admin-preview-section">
            <div className="admin-preview-section-title">Bukti Perbaikan Fasilitas</div>
            
            <div className="admin-preview-dropzone">
              <div className="admin-preview-dropzone-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
              </div>
              <p className="admin-preview-dropzone-title">
                Seret ke sini <span style={{ fontWeight: 400, color: '#64748b' }}>atau klik untuk dipilih</span>
              </p>
              <p className="admin-preview-dropzone-sub">
                Format JPG, PNG · Maks. 5 MB per foto
              </p>
              <button className="admin-preview-dropzone-btn" type="button">
                Pilih dari perangkat
              </button>
            </div>

            {currentStep === 6 && (
              <div className="admin-preview-photos" style={{ marginTop: '10px', marginBottom: '14px' }}>
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Bukti 1" />
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Bukti 2" />
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Bukti 3" />
              </div>
            )}
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
              Proses ini akan memberitahu pelapor bahwa laporan telah telah selesai dan fasiltas yang dilaporkan sudah diperbaiki
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button 
              className={`admin-preview-btn-red ${currentStep === 6 ? 'active-glow' : ''}`}
              type="button"
              style={{ width: 'auto', padding: '9px 24px' }}
            >
              Laporan Selesai
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminGuideSelesaiPreview;
