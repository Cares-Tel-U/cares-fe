import React from 'react';

const default24Hours = Array.from({ length: 24 }, (_, h) => ({ hour: h, val: 0 }));

const AnalyticsHourlyChart = ({ data = default24Hours }) => {
  const chartData = data && data.length > 0 ? data : default24Hours;
  const maxVal = Math.max(...chartData.map((d) => d.val), 1);
  const effMax = Math.max(maxVal, 4);
  const showLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
  const yTicks = [effMax, Math.round((effMax * 2) / 3), Math.round(effMax / 3), 0];

  const W = 480;
  const H = 120;
  const padT = 6;
  const chartH = H - padT;
  const slotW = W / 24;

  return (
    <div style={{ width: '100%', userSelect: 'none' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: '10px', alignItems: 'stretch' }}>
        {/* Y Axis Ticks */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2px 0', fontSize: '11px', color: '#9ca3af', textAlign: 'right', fontWeight: 500, height: '120px' }}>
          {yTicks.map((t, idx) => (
            <span key={idx} style={{ lineHeight: 1 }}>{t}</span>
          ))}
        </div>

        {/* Bars SVG */}
        <div style={{ position: 'relative', width: '100%', height: '120px' }}>
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            style={{ overflow: 'visible', display: 'block' }}
          >
            {/* Horizontal Grid lines */}
            {yTicks.map((t, idx) => {
              const y = padT + chartH - (t / effMax) * chartH;
              return (
                <line
                  key={idx}
                  x1="0"
                  y1={y}
                  x2={W}
                  y2={y}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

            {/* Bars */}
            {chartData.map((d, i) => {
              const bh = (d.val / effMax) * chartH;
              const barWidth = Math.min(slotW * 0.55, 12);
              const barX = i * slotW + (slotW - barWidth) / 2;
              return (
                <rect
                  key={i}
                  x={barX}
                  y={padT + chartH - bh}
                  width={barWidth}
                  height={Math.max(bh, 0)}
                  fill="#dc2626"
                  rx="2"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* X Axis Labels */}
      <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: '10px', marginTop: '10px' }}>
        <div />
        <div style={{ position: 'relative', width: '100%', height: '16px' }}>
          {showLabels.map((lbl, idx) => {
            const hour = idx * 4; // 0, 4, 8, 12, 16, 20
            const pct = ((hour + 0.5) / 24) * 100;
            return (
              <span
                key={idx}
                style={{
                  position: 'absolute',
                  left: `${pct}%`,
                  transform: 'translateX(-50%)',
                  fontSize: '11px',
                  color: '#9ca3af',
                  fontWeight: 500,
                  whiteSpace: 'nowrap'
                }}
              >
                {lbl}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHourlyChart;
