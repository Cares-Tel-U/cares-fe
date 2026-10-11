import React, { useState, useRef } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const gedungOptions = [
  { value: 'Kultubai Utara', label: 'Kultubai Utara' },
  { value: 'Gedung A', label: 'Gedung A (Gedung Kuliah Umum)' },
  { value: 'Gedung B', label: 'Gedung B (Tokong Nanas)' },
  { value: 'Gedung C', label: 'Gedung C (Fakultas Informatika)' },
  { value: 'TULT', label: 'TULT (Telkom University Landmark Tower)' },
  { value: 'GKB', label: 'GKB (Gedung Kuliah Bersama)' },
  { value: 'Kantin Telkom', label: 'Area Kantin' }
];

const ruanganOptionsMap = {
  'Kultubai Utara': ['RU01.01.02', 'RU01.01.03', 'RU01.02.01', 'Toilet Lt. 1'],
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
  const [namaGedung, setNamaGedung] = useState('Kultubai Utara');
  const [namaRuangan, setNamaRuangan] = useState('RU01.01.02');
  const [isCustomRoom, setIsCustomRoom] = useState(false);
  const [deskripsi, setDeskripsi] = useState('AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef(null);

  const availableRooms = namaGedung ? (ruanganOptionsMap[namaGedung] || []) : [];
  
  // Validasi: ruangan harus ada di list resmi gedung
  const isRoomValid = availableRooms.includes(namaRuangan);
  const isRoomError = Boolean(namaRuangan && !isRoomValid);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    let hasTooLarge = false;

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        hasTooLarge = true;
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          setUploadedPhotos((prev) => [...prev, event.target.result]);
        };
        reader.readAsDataURL(file);
      }
    });

    if (hasTooLarge) {
      setPhotoError('Ukuran foto terlalu besar. Maksimal 5 MB');
    } else {
      setPhotoError('');
    }
  };

  const handleRemovePhoto = (index) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRoomError) {
      return;
    }

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>
          Form Laporan
        </h3>
        <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: '500' }}>
          *Field bertanda bintang wajib diisi
        </span>
      </div>

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
              onChange={(e) => { 
                setNamaGedung(e.target.value); 
                const newRooms = ruanganOptionsMap[e.target.value] || [];
                setNamaRuangan(newRooms[0] || '');
                setIsCustomRoom(false);
              }}
              style={selectStyle(!!namaGedung)}
            >
              <option value="" disabled>Pilih gedung</option>
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

            {!isCustomRoom ? (
              <select
                required
                value={namaRuangan}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setIsCustomRoom(true);
                    setNamaRuangan('');
                  } else {
                    setNamaRuangan(e.target.value);
                  }
                }}
                disabled={!namaGedung}
                style={{ 
                  ...selectStyle(!!namaRuangan), 
                  cursor: namaGedung ? 'pointer' : 'not-allowed', 
                  opacity: namaGedung ? 1 : 0.6,
                  borderColor: isRoomError ? '#dc2626' : '#e5e7eb'
                }}
              >
                <option value="" disabled>Pilih ruangan</option>
                {availableRooms.map((room) => (
                  <option key={room} value={room}>{room}</option>
                ))}
                {/* Opsi contoh untuk menguji pesan ruangan tidak ditemukan sesuai Foto 5 */}
                <option value="Ruang Anjay">Ruang Anjay</option>
                <option value="__custom__">+ Ketik ruangan lain...</option>
              </select>
            ) : (
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="Ketik nama ruangan..."
                  value={namaRuangan}
                  onChange={(e) => setNamaRuangan(e.target.value)}
                  style={{
                    ...selectStyle(!!namaRuangan),
                    backgroundImage: 'none',
                    paddingRight: '64px',
                    borderColor: isRoomError ? '#dc2626' : '#e5e7eb'
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomRoom(false);
                    setNamaRuangan(availableRooms[0] || '');
                  }}
                  style={{
                    position: 'absolute',
                    right: '6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '11px',
                    color: '#4b5563',
                    cursor: 'pointer'
                  }}
                >
                  List
                </button>
              </div>
            )}

            {isRoomError ? (
              <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px', fontWeight: '500' }}>
                Ruang yang dimasukkan tidak ditemukan
              </div>
            ) : (
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                Pilih ruangan
              </div>
            )}
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
            placeholder="Tuliskan deskripsi masalah dengan detail"
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
            Foto <span style={{ color: '#dc2626' }}>*</span>
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
              const files = Array.from(e.dataTransfer.files || []);
              let hasTooLarge = false;
              files.forEach((file) => {
                if (file.size > MAX_FILE_SIZE) {
                  hasTooLarge = true;
                } else {
                  const reader = new FileReader();
                  reader.onload = (ev) => setUploadedPhotos((prev) => [...prev, ev.target.result]);
                  reader.readAsDataURL(file);
                }
              });
              if (hasTooLarge) {
                setPhotoError('Ukuran foto terlalu besar. Maksimal 5 MB');
              } else {
                setPhotoError('');
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ba181b';
              e.currentTarget.style.backgroundColor = '#fff5f5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.backgroundColor = '#fafafa';
            }}
            style={{
              border: '1.5px dashed #cbd5e1',
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
                width: '48px', height: '48px', borderRadius: '50%',
                backgroundColor: '#cbd5e1', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
              </div>
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#374151' }}>
              Seret ke sini <span style={{ fontWeight: 400, color: '#6b7280' }}>atau klik untuk dipilih</span>
            </div>
            <div 
              style={{ fontSize: '11.5px', color: '#9ca3af', marginTop: '4px', cursor: 'pointer' }}
              title="Klik untuk simulasi pesan error ukuran foto > 5 MB"
              onClick={(e) => {
                e.stopPropagation();
                // Toggle simulasi error ukuran foto untuk kemudahan pengujian
                setPhotoError((prev) => prev ? '' : 'Ukuran foto terlalu besar. Maksimal 5 MB');
              }}
            >
              Format JPG, PNG · Maks. 5 MB per foto
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current && fileInputRef.current.click();
              }}
              style={{
                marginTop: '14px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #dc2626',
                color: '#dc2626',
                borderRadius: '8px',
                padding: '6px 18px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fff5f5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; }}
            >
              Pilih dari perangkat
            </button>
          </div>

          {/* Pesan Error Ukuran Foto Terlalu Besar (Sesuai Foto 4) */}
          {photoError && (
            <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '8px', fontWeight: '500' }}>
              {photoError}
            </div>
          )}

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
          <Button 
            type="submit" 
            variant="primary" 
            size="md"
            style={{
              backgroundColor: '#dc2626',
              padding: '9px 28px',
              borderRadius: '8px'
            }}
          >
            Laporkan
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReportFormSection;