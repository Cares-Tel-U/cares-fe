import React from 'react';

const CaresLogoWhite = ({ size = 'md', className = '', style = {} }) => {
  // Height presets
  const heightMap = {
    sm: '36px',
    md: '46px',
    lg: '64px',
    xl: '82px'
  };

  const selectedHeight = heightMap[size] || size;

  return (
    <img
      src="/cares-logo-white.svg"
      alt="CARES - Bersama Menjaga Fasilitas Kampus"
      className={className}
      style={{
        height: selectedHeight,
        width: 'auto',
        maxWidth: '100%',
        objectFit: 'contain',
        display: 'block',
        ...style
      }}
    />
  );
};

export default CaresLogoWhite;

