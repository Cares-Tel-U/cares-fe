import React, { useState, useRef, useMemo } from 'react';
import Button from '../common/Button';
import AutocompleteField from '../common/AutocompleteField';
import PhotoDropzone from './PhotoDropzone';
import {
  defaultGedungList,
  defaultRuanganOptionsMap,
  defaultAreaLuarList,
  defaultLokasiSpesifikMap,
  defaultLokasiSpesifikRekomendasi,
} from '../../data/campusLocations';

const ReportFormSection = ({ onSubmit, isSubmitting = false, facilities = [] }) => {
  const [jenisLokasi, setJenisLokasi] = useState('Dalam Gedung');
  const isAreaLuar = jenisLokasi === 'Area Luar' || jenisLokasi === 'Luar Gedung';

  // Gedung & Ruangan dinamis dari data fasilitas backend digabung dengan default lengkap
  const { gedungList, ruanganOptionsMap } = useMemo(() => {
    const gedungMap = new Map();
    const ruanganMap = {};

    defaultGedungList.forEach((g) => {
      gedungMap.set(g.value, g);
      ruanganMap[g.value] = [...(defaultRuanganOptionsMap[g.value] || [])];
    });

    if (Array.isArray(facilities)) {
      facilities.forEach((f) => {
        const gName = f.lokasi?.trim() || 'Lainnya';
        // Jangan masukkan ke daftar gedung jika lokasi tersebut merupakan kategori area luar
        const isAreaLuarLoc = defaultAreaLuarList.some(
          (a) => a.value.toLowerCase() === gName.toLowerCase() || a.label.toLowerCase() === gName.toLowerCase()
        );
        if (!isAreaLuarLoc) {
          if (!gedungMap.has(gName)) {
            gedungMap.set(gName, { value: gName, label: gName });
          }
          if (!ruanganMap[gName]) {
            ruanganMap[gName] = [];
          }
          if (f.nama && !ruanganMap[gName].includes(f.nama)) {
            ruanganMap[gName].push(f.nama);
          }
        }
      });
    }

    return {
      gedungList: Array.from(gedungMap.values()),
      ruanganOptionsMap: ruanganMap,
    };
  }, [facilities]);

  // Area Luar & Lokasi Spesifik dinamis dari data fasilitas backend digabung dengan default lengkap
  const { areaList, lokasiSpesifikMap } = useMemo(() => {
    const areaMap = new Map();
    const spesifikMap = {};

    defaultAreaLuarList.forEach((a) => {
      areaMap.set(a.value, a);
      spesifikMap[a.value] = [...(defaultLokasiSpesifikMap[a.value] || [])];
    });

    if (Array.isArray(facilities)) {
      facilities.forEach((f) => {
        const aName = f.lokasi?.trim();
        if (!aName) return;

        const matchedArea = defaultAreaLuarList.find(
          (a) => a.value.toLowerCase() === aName.toLowerCase() || a.label.toLowerCase() === aName.toLowerCase()
        );

        if (matchedArea) {
          const key = matchedArea.value;
          if (!spesifikMap[key]) {
            spesifikMap[key] = [];
          }
          if (f.nama && !spesifikMap[key].includes(f.nama)) {
            spesifikMap[key].push(f.nama);
          }
        }
      });
    }

    return {
      areaList: Array.from(areaMap.values()),
      lokasiSpesifikMap: spesifikMap,
    };
  }, [facilities]);

  // Field 1 (Nama Gedung / Area) autocomplete state
  const [gedungQuery, setGedungQuery] = useState('');
  const [selectedGedung, setSelectedGedung] = useState('');

  // Field 2 (Nama Ruangan / Lokasi Spesifik) autocomplete state
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
  // Semua label area luar untuk suggestion autocomplete
  const allAreaNames = areaList.map((a) => a.label);

  // Daftar ruangan yang tersedia sesuai gedung yang dipilih/diketik
  const availableRooms = useMemo(() => {
    const rawGedung = (selectedGedung || gedungQuery || '').trim().toLowerCase();
    if (!rawGedung) {
      // Rekomendasi ruangan populer jika gedung belum dipilih
      return [
        'TULT-08-01 (Ruang Kelas Terintegrasi)',
        'KU3.02.12 (Ruang Audio Visual)',
        'IF2.01.01 (Computing Laboratory)',
        'Lab Rekayasa Perangkat Lunak (RPL)',
        'Auditorium Cacuk Sudarijanto',
        'Area Baca Tenang Lt. 3',
        'Ruang Utama Sholat Lt. 1',
        'Lobi Utama',
        'Toilet Lantai 1',
      ];
    }

    const matchedKey = Object.keys(ruanganOptionsMap).find(
      (k) =>
        k.toLowerCase() === rawGedung ||
        rawGedung.includes(k.toLowerCase()) ||
        k.toLowerCase().includes(rawGedung)
    );

    if (matchedKey && ruanganOptionsMap[matchedKey]) {
      return ruanganOptionsMap[matchedKey];
    }

    // Jika custom atau belum ada relasi spesifik, kumpulkan sampel ruangan umum
    return [
      `${gedungQuery || selectedGedung}-01-01`,
      `${gedungQuery || selectedGedung}-02-05`,
      'Toilet Lantai 1',
      'Toilet Lantai 2',
      'Lobi Utama',
      'Area Selasar',
    ];
  }, [selectedGedung, gedungQuery, ruanganOptionsMap]);

  // Daftar lokasi spesifik luar yang tersedia sesuai area yang dipilih/diketik
  const availableLokasiSpesifik = useMemo(() => {
    const rawArea = (selectedGedung || gedungQuery || '').trim().toLowerCase();
    if (!rawArea) {
      return defaultLokasiSpesifikRekomendasi;
    }

    const matchedKey = Object.keys(lokasiSpesifikMap).find(
      (k) =>
        k.toLowerCase() === rawArea ||
        rawArea.includes(k.toLowerCase()) ||
        k.toLowerCase().includes(rawArea)
    );

    if (matchedKey && lokasiSpesifikMap[matchedKey]) {
      return lokasiSpesifikMap[matchedKey];
    }

    return [
      `${gedungQuery || selectedGedung} Sisi Timur`,
      `${gedungQuery || selectedGedung} Sisi Barat`,
      `${gedungQuery || selectedGedung} Area Masuk`,
      `${gedungQuery || selectedGedung} Area Keluar`,
    ];
  }, [selectedGedung, gedungQuery, lokasiSpesifikMap]);

  const handleJenisLokasiChange = (newVal) => {
    if (newVal === jenisLokasi) return;
    setJenisLokasi(newVal);
    // Reset input dan error agar tidak tercampur saat beralih tipe lokasi
    setGedungQuery('');
    setSelectedGedung('');
    setRuanganQuery('');
    setSelectedRuangan('');
    setFormErrors((prev) => ({
      ...prev,
      gedung: '',
      ruangan: '',
    }));
  };

  const handleSelectField1 = (label) => {
    setGedungQuery(label);
    const activeList = isAreaLuar ? areaList : gedungList;
    const found = activeList.find((item) => item.label === label);
    const key = found ? found.value : label;
    setSelectedGedung(key);
    // Kosongkan field kedua agar pengguna memilih opsi yang relevan dengan area/gedung baru
    setRuanganQuery('');
    setSelectedRuangan('');
    if (formErrors.gedung) {
      setFormErrors((prev) => ({ ...prev, gedung: '' }));
    }
  };

  const handleSelectField2 = (val) => {
    setRuanganQuery(val);
    setSelectedRuangan(val);
    if (formErrors.ruangan) {
      setFormErrors((prev) => ({ ...prev, ruangan: '' }));
    }
  };

  // Validasi dan pemrosesan file foto
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
      errors.gedung = isAreaLuar ? 'Area wajib diisi' : 'Nama gedung wajib diisi';
    }
    if (!currentRuangan) {
      errors.ruangan = isAreaLuar ? 'Lokasi spesifik wajib diisi' : 'Nama ruangan wajib diisi';
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
                  onChange={(e) => handleJenisLokasiChange(e.target.value)}
                  style={{ accentColor: '#ba181b', width: '16px', height: '16px' }}
                />
                {val}
              </label>
            ))}
          </div>
        </div>

        {/* Dynamic Location Fields: Gedung & Ruangan vs Area & Lokasi Spesifik */}
        <div className="report-location-grid">
          <AutocompleteField
            label={isAreaLuar ? 'Area' : 'Nama Gedung'}
            required
            placeholder={isAreaLuar ? 'Ketik nama area...' : 'Ketik nama gedung...'}
            value={gedungQuery}
            onChange={(val) => {
              setGedungQuery(val);
              setSelectedGedung(val);
              if (formErrors.gedung) {
                setFormErrors((prev) => ({ ...prev, gedung: '' }));
              }
            }}
            suggestions={isAreaLuar ? allAreaNames : allGedungNames}
            onSelect={handleSelectField1}
            error={formErrors.gedung}
            helperText={
              isAreaLuar
                ? 'Ketik area kampus atau pilih dari rekomendasi (contoh: Area Parkir, Taman)'
                : 'Ketik nama gedung kampus atau pilih dari rekomendasi'
            }
          />

          <AutocompleteField
            label={isAreaLuar ? 'Lokasi Spesifik' : 'Nama Ruangan'}
            required
            placeholder={isAreaLuar ? 'Ketik lokasi spesifik...' : 'Ketik nama ruangan...'}
            value={ruanganQuery}
            onChange={(val) => {
              setRuanganQuery(val);
              setSelectedRuangan(val);
              if (formErrors.ruangan) {
                setFormErrors((prev) => ({ ...prev, ruangan: '' }));
              }
            }}
            suggestions={isAreaLuar ? availableLokasiSpesifik : availableRooms}
            onSelect={handleSelectField2}
            error={formErrors.ruangan}
            helperText={
              isAreaLuar
                ? 'Ketik lokasi spesifik (contoh: Parkir Motor TULT, Parkir GKU, Situ Techno)'
                : 'Ketik ruangan (contoh: TULT-07-14, KU3.02.12, Toilet Lt. 1)'
            }
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

        {/* Foto Upload Area */}
        <PhotoDropzone
          fileInputRef={fileInputRef}
          uploadedPhotos={uploadedPhotos}
          photoError={photoError}
          onPhotoUpload={handlePhotoUpload}
          onProcessFiles={handleProcessFiles}
          onRemovePhoto={handleRemovePhoto}
          maxFiles={3}
        />

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