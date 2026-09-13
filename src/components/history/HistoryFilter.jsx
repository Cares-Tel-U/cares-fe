import React from 'react';
import Select from '../common/Select';

const sortOptions = [
  { value: 'Terbaru', label: 'Terbaru' },
  { value: 'Terlama', label: 'Terlama' }
];

const statusOptions = [
  { value: 'Semua Status', label: 'Semua Status' },
  { value: 'Menunggu Verifikasi', label: 'Menunggu Verifikasi' },
  { value: 'Diproses', label: 'Diproses' },
  { value: 'Selesai', label: 'Selesai' },
  { value: 'Ditolak', label: 'Ditolak' }
];

const HistoryFilter = ({ sortBy, onSortChange, statusFilter, onStatusChange }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}
    >
      {/* Sort By Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '13px', color: '#4b5563', fontWeight: '500' }}>
          Sort by:
        </span>
        <Select
          isCustomDropdown
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          options={sortOptions}
        />
      </div>

      {/* Status Filter Dropdown */}
      <div>
        <Select
          isCustomDropdown
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          options={statusOptions}
        />
      </div>
    </div>
  );
};

export default HistoryFilter;

