import React, { useState, useRef, useEffect } from 'react';

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

// Reusable semi-dropdown autocomplete field yang ramah custom input
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
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = !value || value.trim() === ''
    ? suggestions
    : suggestions.filter((s) =>
        s.toLowerCase().includes(value.toLowerCase())
      );

  const showDropdown = open && !disabled && suggestions.length > 0;

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <label style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', display: 'block', marginBottom: '6px' }}>
        {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onClick={() => {
            if (!disabled) setOpen(true);
          }}
          onFocus={() => {
            if (!disabled) setOpen(true);
          }}
          style={{
            ...inputStyle(Boolean(error)),
            paddingRight: '36px',
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
          }}
          autoComplete="off"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={(e) => {
            e.preventDefault();
            if (!disabled) {
              setOpen((prev) => !prev);
              if (!open && inputRef.current) {
                inputRef.current.focus();
              }
            }
          }}
          style={{
            position: 'absolute',
            right: '8px',
            background: 'none',
            border: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            transition: 'transform 0.15s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
          aria-label={`Buka pilihan ${label}`}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

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
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            zIndex: 100,
            maxHeight: '220px',
            overflowY: 'auto',
          }}
        >
          {filtered.length > 0 ? (
            filtered.map((item) => (
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
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {item}
              </div>
            ))
          ) : (
            <div style={{ padding: '10px 14px', fontSize: '12.5px', color: '#9ca3af', fontStyle: 'italic' }}>
              Tidak ada pilihan yang cocok. Anda dapat mengetik nama kustom.
            </div>
          )}
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

export default AutocompleteField;
