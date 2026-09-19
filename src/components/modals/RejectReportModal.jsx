import React, { useState } from 'react';

const RejectReportModal = ({ onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 bg-gray-100 p-1 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-lg font-bold text-gray-800 mb-4">Tolak Laporan</h2>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-gray-600 font-semibold mb-1.5">Alasan penolakan</label>
            <textarea
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Masukkan alasan laporan ditolak"
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700 bg-gray-50/50"
            ></textarea>
          </div>

          <button
            onClick={() => onSubmit(reason)}
            className="w-full bg-[#dc2626] hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition text-xs shadow-md"
          >
            Tolak Laporan
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectReportModal;