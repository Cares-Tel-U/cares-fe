import React, { useRef, useState } from 'react';

const RepairProofDropzone = ({
  uploadedFiles,
  onFilesSelected,
  onRemoveFile,
}) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#111827', marginBottom: '10px' }}>
        Bukti Perbaikan Fasilitas
      </label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />

      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files?.length) {
            onFilesSelected(e.dataTransfer.files);
          }
        }}
        style={{
          border: `2px dashed ${isDragOver ? '#dc2626' : '#d1d5db'}`,
          borderRadius: '16px',
          padding: '28px 16px',
          textAlign: 'center',
          backgroundColor: isDragOver ? '#fff5f5' : '#f9fafb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            backgroundColor: isDragOver ? '#fee2e2' : '#e5e7eb',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDragOver ? '#dc2626' : '#6b7280',
            marginBottom: '10px',
            transition: 'all 0.2s ease'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>
          Seret ke sini <span style={{ fontWeight: '400', color: '#6b7280' }}>atau klik untuk dipilih</span>
        </div>
        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', marginBottom: '14px' }}>
          Format JPG, PNG · Maks. 5 MB per foto
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current && fileInputRef.current.click();
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
      </div>

      {/* Uploaded file thumbnails */}
      {uploadedFiles.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
          {uploadedFiles.map((file, idx) => (
            <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={file.url}
                alt={file.name}
                style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <button
                type="button"
                onClick={() => onRemoveFile(idx)}
                title="Hapus foto"
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  width: '18px',
                  height: '18px',
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '9px',
                  lineHeight: 1,
                  padding: 0
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
