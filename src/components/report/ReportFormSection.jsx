import React, { useState, useRef, useEffect } from 'react';
import Button from '../common/Button';

// Daftar lengkap gedung Telkom University beserta labelnya
const defaultGedungList = [
  { value: 'Gedung A', label: 'Gedung A (Gedung Kuliah Umum)' },
  { value: 'GKU', label: 'GKU / Gedung A (Gedung Kuliah Umum)' },
  { value: 'Gedung B', label: 'Gedung B (Tokong Nanas)' },
  { value: 'Tokong Nanas', label: 'Tokong Nanas / Gedung B' },
  { value: 'Gedung C', label: 'Gedung C (Fakultas Informatika)' },
  { value: 'Gedung Barung', label: 'Gedung Barung / Gedung C (Fakultas Informatika)' },
  { value: 'TULT', label: 'TULT (Telkom University Landmark Tower)' },
  { value: 'Gedung Cacuk Sudarijanto', label: 'Gedung Cacuk Sudarijanto / Gedung D' },
  { value: 'Gedung Panambulai', label: 'Gedung Panambulai / Gedung E' },
  { value: 'Gedung Grha Wiyata', label: 'Gedung Grha Wiyata / Gedung F' },
  { value: 'GKB', label: 'GKB (Gedung Kuliah Bersama)' },
  { value: 'Kultubai Utara', label: 'Kultubai Utara' },
  { value: 'Kultubai Selatan', label: 'Kultubai Selatan' },
  { value: 'Gedung FEB', label: 'Gedung FEB (Fakultas Ekonomi dan Bisnis)' },
  { value: 'Gedung FKB', label: 'Gedung FKB (Fakultas Komunikasi dan Bisnis)' },
  { value: 'Gedung FIK', label: 'Gedung FIK (Fakultas Industri Kreatif)' },
  { value: 'Gedung FIT', label: 'Gedung FIT (Fakultas Ilmu Terapan)' },
  { value: 'Gedung FRI', label: 'Gedung FRI (Fakultas Rekayasa Industri)' },
  { value: 'Gedung FTE', label: 'Gedung FTE (Fakultas Teknik Elektro)' },
  { value: 'Open Library', label: 'Open Library (Perpustakaan Telkom)' },
  { value: 'TUCH', label: 'TUCH (Telkom University Convention Hall)' },
  { value: 'Asrama Putra', label: 'Asrama Putra (Dormitory)' },
  { value: 'Asrama Putri', label: 'Asrama Putri (Dormitory)' },
  { value: 'Kantin Telkom', label: 'Kantin Telkom' },
  { value: 'Student Center', label: 'Student Center' },
  { value: 'Sport Center', label: 'Sport Center / Lapangan Olahraga' },
  { value: 'Masjid Syamsul Ulum', label: 'Masjid Syamsul Ulum' },
];

