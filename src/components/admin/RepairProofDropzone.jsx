import React, { useRef, useState } from 'react';

const RepairProofDropzone = ({
  uploadedFiles = [],
  onFilesSelected,
  onRemoveFile,
  errorMessage = '',
}) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const isMaxReached = uploadedFiles.length >= 3;

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#111827' }}>
          Bukti Perbaikan Fasilitas <span style={{ color: '#dc2626' }}>*</span>
        </label>
        <span
          style={{
            fontSize: '11.5px',
            fontWeight: '600',
            padding: '2px 8px',
            borderRadius: '6px',
            backgroundColor: uploadedFiles.length >= 1 && uploadedFiles.length <= 3 ? '#ecfdf5' : '#f3f4f6',
            color: uploadedFiles.length >= 1 && uploadedFiles.length <= 3 ? '#047857' : '#6b7280',
            border: `1px solid ${uploadedFiles.length >= 1 && uploadedFiles.length <= 3 ? '#a7f3d0' : '#e5e7eb'}`
          }}
        >
          {uploadedFiles.length} / 3 Foto
        </span>
      </div>

      <div style={{ fontSize: '12px', color: '#4b5563', marginBottom: '10px', lineHeight: '1.4' }}>
        Lampirkan foto fisik hasil perbaikan fasilitas untuk konfirmasi bahwa laporan telah selesai ditangani.
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        multiple
        disabled={isMaxReached}
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />

      {/* Drop Zone */}
      <div
        onClick={() => {
          if (!isMaxReached && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isMaxReached) {
            setIsDragOver(true);
          }
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (!isMaxReached && e.dataTransfer.files?.length) {
            onFilesSelected(e.dataTransfer.files);
          }
        }}
        style={{
          border: `2px dashed ${errorMessage ? '#ef4444' : isDragOver ? '#dc2626' : isMaxReached ? '#e5e7eb' : '#d1d5db'}`,
          borderRadius: '16px',
          padding: '24px 16px',
          textAlign: 'center',
          backgroundColor: errorMessage ? '#fffbfa' : isDragOver ? '#fff5f5' : isMaxReached ? '#f9fafb' : '#f9fafb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isMaxReached ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          opacity: isMaxReached ? 0.85 : 1
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            backgroundColor: isMaxReached ? '#f3f4f6' : isDragOver ? '#fee2e2' : '#e5e7eb',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isMaxReached ? '#9ca3af' : isDragOver ? '#dc2626' : '#6b7280',
            marginBottom: '10px',
            transition: 'all 0.2s ease'
          }}
        >
          {isMaxReached ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          )}
        </div>

        {isMaxReached ? (
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#374151' }}>
              Batas Maksimal 3 Foto Tercapai
            </div>
            <div style={{ fontSize: '11.5px', color: '#6b7280', marginTop: '4px' }}>
              Hapus salah satu foto di bawah jika ingin mengganti dengan foto lain
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
              Seret foto ke sini <span style={{ fontWeight: '400', color: '#6b7280' }}>atau klik untuk memilih</span>
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', marginBottom: '14px', lineHeight: '1.4' }}>
              Format JPG, PNG, WEBP · <strong>Wajib minimal 1 foto, maksimal 3 foto</strong> · Maks. 5 MB per foto
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!isMaxReached && fileInputRef.current) {
                  fileInputRef.current.click();
                }
              }}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #f87171',
                color: '#dc2626',
                borderRadius: '8px',
                padding: '7px 16px',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Pilih dari perangkat
            </button>
          </>
        )}
      </div>

      {/* Alert Error Message */}
      {errorMessage && (
        <div
          style={{
            marginTop: '10px',
            padding: '10px 14px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#b91c1c',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded file thumbnails */}
      {uploadedFiles.length > 0 && (
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
          {uploadedFiles.map((file, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                display: 'inline-block',
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb'
              }}
            >
              <img
                src={file.url}
                alt={file.name || `Foto ${idx + 1}`}
                style={{ width: '72px', height: '72px', objectFit: 'cover', display: 'block' }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '3px',
                  left: '3px',
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  color: '#ffffff',
                  fontSize: '9.5px',
                  fontWeight: '600',
                  padding: '1px 5px',
                  borderRadius: '4px'
                }}
              >
                Foto {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => onRemoveFile(idx)}
                title="Hapus foto"
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '11px',
                  lineHeight: 1,
                  padding: 0,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
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

export default RepairProofDropzone;
