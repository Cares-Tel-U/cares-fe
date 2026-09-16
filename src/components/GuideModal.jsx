import React, { useState, useEffect, useRef } from 'react';
import './GuideModal.css';

const STEPS_DATA = [
  {
    step: 1,
    title: 'Pilih Preferensi Pelaporan',
    description: 'Tentukan apakah laporan ingin dikirim secara anonim dengan mengaktifkan atau menonaktifkan pilihan anonim.'
  },
  {
    step: 2,
    title: 'Pilih Jenis Lokasi',
    description: 'Tentukan apakah masalah fasilitas berada di dalam gedung atau di area luar gedung.'
  },
  {
    step: 3,
    title: 'Tentukan Lokasi Masalah',
    description: 'Jika memilih gedung, pilih nama gedung dan ruangan. Jika memilih area luar, pilih area dan lokasi masalah.'
  },
  {
    step: 4,
    title: 'Jelaskan Masalah',
    description: 'Jelaskan masalah fasilitas secara singkat dan jelas agar dapat membantu proses pemeriksaan dan penanganan laporan.'
  },
  {
    step: 5,
    title: 'Tambahkan Bukti Foto',
    description: 'Tambahkan foto kondisi fasilitas sebagai bukti untuk membantu petugas memahami masalah yang dilaporkan.'
  },
  {
    step: 6,
    title: 'Kirim Laporan',
    description: 'Periksa kembali informasi yang telah dimasukkan, lalu tekan Kirim Laporan. Setelah terkirim, tunggu laporan diverifikasi dan diproses.'
  }
];

// Gambar contoh thumbnail sesuai mockup
const SAMPLE_THUMBNAILS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
];

const GuideModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const stepsListRef = useRef(null);

  // Reset step ke 1 setiap kali modal dibuka
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  // Auto scroll list langkah di panel kanan ke paling bawah
  useEffect(() => {
    if (stepsListRef.current) {
      stepsListRef.current.scrollTop = stepsListRef.current.scrollHeight;
    }
  }, [currentStep]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < STEPS_DATA.length) {
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

  return (
    <div className="guide-backdrop" onClick={onClose}>
      <div className="guide-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Tombol Close */}
        <button className="guide-close-btn" onClick={onClose} aria-label="Tutup">
          &times;
        </button>

        <div className="guide-content-grid">
          {/* Panel Kiri: Preview Form */}
          <div className="guide-left-panel">
            <div className="guide-header-row">
              <h2 className="guide-title">Panduan Melapor</h2>
              <span className="guide-step-badge">{currentStep} dari 6 langkah</span>
            </div>

            <div className="guide-preview-container">
              {/* LANGKAH 1 */}
              {currentStep === 1 && (
                <div className="guide-card">
                  <h3 className="guide-card-title">Identitas Pelapor</h3>
                  <div className="guide-info-row">
                    <span className="guide-label">Nama Pelapor</span>
                    <span className="guide-value">Amba Ngawi</span>
                  </div>
                  <div className="guide-info-row">
                    <span className="guide-label">Email Pelapor</span>
                    <span className="guide-value">amba@gmail.com</span>
                  </div>
                  <label className="guide-checkbox-label">
                    <input type="checkbox" defaultChecked readOnly />
                    <span>Sembunyikan identitas pelapor</span>
                  </label>
                </div>
              )}

              {/* LANGKAH 2 DSK */}
              {currentStep >= 2 && (
                <div className="guide-card">
                  <h3 className="guide-card-title">Form Laporan</h3>
                  
                  {/* Jenis Lokasi */}
                  <div className="guide-form-group">
                    <label className="guide-field-label">Jenis Lokasi</label>
                    <div className="guide-radio-group">
                      <label className="guide-radio-label">
                        <input type="radio" name="locationType" defaultChecked readOnly />
                        <span>Dalam Gedung</span>
                      </label>
                      <label className="guide-radio-label">
                        <input type="radio" name="locationType" readOnly />
                        <span>Area Luar</span>
                      </label>
                    </div>
                  </div>

                  {/* Gedung & Ruangan (Langkah 3+) */}
                  {currentStep >= 3 && (
                    <div className="guide-grid-2col">
                      <div className="guide-form-group">
                        <label className="guide-field-label">Nama Gedung</label>
                        <select className="guide-input-select" value="Gedung GKU" disabled>
                          <option value="Gedung GKU">Gedung GKU</option>
                        </select>
                        <span className="guide-helper-text">Pilih gedung</span>
                      </div>
                      <div className="guide-form-group">
                        <label className="guide-field-label">Nama Ruangan</label>
                        <select className="guide-input-select" value="KU3.03.12" disabled>
                          <option value="KU3.03.12">KU3.03.12</option>
                        </select>
                        <span className="guide-helper-text">Pilih ruangan</span>
                      </div>
                    </div>
                  )}

                  {/* Deskripsi (Langkah 4+) */}
                  {currentStep >= 4 && (
                    <div className="guide-form-group">
                      <label className="guide-field-label">Deskripsi</label>
                      <textarea 
                        className="guide-textarea" 
                        value="AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala" 
                        readOnly 
                      />
                      <span className="guide-helper-text">Tuliskan deskripsi masalah dengan detail</span>
                    </div>
                  )}

                  {/* Upload Foto & Thumbnail (Langkah 5 & 6) */}
                  {currentStep >= 5 && (
                    <div className="guide-form-group">
                      <label className="guide-field-label">Foto</label>
                      <div className="guide-upload-box">
                        <div className="guide-upload-icon">↑</div>
                        <p className="guide-upload-text">
                          <strong>Seret ke sini</strong> atau klik untuk dipilih
                        </p>
                        <span className="guide-upload-sub">Format JPG, PNG · Maks. 5 MB per foto</span>
                        <button type="button" className="guide-upload-btn">Pilih dari perangkat</button>
                      </div>

                      {/* Thumbnail Foto */}
                      <div className="guide-thumbnails-wrapper">
                        {SAMPLE_THUMBNAILS.map((imgSrc, idx) => (
                          <div key={idx} className="guide-thumbnail-item">
                            <img src={imgSrc} alt={`Bukti foto ${idx + 1}`} />
                          </div>
                        ))}
                      </div>

                      {/* Tombol Laporkan dalam Form Preview */}
                      <div className="guide-submit-row">
                        <button 
                          type="button" 
                          className={`guide-btn-submit ${currentStep === 6 ? 'active' : 'disabled'}`}
                          disabled={currentStep === 5}
                        >
                          Laporkan
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Panel Kanan */}
          <div className="guide-right-panel">
            <div className="guide-right-header">
              <h3>Cara membuat laporan</h3>
              <p>Ikuti langkah berikut untuk melaporkan masalah fasilitas kampus secara cepat dan akurat</p>
            </div>

            {/* List Langkah */}
            <div className="guide-steps-list" ref={stepsListRef}>
              {STEPS_DATA.slice(0, currentStep).map((item) => (
                <div 
                  key={item.step} 
                  className={`guide-step-card ${item.step === currentStep ? 'active' : 'completed'}`}
                >
                  <span className="guide-step-tag">Langkah {item.step}</span>
                  <h4 className="guide-step-heading">{item.title}</h4>
                  <p className="guide-step-desc">{item.description}</p>
                </div>
              ))}
            </div>

            {/* Footer Navigasi */}
            <div className="guide-actions-footer">
              {currentStep > 1 && (
                <button type="button" className="guide-btn-prev" onClick={handlePrev}>
                  Sebelumnya
                </button>
              )}
              <button type="button" className="guide-btn-next" onClick={handleNext}>
                {currentStep === STEPS_DATA.length ? 'Selesai' : 'Selanjutnya'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;