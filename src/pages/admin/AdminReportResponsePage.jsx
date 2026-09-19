import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import SuccessModal from '../../components/modals/SuccessModal';

const AdminReportResponsePage = ({
  user,
  reports = [],
  notifications = [],
  onMarkAllNotificationsAsRead,
  onCompleteReport,
  onLogout
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const report = reports.find((r) => String(r.id) === String(id)) || {
    id: 1,
    status: 'Diproses',
    jenisLokasi: 'Dalam Gedung',
    gedung: 'Gedung A',
    ruangan: 'KU3.02.12',
    deskripsi: 'AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala'
  };

  const handleComplete = () => {
    if (onCompleteReport) onCompleteReport(report.id, []);
    setShowSuccess(true);
  };

  return (
    <AdminLayout
      user={user}
      notifications={notifications}
      onMarkAllNotificationsAsRead={onMarkAllNotificationsAsRead}
      onLogout={onLogout}
    >
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <button onClick={() => navigate(-1)} className="hover:text-gray-800 flex items-center">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Daftar Laporan
        </button>
        <span>/</span>
        <span className="font-bold text-red-600">Respons Laporan</span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Form Respon */}
        <div className="col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="font-bold text-gray-800 text-base">Form Respon</h2>

          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <span className="text-xs text-gray-500">Status saat ini</span>
            <StatusBadge status={report.status} />
          </div>

          <div>
            <h3 className="font-bold text-gray-800 text-xs mb-2">Lokasi</h3>
            <span className="text-[11px] text-gray-400 block mb-1">Jenis Lokasi</span>
            <p className="font-bold text-xs text-gray-800 mb-3">{report.jenisLokasi || 'Dalam Gedung'}</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-gray-400 block">Nama Gedung</span>
                <p className="font-bold text-xs text-gray-800">{report.gedung || 'Gedung A'}</p>
              </div>
              <div>
                <span className="text-[11px] text-gray-400 block">Nama Ruangan</span>
                <p className="font-bold text-xs text-gray-800">{report.ruangan || 'KU3.02.12'}</p>
              </div>
            </div>
          </div>

          {/* Drag and Drop Area */}
          <div>
            <label className="block font-bold text-gray-800 text-xs mb-3">Bukti Perbaikan Fasilitas</label>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/50 hover:bg-gray-50 transition cursor-pointer flex flex-col items-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mb-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="text-xs font-bold text-gray-700">
                Seret ke sini <span className="font-normal text-gray-500">atau klik untuk dipilih</span>
              </p>
              <span className="text-[11px] text-gray-400 mt-1 mb-4">Format JPG, PNG · Maks. 5 MB per foto</span>
              <button className="border border-red-300 text-red-600 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-red-50 transition">
                Pilih dari perangkat
              </button>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start space-x-2">
            <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="text-xs font-bold text-red-700">Perhatian</h4>
              <p className="text-[11px] text-red-600">
                Proses ini akan memberitahu pelapor bahwa laporan telah selesai dan fasilitas yang dilaporkan sudah diperbaiki
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleComplete}
              className="bg-[#dc2626] hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl text-xs shadow-md transition"
            >
              Laporan Selesai
            </button>
          </div>
        </div>

        {/* Preview Laporan */}
        <div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-800 text-sm">Preview Laporan (1)</h3>

            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3 relative">
              <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <h4 className="font-bold text-red-600 text-xs">Laporan 1</h4>

              <div>
                <span className="text-[11px] font-bold text-gray-700 block mb-1">Deskripsi Masalah</span>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {report.deskripsi}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-gray-700 block mb-2">Bukti Foto</span>
                <div className="flex gap-2">
                  {[1, 2, 3].map((_, idx) => (
                    <img
                      key={idx}
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                      alt="Bukti Foto"
                      className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                    />
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-gray-700 block">Pelapor</span>
                <span className="text-xs text-red-600 font-bold">Anonim</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <SuccessModal
          message="Laporan selesai ditangani"
          onClose={() => {
            setShowSuccess(false);
            navigate('/admin/daftar-laporan');
          }}
        />
      )}
    </AdminLayout>
  );
};

export default AdminReportResponsePage;