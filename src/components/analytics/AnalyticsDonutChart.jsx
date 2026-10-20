import React from 'react';

const AnalyticsDonutChart = ({ data = [] }) => {
  const chartData = data && data.length > 0 ? data : [];
  const cx = 80;
  const cy = 80;
  const R = 65;
  const r = 44;
  const total = chartData.reduce((s, d) => s + (d.count || 0), 0);
  let startAngle = -Math.PI / 2;

  const slices = chartData.map((d) => {
    const angle = total > 0 ? ((d.count || 0) / total) * 2 * Math.PI : 0;
    const x1 = cx + R * Math.cos(startAngle);
    const y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(startAngle + angle);
    const y2 = cy + R * Math.sin(startAngle + angle);
    const x3 = cx + r * Math.cos(startAngle + angle);
    const y3 = cy + r * Math.sin(startAngle + angle);
    const x4 = cx + r * Math.cos(startAngle);
    const y4 = cy + r * Math.sin(startAngle);
    const large = angle > Math.PI ? 1 : 0;
    const path = angle > 0
      ? `M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${x3},${y3} A${r},${r} 0 ${large},0 ${x4},${y4} Z`
      : '';
    startAngle += angle;
    return { ...d, path };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
      <div style={{ flexShrink: 0 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          {slices.map((s, i) => (
            s.path ? <path key={i} d={s.path} fill={s.color} /> : null
          ))}
          <circle cx={cx} cy={cy} r={r - 1} fill="white" />
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="20" fontWeight="800" fill="#111827">
            {total}
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fill="#9ca3af">
            Laporan
          </text>
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', flex: 1, minWidth: '160px' }}>
        {chartData.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: d.color, flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: '#374151' }}>{d.label}</span>
            </div>
            <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', whiteSpace: 'nowrap' }}>
              {d.percent}% ({d.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsDonutChart;
