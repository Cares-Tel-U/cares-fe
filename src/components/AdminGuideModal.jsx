import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { GUIDE_DATA } from '../data/adminGuideData';
import AdminGuidePreview from './adminGuide/AdminGuidePreview';
import AdminGuideStepList from './adminGuide/AdminGuideStepList';
import './GuideModal.css';

const AdminGuideModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('terima'); // 'terima' | 'tolak' | 'selesai'
  const [currentStep, setCurrentStep] = useState(1);

  // Reset ke langkah 1 setiap kali modal dibuka
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

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
          <AdminGuidePreview activeTab={activeTab} currentStep={currentStep} />

          {/* Panel Kanan: Tab Panduan & List Langkah */}
          <AdminGuideStepList
            activeTab={activeTab}
            onTabChange={handleTabChange}
            currentStep={currentStep}
            currentGuide={currentGuide}
            onPrev={handlePrev}
            onNext={handleNext}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : modalNode;
};

export default AdminGuideModal;