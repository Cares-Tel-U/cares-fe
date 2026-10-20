import React from 'react';
import AdminGuideTerimaPreview from './AdminGuideTerimaPreview';
import AdminGuideTolakPreview from './AdminGuideTolakPreview';
import AdminGuideSelesaiPreview from './AdminGuideSelesaiPreview';

const AdminGuidePreview = ({ activeTab, currentStep }) => {
  return (
    <div className="admin-guide-preview-wrapper">
      {activeTab === 'terima' && (
        <AdminGuideTerimaPreview currentStep={currentStep} />
      )}

      {activeTab === 'tolak' && (
        <AdminGuideTolakPreview currentStep={currentStep} />
      )}

      {activeTab === 'selesai' && (
        <AdminGuideSelesaiPreview currentStep={currentStep} />
      )}
    </div>
  );
};

export default AdminGuidePreview;
