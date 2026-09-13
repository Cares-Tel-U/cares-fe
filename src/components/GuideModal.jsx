import React, { useEffect, useState } from 'react';

const steps = [
  {
    title: 'Pilih Preferensi Pelaporan',
    description:
      'Tentukan apakah laporan ingin dikirim secara anonim dengan mengaktifkan atau menonaktifkan pilihan anonim.'
  },
  {
    title: 'Pilih Jenis Lokasi',
    description:
      'Tentukan apakah masalah fasilitas berada di dalam gedung atau di area luar gedung.'
  },
  {
    title: 'Tentukan Lokasi Masalah',
    description:
      'Jika memilih gedung, pilih nama gedung dan ruangan. Jika memilih area luar, pilih area dan lokasi masalah.'
  },
  {
    title: 'Jelaskan Masalah',
    description:
      'Jelaskan masalah fasilitas secara singkat dan jelas agar dapat membantu proses pemeriksaan dan penanganan laporan.'
  },
  {
    title: 'Tambahkan Bukti Foto',
    description:
      'Tambahkan foto kondisi fasilitas sebagai bukti untuk membantu petugas memahami masalah yang dilaporkan.'
  },
  {
    title: 'Kirim Laporan',
    description:
      'Periksa kembali informasi yang telah dimasukkan, lalu tekan Kirim Laporan. Setelah terkirim, tunggu laporan diverifikasi dan diproses.'
  }
];

const IdentityCard = () => (
  <section className="guide-form-card">
    <h3>Identitas Pelapor</h3>

    <div className="guide-identity-row">
      <span>Nama Pelapor</span>
      <strong>Amba Ngawi</strong>
    </div>

    <div className="guide-identity-row">
      <span>Email Pelapor</span>
      <strong>amba@gmail.com</strong>
    </div>

    <label className="guide-checkbox">
      <input type="checkbox" defaultChecked readOnly />
      <span>Sembunyikan identitas pelapor</span>
    </label>
  </section>
);

const SelectPreview = ({ label, value, placeholder, helper }) => (
  <label className="guide-field">
    <span>{label}</span>

    <div
      className={
        value
          ? 'guide-select-preview'
          : 'guide-select-preview is-empty'
      }
    >
      {value || placeholder}
      <b>⌄</b>
    </div>

    <small>{helper}</small>
  </label>
);

const ReportCard = ({ activeStep }) => {
  const showLocationType = activeStep >= 1;
  const showLocation = activeStep >= 2;
  const showDescription = activeStep >= 3;
  const showPhoto = activeStep >= 4;
  const showSubmit = activeStep >= 5;

  return (
    <section className="guide-form-card guide-report-card">
      <h3>Form Laporan</h3>

      <div className="guide-form-body">
        {showLocationType && (
          <div className="guide-field">
            <span>Jenis Lokasi</span>

            <div className="guide-radios">
              <label>
                <input
                  type="radio"
                  name="location"
                  defaultChecked
                  readOnly
                />
                Dalam Gedung
              </label>

              <label>
                <input
                  type="radio"
                  name="location"
                  readOnly
                />
                Area Luar
              </label>
            </div>
          </div>
        )}

        {showLocation && (
          <div className="guide-field-grid">
            <SelectPreview
              label="Nama Gedung"
              value="Gedung GKU"
              placeholder="Masukkan nama gedung"
              helper="Pilih gedung"
            />

            <SelectPreview
              label="Nama Ruangan"
              value="KU3.03.12"
              placeholder="Masukkan nama ruangan"
              helper="Pilih ruangan"
            />
          </div>
        )}

        {showDescription && (
          <label className="guide-field">
            <span>Deskripsi</span>

            <div className="guide-text-preview is-filled">
              AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak
              bisa nyala
            </div>

            <small>
              Tuliskan deskripsi masalah dengan detail
            </small>
          </label>
        )}

        {showPhoto && (
          <div className="guide-field">
            <span>Foto</span>

            <div className="guide-upload-preview">
              <div className="guide-upload-icon">↥</div>

              <b>Seret ke sini atau klik untuk dipilih</b>

              <small>
                Format JPG, PNG · Maks. 5 MB per foto
              </small>

              <button type="button">
                Pilih dari perangkat
              </button>
            </div>

            <div
              className="guide-photo-row"
              aria-label="Tiga foto bukti"
            >
              <i />
              <i />
              <i />
            </div>
          </div>
        )}

        {showSubmit && (
          <div className="guide-submit-row">
            <button type="button">
              Laporkan
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const FormPreview = ({ activeStep }) => {
  if (activeStep === 0) {
    return (
      <div className="guide-preview-scroll">
        <div className="guide-preview-inner">
          <IdentityCard />
        </div>
      </div>
    );
  }

  return (
    <div className="guide-preview-scroll">
      <div className="guide-preview-inner">
        <IdentityCard />
        <ReportCard activeStep={activeStep} />
      </div>
    </div>
  );
};

const GuideModal = ({ isOpen, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setActiveStep(0);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep((step) => step - 1);
    }
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((step) => step + 1);
      return;
    }

    onClose();
  };

  const currentStep = steps[activeStep];

  return (
    <div
      className="guide-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="guide-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
      >
        <button
          className="guide-close"
          type="button"
          onClick={onClose}
          aria-label="Tutup panduan"
        >
          ×
        </button>

        <div className="guide-layout">
          <section
            className="guide-preview-panel"
            aria-label="Preview form laporan"
          >
            <header className="guide-preview-header">
              <h2 id="guide-title">
                Panduan Melapor
              </h2>

              <span className="guide-badge">
                {activeStep + 1} dari {steps.length} langkah
              </span>
            </header>

            <FormPreview activeStep={activeStep} />
          </section>

          <section
            className="guide-steps-panel"
            aria-label="Langkah panduan"
          >
            <header className="guide-steps-header">
              <h3>Cara membuat laporan</h3>

              <p>
                Ikuti langkah berikut untuk melaporkan masalah fasilitas
                kampus secara cepat dan akurat.
              </p>
            </header>

            <div className="guide-step-list">
              <div className="guide-step-card is-active">
                <span>
                  Langkah {activeStep + 1}
                </span>

                <b>
                  {currentStep.title}
                </b>

                <p>
                  {currentStep.description}
                </p>
              </div>
            </div>

            <footer className="guide-footer">
              <button
                className="guide-secondary"
                type="button"
                onClick={handlePrevious}
                disabled={activeStep === 0}
              >
                Sebelumnya
              </button>

              <button
                className="guide-primary"
                type="button"
                onClick={handleNext}
              >
                {activeStep === steps.length - 1
                  ? 'Selesai'
                  : 'Selanjutnya'}
              </button>
            </footer>
          </section>
        </div>
      </section>
    </div>
  );
};

export default GuideModal;