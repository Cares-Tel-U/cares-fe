import React from 'react';

const DetailModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Detail Laporan</h3>
          <button className="modal-close" onClick={onClose}>X</button>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#666666' }}>Status Laporan</div>
          <span className={`badge badge-${data.statusType}`}>{data.status}</span>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#666666' }}>Lokasi</div>
          <div style={{ fontSize: '13px', fontWeight: '600' }}>{data.lokasi}</div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#666666' }}>Deskripsi Masalah</div>
          <div style={{ fontSize: '13px' }}>{data.deskripsi}</div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: '#666666' }}>Bukti Foto</div>
          <div className="image-gallery">
            <img src="https://via.placeholder.com/80" alt="Bukti 1" />
            <img src="https://via.placeholder.com/80" alt="Bukti 2" />
          </div>
        </div>

        <div>
          <div style={{ fontSize: '12px', color: '#666666', marginBottom: '8px' }}>Timeline Laporan</div>
          <div className="timeline">
            <div className="timeline-item active">
              <div className="timeline-title">Laporan terkirim</div>
              <div className="timeline-date">{data.tanggal}</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-title">Laporan berhasil diverifikasi</div>
              <div className="timeline-date">-</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-title">Laporan dalam proses</div>
              <div className="timeline-date">-</div>
            </div>
            <div className="timeline-item">
              <div className="timeline-title">Laporan selesai</div>
              <div className="timeline-date">-</div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px' }}>
          <div style={{ fontSize: '12px', color: '#666666' }}>Status Pelapor</div>
          <div style={{ fontSize: '13px', color: '#cb2a2a', fontWeight: '600' }}>
            {data.isAnonim ? 'Anonim' : 'Publik'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;