const defaultRuanganOptionsMap = {
  'Gedung A': ['KU3.01.01', 'KU3.02.12', 'KU3.02.13', 'KU3.03.05', 'KU3.03.12', 'Toilet Lt. 1', 'Toilet Lt. 2'],
  'GKU': ['KU3.01.01', 'KU3.02.12', 'KU3.02.13', 'KU3.03.05', 'KU3.03.12', 'Toilet Lt. 1', 'Toilet Lt. 2'],
  'Gedung B': ['TN1.01.02', 'TN1.02.04', 'TN2.01.05', 'Lab Rekayasa Perangkat Lunak', 'Toilet Lt. 1'],
  'Tokong Nanas': ['TN1.01.02', 'TN1.02.04', 'TN2.01.05', 'Lab Rekayasa Perangkat Lunak', 'Toilet Lt. 1'],
  'Gedung C': ['IF.01.01', 'IF.02.05', 'Lab Multimedia', 'Lab Rekayasa Perangkat Lunak', 'Lab Cyber Security'],
  'Gedung Barung': ['IF.01.01', 'IF.02.05', 'Lab Multimedia', 'Lab Rekayasa Perangkat Lunak', 'Lab Cyber Security'],
  'TULT': [
    'TULT-05-01', 'TULT-06-05', 'TULT-07-12', 'TULT-08-01', 'TULT-09-04',
    'TULT-10-02', 'Lobi Utama TULT', 'Area Parkir Motor TULT', 'Area Parkir Mobil TULT', 'Toilet Pria Lt. 1'
  ],
  'Gedung Cacuk Sudarijanto': ['Ruang D101', 'Ruang D102', 'Ruang D201', 'Ruang Rapat Utama'],
  'Gedung Panambulai': ['Ruang E101', 'Ruang E202', 'Lab Jaringan'],
  'Gedung Grha Wiyata': ['Ruang F101', 'Ruang F102', 'Auditorium Grha Wiyata'],
  'GKB': ['GKB.301', 'GKB.302', 'GKB.401', 'Toilet Pria Lt. 3'],
  'Kultubai Utara': ['RU01.01.02', 'RU01.01.03', 'RU01.02.01', 'Toilet Lt. 1', 'KU3.03.12'],
  'Kultubai Selatan': ['RS01.01.01', 'RS01.02.02', 'Toilet Lt. 1'],
  'Gedung FEB': ['Ruang FEB 101', 'Ruang FEB 203', 'Lab Akuntansi'],
  'Gedung FKB': ['Ruang FKB 102', 'Studio Radio FKB', 'Studio Televisi FKB'],
  'Gedung FIK': ['Galeri Seni FIK', 'Studio Desain 1', 'Workshop Kriya Kayu'],
  'Gedung FIT': ['Lab Komputer FIT 1', 'Ruang FIT 101', 'Bengkel Elektronika'],
  'Gedung FRI': ['Lab Ergonomi', 'Ruang FRI 201', 'Lab Simulasi Bisnis'],
  'Gedung FTE': ['Lab Telekomunikasi Seluler', 'Lab Radar', 'Ruang FTE 101'],
  'Open Library': ['Area Baca Lantai 2', 'Area Diskusi Tenang', 'Ruang Audio Visual'],
  'TUCH': ['Main Convention Hall', 'VIP Holding Room', 'Area Panggung Utama'],
  'Asrama Putra': ['Lobby Asrama Putra A', 'Ruang Bersama Asrama B', 'Toilet Umum Lt. 1'],
  'Asrama Putri': ['Lobby Asrama Putri C', 'Ruang Bersama Asrama D', 'Toilet Umum Lt. 1'],
  'Kantin Telkom': ['Area Wastafel Blok C', 'Area Makan Blok A', 'Area Makan Blok B'],
  'Student Center': ['Ruang Sekretariat Ormawa', 'Ruang Latihan Tari', 'Aula Student Center'],
  'Sport Center': ['Lapangan Futsal Indoor', 'Lapangan Basket', 'Area Tribun Penonton'],
  'Masjid Syamsul Ulum': ['Ruang Utama Sholat', 'Area Tempat Wudhu Pria', 'Area Tempat Wudhu Wanita'],
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

// Reusable autocomplete field yang ramah custom input (Poin 5 & Poin 6)
const AutocompleteField = ({
  label,
  required,
  placeholder,
  value,
  onChange,
  suggestions = [],
  onSelect,
  error,
  helperText,
  disabled
}) => {
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
    s.toLowerCase().includes((value || '').toLowerCase())
  );

  const showDropdown = open && (value || '').length > 0 && filtered.length > 0;

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
          ...inputStyle(Boolean(error)),
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
        }}
        autoComplete="off"
      />

      {/* Dropdown suggestions */}
      {showDropdown && (
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
      {error ? (
        <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px', fontWeight: '500' }}>
          {error}
        </div>
      ) : helperText ? (
        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
          {helperText}
        </div>
      ) : null}
    </div>
  );
};

