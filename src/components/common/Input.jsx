import React, { useState } from 'react';

const Input = ({
  label,
  id,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false,
  error = '',
  disabled = false,
  rows = 4,
  className = '',
  style = {}
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isTextarea = type === 'textarea';
  const isPassword = type === 'password';

  const actualType = isPassword ? (showPassword ? 'text' : 'password') : type;

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

      {isTextarea ? (
        <textarea
          id={id || name}
          name={name}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`custom-input ${className}`}
          style={{
            width: '100%',
            padding: '11px 14px',
            backgroundColor: '#f9fafb',
            border: `1px solid ${error ? '#ef4444' : '#e5e7eb'}`,
            borderRadius: '8px',
            fontSize: '13.5px',
            fontFamily: 'inherit',
            outline: 'none',
            resize: 'vertical',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s ease',
            ...style
          }}
        />
      ) : (
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            id={id || name}
            name={name}
            type={actualType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`custom-input ${className}`}
            style={{
              width: '100%',
              padding: '11px 14px',
              paddingRight: isPassword ? '40px' : '14px',
              backgroundColor: '#f9fafb',
              border: `1px solid ${error ? '#ef4444' : '#e5e7eb'}`,
              borderRadius: '8px',
              fontSize: '13.5px',
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease',
              ...style
            }}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9ca3af',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          )}
        </div>
      )}

      {error && (
        <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '2px' }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
