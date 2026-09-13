import React, { useState, useRef } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const gedungOptions = [
  { value: 'Gedung A', label: 'Gedung A (Gedung Kuliah Umum)' },
  { value: 'Gedung B', label: 'Gedung B (Tokong Nanas)' },
  { value: 'Gedung C', label: 'Gedung C (Fakultas Informatika)' },
  { value: 'TULT', label: 'TULT (Telkom University Landmark Tower)' },
  { value: 'GKB', label: 'GKB (Gedung Kuliah Bersama)' },
  { value: 'Kantin Telkom', label: 'Area Kantin' }
];

const ruanganOptionsMap = {
  'Gedung A': ['KU3.02.12', 'KU3.02.13', 'KU3.01.01', 'KU3.03.05', 'Toilet Lt. 2'],
  'Gedung B': ['TN2.01.05', 'TN1.02.04', 'Lab Rekayasa Perangkat Lunak', 'Toilet Lt. 1'],
  'Gedung C': ['IF.01.01', 'IF.02.05', 'Lab ASE', 'Lab Multimedia'],
  'TULT': ['Area Parkir Motor', 'Area Parkir Mobil', 'Lobi Utama', 'Lt. 5 Kelas 501'],
  'GKB': ['GKB.401', 'GKB.302', 'Toilet Pria Lt. 3'],
  'Kantin Telkom': ['Area Wastafel Blok C', 'Area Makan Blok A']
};

const selectStyle = (hasValue) => ({
  width: '100%',
  padding: '10px 36px 10px 12px',
  fontSize: '13.5px',
  color: hasValue ? '#1f2937' : '#9ca3af',
  backgroundColor: '#f9fafb',
  border: '1.5px solid #e5e7eb',
  borderRadius: '10px',
  outline: 'none',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  cursor: 'pointer',
  boxSizing: 'border-box',
  fontFamily: 'inherit'
});

const ReportFormSection = ({ onSubmit }) => {
  const [jenisLokasi, setJenisLokasi] = useState('Dalam Gedung');
  const [namaGedung, setNamaGedung] = useState('');
  const [namaRuangan, setNamaRuangan] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const fileInputRef = useRef(null);

  const availableRooms = namaGedung ? ruanganOptionsMap[namaGedung] || [] : [];

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedPhotos((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (index) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!namaGedung || !namaRuangan || !deskripsi) return;

    const reportData = {
      jenisLokasi,
      namaGedung,
      namaRuangan,
      lokasi: `${namaGedung} - ${namaRuangan}`,
      deskripsi,
      foto: uploadedPhotos.length > 0 ? uploadedPhotos : [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80'
      ]
    };

    onSubmit(reportData);
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)'
      }}
    >
      <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: '0 0 20px 0' }}>
        Form Laporan
      </h3>

      <form onSubmit={handleSubmit}>
        {/* Jenis Lokasi */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
            Jenis Lokasi <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Dalam Gedung', 'Area Luar'].map((val) => (
              <label key={val} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13.5px', color: '#374151' }}>
                <input
                  type="radio"
                  name="jenisLokasi"
                  value={val}
                  checked={jenisLokasi === val}
                  onChange={(e) => setJenisLokasi(e.target.value)}
                  style={{ accentColor: '#ba181b', width: '16px', height: '16px' }}
                />
                {val}
              </label>
            ))}
          </div>
        </div>

        {/* Nama Gedung & Nama Ruangan */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', display: 'block', marginBottom: '6px' }}>
              Nama Gedung <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              required
              value={namaGedung}
              onChange={(e) => { setNamaGedung(e.target.value); setNamaRuangan(''); }}
              style={selectStyle(!!namaGedung)}
            >
              <option value="" disabled>Masukkan nama gedung</option>
              {gedungOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>Pilih gedung</div>
          </div>

          <div>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', display: 'block', marginBottom: '6px' }}>
              Nama Ruangan <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <select
              required
              value={namaRuangan}
              onChange={(e) => setNamaRuangan(e.target.value)}
              disabled={!namaGedung}
              style={{ ...selectStyle(!!namaRuangan), cursor: namaGedung ? 'pointer' : 'not-allowed', opacity: namaGedung ? 1 : 0.6 }}
            >
              <option value="" disabled>Masukkan nama ruangan</option>
              {availableRooms.map((room) => (
                <option key={room} value={room}>{room}</option>
              ))}
            </select>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>Pilih ruangan</div>
          </div>
        </div>

        {/* Deskripsi */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', display: 'block', marginBottom: '6px' }}>
            Deskripsi <span style={{ color: '#dc2626' }}>*</span>
          </label>
          <textarea
            required
            rows={4}
            placeholder="Tuliskan deskripsi masalah"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '13.5px',
              color: '#1f2937',
              backgroundColor: '#f9fafb',
              border: '1.5px solid #e5e7eb',
              borderRadius: '10px',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
          <div style={{ fontSize: '11.5px', color: '#9ca3af', marginTop: '4px' }}>
            Tuliskan deskripsi masalah dengan detail
          </div>
        </div>

        {/* Foto Upload Area */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', display: 'block', marginBottom: '8px' }}>
            Foto Bukti Kerusakan
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            multiple
            accept="image/png, image/jpeg, image/jpg"
            style={{ display: 'none' }}
          />

          <div
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files);
              files.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (ev) => setUploadedPhotos((prev) => [...prev, ev.target.result]);
                reader.readAsDataURL(file);
              });
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ba181b';
              e.currentTarget.style.backgroundColor = '#fff5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.backgroundColor = '#fafafa';
            }}
            style={{
              border: '2px dashed #d1d5db',
              borderRadius: '12px',
              padding: '28px 20px',
              textAlign: 'center',
              backgroundColor: '#fafafa',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                backgroundColor: '#e5e7eb', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16"></polyline>
                  <line x1="12" y1="12" x2="12" y2="21"></line>
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
                </svg>
              </div>
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#374151' }}>
              Seret ke sini atau klik untuk dipilih
            </div>
            <div style={{ fontSize: '11.5px', color: '#9ca3af', marginTop: '4px' }}>
              Format JPG, PNG - Maks. 5 MB per foto
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current && fileInputRef.current.click();
              }}
              style={{
                marginTop: '14px',
                backgroundColor: 'transparent',
                border: '1.5px solid #ba181b',
                color: '#ba181b',
                borderRadius: '8px',
                padding: '7px 20px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fff5f5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Pilih dari perangkat
            </button>
          </div>

          {/* Photo Previews */}
          {uploadedPhotos.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
              {uploadedPhotos.map((src, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    style={{ width: '74px', height: '74px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e5e7eb' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
          <Button type="submit" variant="primary" size="md">
            Laporkan
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReportFormSection;