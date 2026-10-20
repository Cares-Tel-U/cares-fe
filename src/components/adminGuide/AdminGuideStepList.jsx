import React, { useEffect, useRef } from 'react';

const AdminGuideStepList = ({
  activeTab,
  onTabChange,
  currentStep,
  currentGuide,
  onPrev,
  onNext,
  onClose,
}) => {
  const stepsListRef = useRef(null);
  const currentSteps = currentGuide.steps;

  // Auto scroll list langkah di panel kanan ke bawah saat langkah bertambah atau tab berganti
  useEffect(() => {
    if (stepsListRef.current) {
      stepsListRef.current.scrollTop = stepsListRef.current.scrollHeight;
    }
  }, [currentStep, activeTab]);

  return (
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
            onClick={() => onTabChange('terima')}
          >
            Terima Laporan
          </button>
          <button
            className={`admin-guide-tab-btn ${activeTab === 'tolak' ? 'active' : ''}`}
            onClick={() => onTabChange('tolak')}
          >
            Tolak Laporan
          </button>
          <button
            className={`admin-guide-tab-btn ${activeTab === 'selesai' ? 'active' : ''}`}
            onClick={() => onTabChange('selesai')}
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
            onClick={onPrev}
            disabled={currentStep === 1}
          >
            Sebelumnya
          </button>
          <button
            type="button"
            className="admin-guide-btn-next"
            onClick={onNext}
          >
            {currentStep === currentSteps.length ? 'Selesai' : 'Selanjutnya'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminGuideStepList;
