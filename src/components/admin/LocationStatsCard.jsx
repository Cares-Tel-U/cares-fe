import React from 'react';

const LocationStatsCard = () => {
  const locations = [
    { name: 'Parkir Motor TULT', percent: '25,81%', count: 32 },
    { name: 'TULT 0712', percent: '22,58%', count: 28 },
    { name: 'Parkir Asrama', percent: '19,35%', count: 24 },
    { name: 'Parkir GKU', percent: '14,52%', count: 18 },
    { name: 'Lainnya', percent: '17,74%', count: 22 }
  ];

  return (
    <div style={{ height: '100%', minHeight: '342px', boxSizing: 'border-box', background: '#fff', padding: '16px', borderRadius: '8px', border: '1px solid #d7d7d7', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ margin: 0, fontWeight: 700, color: '#303038', fontSize: '13px' }}>Laporan berdasarkan lokasi</h3>
          <span style={{ background: '#dd2c37', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '5px 11px', borderRadius: '20px' }}>
            Minggu ini
          </span>
        </div>
        <p style={{ fontSize: '9px', color: '#a3a3a7', margin: '0 0 13px', lineHeight: 1.25 }}>Lokasi yang paling banyak dilaporkan pada minggu ini</p>

        <div style={{ display: 'grid', gap: '9px' }}>
          {locations.map((loc, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#343438', marginBottom: '4px', fontSize: '8px', fontWeight: 600 }}>
                <span>{loc.name}</span>
                <span>{loc.percent} ({loc.count})</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#c9c9cc', borderRadius: '99px', overflow: 'hidden' }}>
                <div
                  style={{ width: loc.percent.replace(',', '.'), height: '100%', borderRadius: '99px', background: '#ed2735' }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '15px', border: '1px solid #ed4550', borderRadius: '8px', padding: '10px', display: 'flex', alignItems: 'flex-start', gap: '7px', color: '#df2632' }}>
        <svg className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <h4 style={{ margin: '0 0 5px', fontSize: '9px', fontWeight: 700 }}>Perhatian</h4>
          <p style={{ margin: 0, fontSize: '8px', lineHeight: 1.4, color: '#77777b' }}>
            Parkir Motor TULT menjadi lokasi dengan laporan terbanyak minggu ini
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationStatsCard;
