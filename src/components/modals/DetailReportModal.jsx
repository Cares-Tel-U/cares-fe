import React from 'react';
import StatusBadge from '../admin/StatusBadge';

const DetailReportModal = ({ report, onClose, onVerify, onOpenReject }) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 bg-gray-100 p-1 rounded-full"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-lg font-bold text-gray-800 mb-4">Detail Laporan</h2>

        <div className="space-y-4 text-xs">
          <div>
            <span className="text-gray-400 block mb-1">Status Laporan</span>
            <StatusBadge status={report.status} />
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Lokasi</span>
            <p className="font-bold text-gray-800 text-sm">{report.jenisLokasi || 'Dalam Gedung'}</p>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div>
                <span className="text-gray-400">Nama Gedung</span>
                <p className="font-semibold text-gray-700">{report.gedung || 'Gedung A'}</p>
              </div>
              <div>
                <span className="text-gray-400">Nama Ruangan</span>
                <p className="font-semibold text-gray-700">{report.ruangan || 'KU3.02.12'}</p>
              </div>
            </div>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Deskripsi Masalah</span>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
              {report.deskripsi || 'AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala'}
            </p>
          </div>

          <div>
            <span className="text-gray-400 block mb-2">Bukti Foto</span>
            <div className="flex gap-2">
              {[1, 2, 3].map((_, i) => (
                <img
                  key={i}
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Bukti"
                  className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                />
              ))}
            </div>
          </div>

          <div>
            <span className="text-gray-400 block">Pelapor</span>
            <span className="text-red-600 font-bold text-sm">Anonim</span>
          </div>

          {/* Banner Perhatian untuk Verifikasi */}
          {report.status === 'Menunggu Verifikasi' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start space-x-2">
              <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h4 className="font-bold text-red-700">Perhatian</h4>
                <p className="text-red-600 text-[11px]">
                  Verifikasi ini akan memberitahu pelapor bahwa laporan telah diterima dan sedang dalam antrean pengerjaan
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {report.status === 'Menunggu Verifikasi' && (
            <div className="flex space-x-3 pt-2">
              <button
                onClick={onOpenReject}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition text-xs"
              >
                Tolak Laporan
              </button>
              <button
                onClick={onVerify}
                className="flex-1 bg-[#dc2626] hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition text-xs shadow-md"
              >
                Verifikasi Laporan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailReportModal;