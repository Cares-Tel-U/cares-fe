import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './GuideModal.css';

const GUIDE_DATA = {
  terima: {
    sectionTitle: 'Cara memverifikasi laporan',
    sectionSub: 'Ikuti langkah berikut untuk memverifikasi laporan',
    steps: [
      {
        step: 1,
        title: 'Pilih laporan yang menunggu diverifikasi',
        description: 'Pilih laporan dengan status Menunggu Verifikasi dari daftar laporan untuk mulai melakukan pemeriksaan.'
      },
      {
        step: 2,
        title: 'Buka detail laporan',
        description: 'Klik Lihat Detail untuk memeriksa informasi laporan, seperti fasilitas, lokasi, deskripsi masalah, dan bukti foto.'
      },
      {
        step: 3,
        title: 'Periksa laporan',
        description: 'Pastikan informasi yang diberikan sudah sesuai dan laporan dapat diverifikasi. Jika terdapat laporan dengan fasilitas dan lokasi yang sama, periksa laporan terkait untuk memastikan laporan tersebut bukan laporan yang sama.'
      },
      {
        step: 4,
        title: 'Verifikasi laporan',
        description: 'Jika laporan sudah sesuai, klik Verifikasi Laporan untuk menerima laporan dan mengubah status laporan menjadi Diproses.'
      }
    ]
  },
  tolak: {
    sectionTitle: 'Cara menolak laporan',
    sectionSub: 'Ikuti langkah berikut untuk menolak laporan',
    steps: [
      {
        step: 1,
        title: 'Pilih laporan yang menunggu diverifikasi',
        description: 'Pilih laporan dengan status Menunggu Verifikasi dari daftar laporan untuk mulai melakukan pemeriksaan.'
      },
      {
        step: 2,
        title: 'Buka detail laporan',
        description: 'Klik Lihat Detail untuk memeriksa informasi laporan, seperti fasilitas, lokasi, deskripsi masalah, dan bukti foto.'
      },
      {
        step: 3,
        title: 'Periksa laporan',
        description: 'Pastikan informasi yang diberikan sudah sesuai dan laporan dapat diverifikasi. Jika terdapat laporan dengan fasilitas dan lokasi yang sama, periksa laporan terkait untuk memastikan laporan tersebut bukan laporan yang sama.'
      },
      {
        step: 4,
        title: 'Pilih tolak laporan',
        description: 'Klik Tolak Laporan untuk membuka formulir penolakan.'
      },
      {
        step: 5,
        title: 'Tulis alasan penolakan',
        description: 'Masukkan alasan mengapa laporan ditolak pada kolom yang tersedia. Alasan harus jelas agar dapat menjadi informasi bagi pelapor.'
      },
      {
        step: 6,
        title: 'Konfirmasi penolakan',
        description: 'Klik Tolak Laporan pada formulir untuk mengonfirmasi penolakan laporan.'
      }
    ]
  },
  selesai: {
    sectionTitle: 'Cara selesaikan laporan',
    sectionSub: 'Ikuti langkah berikut untuk selesaikan laporan',
    steps: [
      {
        step: 1,
        title: 'Pilih laporan yang sedang diproses',
        description: 'Pilih laporan dengan status Diproses yang telah selesai ditangani di lapangan.'
      },
      {
        step: 2,
        title: 'Buka detail laporan',
        description: 'Klik Lihat Detail untuk melihat informasi laporan yang akan diselesaikan.'
      },
      {
        step: 3,
        title: 'Pilih laporan selesai',
        description: 'Pastikan fasilitas, lokasi, dan deskripsi masalah sesuai dengan laporan yang akan diselesaikan dan klik Laporan Selesai untuk melanjutkan proses penyelesaian laporan.'
      },
      {
        step: 4,
        title: 'Periksa kembali laporan',
        description: 'Pada halaman Respons Laporan, periksa kembali laporan yang akan diselesaikan sebelum memberikan respons pada bagian preview laporan'
      },
      {
        step: 5,
        title: 'Tambahkan bukti perbaikan',
        description: 'Unggah foto yang menunjukkan kondisi fasilitas setelah dilakukan perbaikan sebagai bukti penyelesaian laporan.'
      },
      {
        step: 6,
        title: 'Selesaikan laporan',
        description: 'Setelah bukti perbaikan ditambahkan dan informasi sudah sesuai, klik Laporan Selesai untuk menyelesaikan laporan.'
      }
    ]
  }
};

const AdminGuideModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('terima'); // 'terima' | 'tolak' | 'selesai'
  const [currentStep, setCurrentStep] = useState(1);
  const stepsListRef = useRef(null);

  // Reset ke langkah 1 setiap modal dibuka
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  // Auto scroll list langkah di panel kanan ke bawah saat langkah bertambah atau tab berganti
  useEffect(() => {
    if (stepsListRef.current) {
      stepsListRef.current.scrollTop = stepsListRef.current.scrollHeight;
    }
  }, [currentStep, activeTab]);

  if (!isOpen) return null;

  const currentGuide = GUIDE_DATA[activeTab] || GUIDE_DATA.terima;
  const currentSteps = currentGuide.steps;

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentStep(1);
  };

  const handleNext = () => {
    if (currentStep < currentSteps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const modalNode = (
    <div className="admin-guide-backdrop" onClick={onClose}>
      <div className="admin-guide-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="admin-guide-content-grid">
          
          {/* Panel Kiri: Preview UI Admin */}
          <div className="admin-guide-left-panel">
            <h2 className="admin-guide-main-title">Panduan untuk Admin</h2>

            <div className="admin-guide-preview-wrapper">
              
              {/* =============================================================== */}
              {/* TAB TERIMA LAPORAN PREVIEW                                      */}
              {/* =============================================================== */}
              {activeTab === 'terima' && (
                <>
                  {/* TERIMA LANGKAH 1: Tabel Daftar Laporan */}
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

                  {/* TERIMA LANGKAH 2 & 3: Detail Laporan */}
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

                  {/* TERIMA LANGKAH 4: Modal Detail dengan Tombol Verifikasi Terkunci/Aktif */}
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
              )}

              {/* =============================================================== */}
              {/* TAB TOLAK LAPORAN PREVIEW                                        */}
              {/* =============================================================== */}
              {activeTab === 'tolak' && (
                <>
                  {/* TOLAK LANGKAH 1 & 2: Tabel Daftar Laporan */}
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
                            <td><span className="admin-preview-badge yellow">Menunggu Verifikasi</span></td>
                            <td><button className="admin-preview-action-btn red-outline">Lihat detail</button></td>
                          </tr>
                          <tr className={currentStep === 2 ? 'highlighted-row' : ''}>
                            <td className="admin-preview-snippet-cell">n dan yan...</td>
                            <td>12/02/2026</td>
                            <td><span className="admin-preview-badge yellow">Menunggu Verifikasi</span></td>
                            <td>
                              <button className={`admin-preview-action-btn red-outline ${currentStep === 2 ? 'highlighted' : ''}`}>
                                Lihat detail
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td className="admin-preview-snippet-cell">n dan yan...</td>
                            <td>12/02/2026</td>
                            <td><span className="admin-preview-badge yellow">Menunggu Verifikasi</span></td>
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

                  {/* TOLAK LANGKAH 3: Detail Laporan Lengkap (Pemeriksaan) */}
                  {currentStep === 3 && (
                    <div className="admin-preview-detail-card">
                      <div className="admin-preview-detail-header">
                        <h3>Detail Laporan</h3>
                        <span className="admin-preview-close-icon">&times;</span>
                      </div>

                      <div className="admin-preview-detail-row">
                        <span className="admin-preview-label">Status Laporan</span>
                        <span className="admin-preview-badge yellow">Menunggu Verifikasi</span>
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
                    </div>
                  )}

                  {/* TOLAK LANGKAH 4: Detail Laporan dengan Tombol Tolak Laporan */}
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
                        <button className="admin-preview-btn-grey highlighted-target" type="button">Tolak Laporan</button>
                        <button className="admin-preview-btn-red" type="button">Verifikasi Laporan</button>
                      </div>
                    </div>
                  )}

                  {/* TOLAK LANGKAH 5 & 6: Modal Formulir Penolakan */}
                  {(currentStep === 5 || currentStep === 6) && (
                    <div className="admin-preview-reject-card">
                      <div className="admin-preview-reject-header">
                        <h3>Tolak Laporan</h3>
                        <span className="admin-preview-close-icon">&times;</span>
                      </div>
                      <div className="admin-preview-reject-body">
                        <label className="admin-preview-reject-label">Alasan penolakan</label>
                        <div className="admin-preview-reject-textarea-mock">
                          <span className="admin-preview-reject-placeholder">Masukkan alasan laporan ditolak</span>
                        </div>
                        <button 
                          className={`admin-preview-reject-submit-btn ${currentStep === 6 ? 'active-target' : ''}`}
                          type="button"
                        >
                          Tolak Laporan
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* =============================================================== */}
              {/* TAB SELESAIKAN LAPORAN PREVIEW                                  */}
              {/* =============================================================== */}
              {activeTab === 'selesai' && (
                <>
                  {/* SELESAI LANGKAH 1 & 2: Tabel Daftar Laporan dengan status Diproses */}
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

                  {/* SELESAI LANGKAH 3: Detail Laporan dengan tombol "Laporan selesai" */}
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

                  {/* SELESAI LANGKAH 4: Preview Laporan (1) Card */}
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

                  {/* SELESAI LANGKAH 5 & 6: Form Respon Card */}
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

                        {/* Foto bukti yang sudah diunggah pada Langkah 6 */}
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
              )}

            </div>
          </div>

          {/* Panel Kanan: Tab Panduan Tindakan & List Langkah */}
          <div className="admin-guide-right-panel">
            
            {/* Top Red Header dengan Tab pilihan panduan */}
            <div className="admin-guide-red-header">
              <button className="admin-guide-close-btn" onClick={onClose} aria-label="Tutup">
                &times;
              </button>
              <h3 className="admin-guide-tab-header-title">Pilih Panduan Tindakan</h3>
              <p className="admin-guide-tab-header-sub">Pilih salah satu tab untuk melihat panduan operasional</p>
              
              <div className="admin-guide-tabs">
                <button 
                  className={`admin-guide-tab-btn ${activeTab === 'terima' ? 'active' : ''}`}
                  onClick={() => handleTabChange('terima')}
                >
                  Terima Laporan
                </button>
                <button 
                  className={`admin-guide-tab-btn ${activeTab === 'tolak' ? 'active' : ''}`}
                  onClick={() => handleTabChange('tolak')}
                >
                  Tolak Laporan
                </button>
                <button 
                  className={`admin-guide-tab-btn ${activeTab === 'selesai' ? 'active' : ''}`}
                  onClick={() => handleTabChange('selesai')}
                >
                  Selesaikan Laporan
                </button>
              </div>
            </div>

            {/* Content List Langkah Panduan */}
            <div className="admin-guide-body">
              <h3 className="admin-guide-step-section-title">{currentGuide.sectionTitle}</h3>
              <p className="admin-guide-step-section-sub">{currentGuide.sectionSub}</p>

              <div className="admin-guide-steps-list" ref={stepsListRef}>
                {currentSteps.slice(0, currentStep).map((item) => (
                  <div 
                    key={item.step} 
                    className={`admin-guide-step-card ${item.step === currentStep ? 'active' : 'completed'}`}
                  >
                    <span className="admin-guide-step-tag">Langkah {item.step}</span>
                    <h4 className="admin-guide-step-heading">{item.title}</h4>
                    <p className="admin-guide-step-desc">{item.description}</p>
                  </div>
                ))}
              </div>

              {/* Footer Navigasi Tombol */}
              <div className="admin-guide-actions-footer">
                <button 
                  type="button" 
                  className={`admin-guide-btn-prev ${currentStep === 1 ? 'disabled' : ''}`}
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                >
                  Sebelumnya
                </button>
                <button 
                  type="button" 
                  className="admin-guide-btn-next" 
                  onClick={handleNext}
                >
                  {currentStep === currentSteps.length ? 'Selesai' : 'Selanjutnya'}
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};

export default AdminGuideModal;