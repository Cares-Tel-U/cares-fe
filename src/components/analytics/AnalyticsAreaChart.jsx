import React, { useMemo } from 'react';

const AnalyticsAreaChart = ({ data = [] }) => {
  const chartData = data && data.length > 0 ? data : [];
  if (chartData.length === 0) {
    return (
      <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '11.5px' }}>
        Belum ada data tren laporan pada periode ini
      </div>
    );
  }
  const maxVal = Math.max(...chartData.map((d) => d.value), 4);
  const yTicks = [maxVal, Math.round((maxVal * 2) / 3), Math.round(maxVal / 3), 0];

  const W = 500;
  const H = 140;
  const padX = 14;
  const padT = 14;
  const padB = 10;
  const chartW = W - padX * 2;
  const chartH = H - padT - padB;
  const baselineY = padT + chartH;

  const pts = chartData.map((d, i) => ({
    x: chartData.length > 1 ? padX + (i / (chartData.length - 1)) * chartW : W / 2,
    y: padT + chartH - (d.value / maxVal) * chartH,
    value: d.value,
    label: d.label
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = pts.length > 1
    ? `${linePath} L${pts[pts.length - 1].x},${baselineY} L${pts[0].x},${baselineY} Z`
    : '';

  // Filter label sumbu X agar rapi dan tidak tumpang tindih untuk rentang data panjang
  const visibleXLabels = useMemo(() => {
    if (pts.length <= 8) return pts;
    const step = Math.ceil(pts.length / 6);
    return pts.filter((_, idx) => idx === 0 || idx === pts.length - 1 || idx % step === 0);
  }, [pts]);

  return (
    <div style={{ width: '100%', userSelect: 'none' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: '10px', alignItems: 'stretch' }}>
        {/* Y Axis Ticks */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2px 0', fontSize: '11px', color: '#9ca3af', textAlign: 'right', fontWeight: 500, height: '140px' }}>
          {yTicks.map((t, idx) => (
            <span key={idx} style={{ lineHeight: 1 }}>{t}</span>
          ))}
        </div>

        {/* Chart Container & SVG */}
        <div style={{ position: 'relative', width: '100%', height: '140px', overflow: 'visible' }}>
          <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ overflow: 'visible', display: 'block' }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dc2626" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {yTicks.map((t, idx) => {
              const y = padT + chartH - (t / maxVal) * chartH;
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

            {/* Area fill */}
            {areaPath && <path d={areaPath} fill="url(#areaGrad)" />}

            {/* Line path */}
            <path
              d={linePath}
              fill="none"
              stroke="#dc2626"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>

          {/* Interactive Data Dots */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
            {pts.map((p, i) => {
              const hasData = p.value > 0;
              return (
                <div
                  key={i}
                  title={`${p.label}: ${p.value} Laporan`}
                  style={{
                    position: 'absolute',
                    left: `${(p.x / W) * 100}%`,
                    top: `${(p.y / H) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    width: hasData ? '11px' : '6px',
                    height: hasData ? '11px' : '6px',
                    borderRadius: '50%',
                    backgroundColor: hasData ? '#dc2626' : '#d1d5db',
                    border: hasData ? '2.5px solid #ffffff' : '1px solid #9ca3af',
                    boxShadow: hasData ? '0 1px 3px rgba(220, 38, 38, 0.4)' : 'none',
                    pointerEvents: 'auto',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                    animation: hasData ? 'chartPulse 2s infinite ease-in-out' : 'none',
                    zIndex: hasData ? 2 : 1
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* X Axis Labels */}
      <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: '10px', marginTop: '10px' }}>
        <div />
        <div style={{ position: 'relative', width: '100%', height: '18px' }}>
          {visibleXLabels.map((p, i) => {
            const leftPercent = (p.x / W) * 100;
            return (
              <span
                key={i}
                style={{
                  position: 'absolute',
                  left: `${leftPercent}%`,
                  transform: leftPercent === 0 ? 'none' : leftPercent === 100 ? 'translateX(-100%)' : 'translateX(-50%)',
                  fontSize: '11px',
                  color: '#9ca3af',
                  fontWeight: 500,
                  whiteSpace: 'nowrap'
                }}
              >
                {p.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsAreaChart;
