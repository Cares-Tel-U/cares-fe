import React, { useState, useRef, useEffect } from 'react';

const Select = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [], // [{ value: '', label: '' }] or array of strings
  required = false,
  placeholder = 'Pilih opsi',
  isCustomDropdown = false,
  className = '',
  style = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Normalize options to [{ value, label }]
  const normalizedOptions = options.map((opt) =>
    typeof opt === 'object' ? opt : { value: opt, label: opt }
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value) || {
    value: '',
    label: placeholder
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isCustomDropdown) {
    return (
      <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block', ...style }}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '7px 14px',
            fontSize: '13px',
            fontWeight: '500',
            color: '#374151',
            cursor: 'pointer',
            minWidth: '130px',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        >
          <span>{selectedOption.label}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: 'transform 0.15s ease',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              color: '#6b7280'
            }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: 0,
              zIndex: 50,
              backgroundColor: '#ffffff',
              border: '1px solid #f3f4f6',
              borderRadius: '10px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
              minWidth: '170px',
              overflow: 'hidden',
              padding: '4px 0'
            }}
          >
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    onChange({ target: { name, value: opt.value } });
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '9px 16px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    color: isSelected ? '#ba181b' : '#374151',
                    fontWeight: isSelected ? '600' : '400',
                    backgroundColor: isSelected ? '#fef2f2' : 'transparent',
                    transition: 'background-color 0.1s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <span style={{ color: '#ba181b', fontSize: '12px' }}>✓</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Standard Form Select
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', width: '100%' }}>
      {label && (
        <label
          htmlFor={id || name}
          style={{
            fontSize: '13px',
            fontWeight: '600',
            color: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {label}
          {required && <span style={{ color: '#dc2626' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <select
          id={id || name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`custom-select ${className}`}
          style={{
            width: '100%',
            padding: '11px 14px',
            paddingRight: '36px',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '13.5px',
            fontFamily: 'inherit',
            outline: 'none',
            appearance: 'none',
            cursor: 'pointer',
            boxSizing: 'border-box',
            ...style
          }}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {normalizedOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: '#6b7280',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Select;

