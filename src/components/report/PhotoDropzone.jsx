import React from 'react';

const PhotoDropzone = ({
  fileInputRef,
  uploadedPhotos = [],
  photoError = '',
  onPhotoUpload,
  onProcessFiles,
  onRemovePhoto,
  maxFiles = 3,
}) => {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
          Foto Bukti Kerusakan <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <span style={{ fontSize: '11.5px', color: '#6b7280', fontWeight: '500' }}>
          {uploadedPhotos.length} / {maxFiles} Foto
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onPhotoUpload}
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
          onProcessFiles(files);
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
          Format gambar JPG, PNG, WEBP · 1 hingga {maxFiles} foto (Maks. 5 MB per foto)
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
                onClick={() => onRemovePhoto(index)}
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
  );
};

export default PhotoDropzone;
