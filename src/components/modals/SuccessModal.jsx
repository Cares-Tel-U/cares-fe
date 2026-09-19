import React from 'react';

const SuccessModal = ({ message = 'Laporan berhasil diverifikasi', onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500">
          <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-bold text-gray-800 text-base mb-6">{message}</h3>
        <button
          onClick={onClose}
          className="w-full bg-[#dc2626] text-white font-semibold py-2.5 rounded-xl text-xs hover:bg-red-700 transition"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;