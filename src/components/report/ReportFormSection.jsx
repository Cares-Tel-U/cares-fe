import React, { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';

// All available buildings with their display labels
const gedungList = [
  { value: 'Kultubai Utara', label: 'Kultubai Utara' },
  { value: 'Gedung A', label: 'Gedung A (Gedung Kuliah Umum)' },
  { value: 'Gedung B', label: 'Gedung B (Tokong Nanas)' },
  { value: 'Gedung C', label: 'Gedung C (Fakultas Informatika)' },
  { value: 'TULT', label: 'TULT (Telkom University Landmark Tower)' },
  { value: 'GKB', label: 'GKB (Gedung Kuliah Bersama)' },
  { value: 'Kantin Telkom', label: 'Area Kantin' },
];

const ruanganOptionsMap = {
  'Kultubai Utara': ['RU01.01.02', 'RU01.01.03', 'RU01.02.01', 'Toilet Lt. 1', 'KU3.03.12'],
  'Gedung A': ['KU3.02.12', 'KU3.02.13', 'KU3.01.01', 'KU3.03.05', 'Toilet Lt. 2'],
  'Gedung B': ['TN2.01.05', 'TN1.02.04', 'Lab Rekayasa Perangkat Lunak', 'Toilet Lt. 1'],
  'Gedung C': ['IF.01.01', 'IF.02.05', 'Lab ASE', 'Lab Multimedia'],
  'TULT': ['Area Parkir Motor', 'Area Parkir Mobil', 'Lobi Utama', 'Lt. 5 Kelas 501'],
  'GKB': ['GKB.401', 'GKB.302', 'Toilet Pria Lt. 3'],
  'Kantin Telkom': ['Area Wastafel Blok C', 'Area Makan Blok A'],
};

const inputStyle = (hasError) => ({
  width: '100%',
  padding: '10px 12px',
  fontSize: '13.5px',
  color: '#1f2937',
  backgroundColor: '#f9fafb',
  border: `1.5px solid ${hasError ? '#dc2626' : '#e5e7eb'}`,
  borderRadius: '10px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s ease',
});

// Reusable autocomplete field
const AutocompleteField = ({ label, required, placeholder, value, onChange, suggestions, onSelect, error, helperText, disabled }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(value.toLowerCase())
  );

  const showDropdown = open && value.length > 0;
  const showError = value.length > 0 && !suggestions.some(
    (s) => s.toLowerCase() === value.toLowerCase()
  ) && filtered.length === 0;

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', display: 'block', marginBottom: '6px' }}>
        {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        style={{
          ...inputStyle(showError || error),
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
        }}
        autoComplete="off"
      />

      {/* Dropdown suggestions */}
      {showDropdown && filtered.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
            zIndex: 100,
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {filtered.map((item) => (
            <div
              key={item}
              onMouseDown={(e) => {
                e.preventDefault();
                onSelect(item);
                setOpen(false);
              }}
              style={{
                padding: '10px 14px',
                fontSize: '13px',
                color: '#374151',
                cursor: 'pointer',
                borderBottom: '1px solid #f3f4f6',
                transition: 'background-color 0.1s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {item}
            </div>
          ))}
        </div>
      )}

      {/* Error or helper text */}
      {(showError || error) ? (
        <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px', fontWeight: '500' }}>
          {error || 'Ruang yang dimasukkan tidak ditemukan'}
        </div>
      ) : (
        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
          {helperText || placeholder}
        </div>
      )}
    </div>
  );
};

const ReportFormSection = ({ onSubmit }) => {
  const [jenisLokasi, setJenisLokasi] = useState('Dalam Gedung');

  // Gedung autocomplete state
  const [gedungQuery, setGedungQuery] = useState('');
  const [selectedGedung, setSelectedGedung] = useState('');

  // Ruangan autocomplete state
  const [ruanganQuery, setRuanganQuery] = useState('');
  const [selectedRuangan, setSelectedRuangan] = useState('');

  const [deskripsi, setDeskripsi] = useState('AC dikelas KU3.03.12 tidak dingin dan yang satunya lagi tidak bisa nyala');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // All gedung names for suggestion
  const allGedungNames = gedungList.map((g) => g.label);

  // Available rooms based on selected building
  const availableRooms = selectedGedung ? (ruanganOptionsMap[selectedGedung] || []) : [];

  // Validation for gedung
  const gedungValid = gedungList.some(
    (g) => g.label.toLowerCase() === gedungQuery.toLowerCase() || g.value.toLowerCase() === gedungQuery.toLowerCase()
  );
  const gedungError = gedungQuery.length > 0 && !gedungValid && !allGedungNames.some(
    (n) => n.toLowerCase().includes(gedungQuery.toLowerCase())
  );

  // Validation for ruangan
  const ruanganValid = availableRooms.some(
    (r) => r.toLowerCase() === ruanganQuery.toLowerCase()
  );
  const ruanganHasInput = ruanganQuery.length > 0;
  const ruanganFiltered = availableRooms.filter((r) =>
    r.toLowerCase().includes(ruanganQuery.toLowerCase())
  );
  const ruanganError = ruanganHasInput && !ruanganValid && ruanganFiltered.length === 0;

  const handleSelectGedung = (label) => {
    setGedungQuery(label);
    // Find actual value key
    const found = gedungList.find((g) => g.label === label);
    const key = found ? found.value : label;
    setSelectedGedung(key);
    setRuanganQuery('');
    setSelectedRuangan('');
  };

  const handleSelectRuangan = (room) => {
    setRuanganQuery(room);
    setSelectedRuangan(room);
  };

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

    if (ruanganError || gedungError) return;
    if (!selectedGedung || !selectedRuangan || !deskripsi) return;

    const reportData = {
      jenisLokasi,
      namaGedung: selectedGedung,
      namaRuangan: selectedRuangan,
      lokasi: `${selectedGedung} - ${selectedRuangan}`,
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

        {/* Nama Gedung & Nama Ruangan — Searchable Autocomplete */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
          {/* Gedung Autocomplete */}
          <AutocompleteField
            label="Nama Gedung"
            required
            placeholder="Ketik nama gedung..."
            value={gedungQuery}
            onChange={(val) => {
              setGedungQuery(val);
              // Reset gedung selection if user clears or changes
              const exact = gedungList.find(
                (g) => g.label.toLowerCase() === val.toLowerCase() || g.value.toLowerCase() === val.toLowerCase()
              );
              if (exact) {
                setSelectedGedung(exact.value);
              } else {
                setSelectedGedung('');
                setRuanganQuery('');
                setSelectedRuangan('');
              }
            }}
            suggestions={allGedungNames}
            onSelect={handleSelectGedung}
            helperText="Ketik untuk mencari gedung"
          />

          {/* Ruangan Autocomplete */}
          <AutocompleteField
            label="Nama Ruangan"
            required
            placeholder={selectedGedung ? 'Ketik nama ruangan...' : 'Pilih gedung terlebih dahulu'}
            value={ruanganQuery}
            onChange={(val) => {
              setRuanganQuery(val);
              const exact = availableRooms.find(
                (r) => r.toLowerCase() === val.toLowerCase()
              );
              setSelectedRuangan(exact || '');
            }}
            suggestions={availableRooms}
            onSelect={handleSelectRuangan}
            error={ruanganError ? 'Ruang yang dimasukkan tidak ditemukan' : ''}
            helperText="Ketik untuk mencari ruangan"
            disabled={!selectedGedung}
          />
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
            <div style={{ fontSize: '11.5px', color: '#9ca3af', marginTop: '4px' }}>
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

          {/* Pesan Error Ukuran Foto Terlalu Besar */}
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