const ReportFormSection = ({ onSubmit, isSubmitting = false, facilities = [] }) => {
  const [jenisLokasi, setJenisLokasi] = useState('Dalam Gedung');

  // Gedung & Ruangan dinamis dari data fasilitas backend digabung dengan default lengkap
  const { gedungList, ruanganOptionsMap } = React.useMemo(() => {
    const gedungMap = new Map();
    const ruanganMap = {};

    defaultGedungList.forEach((g) => {
      gedungMap.set(g.value, g);
      ruanganMap[g.value] = [...(defaultRuanganOptionsMap[g.value] || [])];
    });

    if (Array.isArray(facilities)) {
      facilities.forEach((f) => {
        const gName = f.lokasi?.trim() || 'Lainnya';
        if (!gedungMap.has(gName)) {
          gedungMap.set(gName, { value: gName, label: gName });
        }
        if (!ruanganMap[gName]) {
          ruanganMap[gName] = [];
        }
        if (f.nama && !ruanganMap[gName].includes(f.nama)) {
          ruanganMap[gName].push(f.nama);
        }
      });
    }

    return {
      gedungList: Array.from(gedungMap.values()),
      ruanganOptionsMap: ruanganMap,
    };
  }, [facilities]);

  // Gedung autocomplete state (Poin 5: Mendukung input custom gedung)
  const [gedungQuery, setGedungQuery] = useState('');
  const [selectedGedung, setSelectedGedung] = useState('');

  // Ruangan autocomplete state (Poin 6: Mendukung input custom ruangan)
  const [ruanganQuery, setRuanganQuery] = useState('');
  const [selectedRuangan, setSelectedRuangan] = useState('');

  const [deskripsi, setDeskripsi] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [photoError, setPhotoError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  // Semua label gedung untuk suggestion autocomplete
  const allGedungNames = gedungList.map((g) => g.label);

  // Daftar ruangan yang tersedia sesuai gedung yang dipilih/diketik
  const availableRooms = React.useMemo(() => {
    const matchedKey = Object.keys(ruanganOptionsMap).find(
      (k) =>
        k.toLowerCase() === (selectedGedung || gedungQuery).trim().toLowerCase() ||
        (gedungQuery && k.toLowerCase().includes(gedungQuery.toLowerCase()))
    );
    if (matchedKey && ruanganOptionsMap[matchedKey]) {
      return ruanganOptionsMap[matchedKey];
    }
    // Jika custom atau belum ada relasi spesifik, kumpulkan sampel ruangan umum
    return [
      `${gedungQuery || selectedGedung || 'TULT'}-01-01`,
      `${gedungQuery || selectedGedung || 'TULT'}-02-05`,
      'Toilet Lantai 1',
      'Toilet Lantai 2',
      'Lobi Utama',
      'Area Parkir',
    ];
  }, [selectedGedung, gedungQuery, ruanganOptionsMap]);

  const handleSelectGedung = (label) => {
    setGedungQuery(label);
    const found = gedungList.find((g) => g.label === label);
    const key = found ? found.value : label;
    setSelectedGedung(key);
    if (formErrors.gedung) {
      setFormErrors((prev) => ({ ...prev, gedung: '' }));
    }
  };

  const handleSelectRuangan = (room) => {
    setRuanganQuery(room);
    setSelectedRuangan(room);
    if (formErrors.ruangan) {
      setFormErrors((prev) => ({ ...prev, ruangan: '' }));
    }
  };

  // Validasi dan pemrosesan file foto (Poin 7 & Poin 8)
  const handleProcessFiles = (files) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    let hasInvalidFormat = false;
    let hasTooLarge = false;
    const validFiles = [];

    files.forEach((file) => {
      const isImage = allowedTypes.includes(file.type) || /\.(jpe?g|png|webp)$/i.test(file.name);
      if (!isImage) {
        hasInvalidFormat = true;
      } else if (file.size > MAX_FILE_SIZE) {
        hasTooLarge = true;
      } else {
        validFiles.push(file);
      }
    });

    if (hasInvalidFormat) {
      setPhotoError('Format file tidak didukung. Hanya file gambar (JPG, PNG, WEBP) yang diizinkan.');
      return;
    }

    if (hasTooLarge) {
      setPhotoError('Ukuran foto terlalu besar. Maksimal 5 MB per file.');
      return;
    }

    if (uploadedPhotos.length + validFiles.length > 3) {
      setPhotoError('Jumlah foto melebihi batas. Maksimal 3 file foto.');
      const availableSlots = Math.max(0, 3 - uploadedPhotos.length);
      if (availableSlots === 0) return;
      validFiles.splice(availableSlots);
    } else {
      setPhotoError('');
    }

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedPhotos((prev) => {
          if (prev.length >= 3) return prev;
          return [...prev, event.target.result];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    handleProcessFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (index) => {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const currentGedung = (selectedGedung || gedungQuery).trim();
    const currentRuangan = (selectedRuangan || ruanganQuery).trim();
    const currentDeskripsi = deskripsi.trim();

    const errors = {};
    if (!currentGedung) {
      errors.gedung = 'Nama gedung wajib diisi';
    }
    if (!currentRuangan) {
      errors.ruangan = 'Nama ruangan wajib diisi';
    }
    if (!currentDeskripsi) {
      errors.deskripsi = 'Deskripsi masalah wajib diisi';
    }

    if (uploadedPhotos.length === 0) {
      setPhotoError('Lampiran foto bukti kerusakan wajib disertakan (minimal 1 foto, maksimal 3 foto).');
      errors.foto = true;
    } else if (uploadedPhotos.length > 3) {
      setPhotoError('Jumlah foto melebihi batas. Maksimal 3 file foto.');
      errors.foto = true;
    } else {
      setPhotoError('');
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    const reportData = {
      jenisLokasi,
      namaGedung: currentGedung,
      namaRuangan: currentRuangan,
      lokasi: `${currentGedung} - ${currentRuangan}`,
      deskripsi: currentDeskripsi,
      foto: uploadedPhotos,
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

      <form onSubmit={handleSubmit} noValidate>
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

        {/* Nama Gedung & Nama Ruangan — Searchable Autocomplete & Custom Input */}
        <div className="report-location-grid">
          {/* Gedung Autocomplete (Poin 5: Bisa custom gedung atau pilih suggestion) */}
          <AutocompleteField
            label="Nama Gedung"
            required
            placeholder="Ketik nama gedung..."
            value={gedungQuery}
            onChange={(val) => {
              setGedungQuery(val);
              setSelectedGedung(val);
              if (formErrors.gedung) {
                setFormErrors((prev) => ({ ...prev, gedung: '' }));
              }
            }}
            suggestions={allGedungNames}
            onSelect={handleSelectGedung}
            error={formErrors.gedung}
            helperText="Ketik nama gedung kampus atau pilih dari rekomendasi"
          />

          {/* Ruangan Autocomplete (Poin 6: Bisa custom ruangan seperti TULT-07-14) */}
          <AutocompleteField
            label="Nama Ruangan"
            required
            placeholder="Ketik nama ruangan..."
            value={ruanganQuery}
            onChange={(val) => {
              setRuanganQuery(val);
              setSelectedRuangan(val);
              if (formErrors.ruangan) {
                setFormErrors((prev) => ({ ...prev, ruangan: '' }));
              }
            }}
            suggestions={availableRooms}
            onSelect={handleSelectRuangan}
            error={formErrors.ruangan}
            helperText="Ketik ruangan (contoh: TULT-07-14, KU3.02.12, Toilet Lt. 1)"
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
            onChange={(e) => {
              setDeskripsi(e.target.value);
              if (formErrors.deskripsi) {
                setFormErrors((prev) => ({ ...prev, deskripsi: '' }));
              }
            }}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '13.5px',
              color: '#1f2937',
              backgroundColor: '#f9fafb',
              border: `1.5px solid ${formErrors.deskripsi ? '#dc2626' : '#e5e7eb'}`,
              borderRadius: '10px',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
          {formErrors.deskripsi ? (
            <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px', fontWeight: '500' }}>
              {formErrors.deskripsi}
            </div>
          ) : (
            <div style={{ fontSize: '11.5px', color: '#9ca3af', marginTop: '4px' }}>
              Tuliskan deskripsi masalah dengan detail
            </div>
          )}
        </div>

        {/* Foto Upload Area (Poin 7: Blokir PDF, Poin 8: 1-3 foto) */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              Foto Bukti Kerusakan <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <span style={{ fontSize: '11.5px', color: '#6b7280', fontWeight: '500' }}>
              {uploadedPhotos.length} / 3 Foto
            </span>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            multiple
            accept="image/png, image/jpeg, image/jpg, image/webp"
            style={{ display: 'none' }}
          />

          <div
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files || []);
              handleProcessFiles(files);
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
              padding: '24px 20px',
              textAlign: 'center',
              backgroundColor: '#fafafa',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
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
              Format gambar JPG, PNG, WEBP · 1 hingga 3 foto (Maks. 5 MB per foto)
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current && fileInputRef.current.click();
              }}
              style={{
                marginTop: '12px',
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

          {/* Pesan Error Foto */}
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
            disabled={isSubmitting}
            style={{
              backgroundColor: isSubmitting ? '#9ca3af' : '#dc2626',
              padding: '9px 28px',
              borderRadius: '8px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? 'Mengirim...' : 'Laporkan'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReportFormSection;