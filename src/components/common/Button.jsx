import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary', 'outline', 'secondary', 'ghost', 'pagination'
  size = 'md',        // 'sm', 'md', 'lg'
  icon = null,
  disabled = false,
  className = '',
  style = {}
}) => {
  const getStyles = () => {
    let base = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      fontWeight: '600',
      transition: 'all 0.15s ease-in-out',
      fontFamily: 'inherit',
      border: 'none',
      outline: 'none'
    };

    // Sizing
    if (size === 'sm') {
      base.padding = '5px 12px';
      base.fontSize = '12px';
      base.borderRadius = '6px';
    } else if (size === 'lg') {
      base.padding = '12px 24px';
      base.fontSize = '15px';
      base.borderRadius = '10px';
    } else {
      base.padding = '9px 18px';
      base.fontSize = '13.5px';
      base.borderRadius = '8px';
    }

    // Variants
    if (variant === 'primary') {
      base.backgroundColor = '#ba181b';
      base.color = '#ffffff';
      base.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
    } else if (variant === 'outline') {
      base.backgroundColor = 'transparent';
      base.color = '#ba181b';
      base.border = '1px solid #ba181b';
      base.padding = '4px 12px';
      base.fontSize = '12px';
      base.borderRadius = '6px';
    } else if (variant === 'secondary') {
      base.backgroundColor = '#ffffff';
      base.color = '#374151';
      base.border = '1px solid #e5e7eb';
      base.borderRadius = '9999px';
      base.padding = '8px 18px';
      base.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.03)';
    } else if (variant === 'pagination') {
      base.backgroundColor = '#ba181b';
      base.color = '#ffffff';
      base.borderRadius = '9999px';
      base.padding = '6px 18px';
      base.fontSize = '12px';
      base.fontWeight = '500';
    } else if (variant === 'ghost') {
      base.backgroundColor = 'transparent';
      base.color = '#6b7280';
    }

    return base;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`custom-btn ${className}`}
      style={{ ...getStyles(), ...style }}
    >
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;

