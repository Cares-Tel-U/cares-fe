import React, { useState } from 'react';

const graphData = {
  Mingguan: { path: 'M0 78 L35 110 L70 58 L105 88 L140 28 L175 58 L210 86 L245 52 L280 8 L315 43 L350 78 L385 58 L420 28', dates: ['30 Ags', '31 Ags', '1 Sep', '2 Sep', '3 Sep', '4 Sep', '5 Sep'] },
  Bulanan: { path: 'M0 104 L21 122 L42 64 L63 84 L84 36 L105 104 L126 82 L147 122 L168 140 L189 64 L210 84 L231 8 L252 36 L273 104 L294 122 L315 140 L336 82 L357 62 L378 36 L399 84 L420 8', dates: ['8 Agu', '11 Agu', '14 Agu', '17 Agu', '20 Agu', '23 Agu', '26 Agu', '29 Agu', '1 Sep', '4 Sep'] }
};

const ReportChart = () => {
  const [filter, setFilter] = useState('Mingguan');
  const { path, dates } = graphData[filter];
  return <section style={{ height: '100%', minHeight: '342px', boxSizing: 'border-box', background: '#fff', border: '1px solid #d7d7d7', borderRadius: '8px', padding: '16px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
      <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#303038' }}>Grafik Laporan</h3>
      <div style={{ display: 'flex', border: '1px solid #d8d8d8', borderRadius: '16px', padding: '1px', fontSize: '9px' }}>
        {['Mingguan', 'Bulanan'].map((option) => <button key={option} type="button" onClick={() => setFilter(option)} style={{ minWidth: '67px', padding: '5px 10px', border: 0, borderRadius: '14px', color: filter === option ? '#fff' : '#c1c1c1', background: filter === option ? '#d91f2c' : 'transparent', fontSize: '9px', cursor: 'pointer' }}>{option}</button>)}
      </div>
    </div>
    <div style={{ height: '260px', display: 'grid', gridTemplateColumns: '17px 1fr', gridTemplateRows: '1fr 18px', color: '#65666c', fontSize: '8px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '7px 0 17px' }}><span>9</span><span>6</span><span>3</span><span>0</span></div>
      <svg viewBox="0 0 420 150" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }} aria-label="Grafik jumlah laporan">
        <defs><linearGradient id="adminReportFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#df3541" stopOpacity=".65" /><stop offset="100%" stopColor="#f6d5d7" stopOpacity=".15" /></linearGradient></defs>
        {[0, 50, 100, 150].map((line) => <line key={line} x1="0" x2="420" y1={line} y2={line} stroke="#ededed" strokeWidth=".6" />)}
        <path d={`${path} L420 150 L0 150 Z`} fill="url(#adminReportFill)" />
        <path d={path} fill="none" stroke="#c81d27" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div />
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #9a9a9a', paddingTop: '4px', whiteSpace: 'nowrap' }}>{dates.map((date) => <span key={date}>{date}</span>)}</div>
    </div>
  </section>;
};

export default ReportChart;
