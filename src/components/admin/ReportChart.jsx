import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../services';

const ReportChart = () => {
  const [filter, setFilter] = useState('Mingguan');
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const timeframe = filter === 'Mingguan' ? 'weekly' : 'monthly';
        const res = await adminService.getAdminStats(timeframe);
        if (isMounted && res?.chartData && Array.isArray(res.chartData)) {
          setChartData(res.chartData);
        }
      } catch (err) {
        console.warn('Gagal memuat chart data dari API:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [filter]);

  // Siapkan rentang data lengkap berdasarkan filter waktu
  const processedData = useMemo(() => {
    const rawMap = {};
    if (Array.isArray(chartData)) {
      chartData.forEach((d) => {
        if (d && d.date) {
          rawMap[d.date] = Number(d.count) || 0;
        }
      });
    }

    const daysCount = filter === 'Mingguan' ? 7 : 30;
    const result = [];
    const today = new Date();

    for (let i = daysCount - 1; i >= 0; i--) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - i);
      const isoKey = targetDate.toISOString().slice(0, 10);
      const d = targetDate.getDate();
      const m = targetDate.getMonth() + 1;
      const label = `${d}/${m}`;
      result.push({
        date: isoKey,
        label,
        count: rawMap[isoKey] || 0
      });
    }

    return result;
  }, [chartData, filter]);

  // Hitung metrik dan koordinat SVG grafik
  const { pts, linePath, areaPath, maxVal, yTicks } = useMemo(() => {
    const counts = processedData.map((d) => d.count);
    const highest = Math.max(...counts, 4);
    const ticks = [highest, Math.round((highest * 2) / 3), Math.round(highest / 3), 0];

    const W = 500;
    const H = 160;
    const padT = 12;
    const padB = 10;
    const chartH = H - padT - padB;
    const baselineY = padT + chartH;

    const points = processedData.map((d, idx) => {
      const x = processedData.length > 1 ? (idx / (processedData.length - 1)) * W : W / 2;
      const y = padT + chartH - (d.count / highest) * chartH;
      return {
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        count: d.count,
        label: d.label
      };
    });

    let lPath = '';
    let aPath = '';

    if (points.length > 1) {
      lPath = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
      const firstX = points[0].x;
      const lastX = points[points.length - 1].x;
      aPath = `${lPath} L${lastX},${baselineY} L${firstX},${baselineY} Z`;
    }

    return {
      pts: points,
      linePath: lPath,
      areaPath: aPath,
      maxVal: highest,
      yTicks: ticks,
      W,
      H,
      baselineY,
      padT,
      chartH
    };
  }, [processedData]);

  // Filter label sumbu X agar rapi dan tidak tumpang tindih
  const visibleXLabels = useMemo(() => {
    if (filter === 'Mingguan') {
      return pts;
    }
    // Untuk bulanan, tampilkan setiap 5-6 titik agar bersih
    const step = Math.ceil(pts.length / 6);
    return pts.filter((_, idx) => idx === 0 || idx === pts.length - 1 || idx % step === 0);
  }, [pts, filter]);

  return (
    <section
      style={{
        height: '100%',
        minHeight: '342px',
        boxSizing: 'border-box',
        background: '#fff',
        border: '1px solid #d7d7d7',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }}
    >
      {/* Header Kartu */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
          flexShrink: 0
        }}
      >
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#303038' }}>Grafik Laporan</h3>
        <div style={{ display: 'flex', border: '1px solid #d8d8d8', borderRadius: '16px', padding: '2px', fontSize: '11.5px' }}>
          {['Mingguan', 'Bulanan'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              style={{
                minWidth: '67px',
                padding: '4px 12px',
                border: 0,
                borderRadius: '14px',
                color: filter === option ? '#fff' : '#888888',
                background: filter === option ? '#d91f2c' : 'transparent',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s ease, color 0.2s ease'
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Kontainer Grafik Presisi & Terkunci di Dalam Kotak */}
      <div
        style={{
          flex: 1,
          minHeight: '220px',
          maxHeight: '260px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden'
        }}
      >
        {/* Area Sumbu Y & SVG */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '26px 1fr',
            gap: '10px',
            alignItems: 'stretch',
            height: '180px',
            overflow: 'hidden'
          }}
        >
          {/* Label Sumbu Y */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '6px 0',
              color: '#65666c',
              fontSize: '11px',
              fontWeight: 500,
              textAlign: 'right'
            }}
          >
            {yTicks.map((t, idx) => (
              <span key={idx} style={{ lineHeight: 1 }}>{t}</span>
            ))}
          </div>

          {/* Wrapper SVG Grafik */}
          <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', fontSize: '12.5px' }}>
                Memuat grafik tren...
              </div>
            ) : (
              <svg
                viewBox="0 0 500 160"
                preserveAspectRatio="none"
                style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'block' }}
                aria-label="Grafik jumlah laporan"
              >
                <defs>
                  <linearGradient id="adminReportFillGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#df3541" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#f6d5d7" stopOpacity="0.03" />
                  </linearGradient>
                </defs>

                {/* Garis Kisi Horizontal Sejajar dengan Sumbu Y */}
                {yTicks.map((t, idx) => {
                  const y = 12 + 138 - (t / maxVal) * 138;
                  return (
                    <line
                      key={idx}
                      x1="0"
                      y1={y}
                      x2="500"
                      y2={y}
                      stroke="#ededed"
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}

                {/* Area Gradien Merah Halus */}
                {areaPath && <path d={areaPath} fill="url(#adminReportFillGrad)" />}

                {/* Garis Kurva Tren Merah */}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#c81d27"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                )}

                {/* Titik Lingkaran Data (Dots) */}
                {pts.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r={p.count > 0 ? 3.5 : 2}
                    fill={p.count > 0 ? '#c81d27' : '#e5e7eb'}
                    stroke={p.count > 0 ? '#ffffff' : '#9ca3af'}
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
            )}
          </div>
        </div>

        {/* Label Sumbu X Terpisah Rapi */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '26px 1fr',
            gap: '10px',
            marginTop: '8px',
            borderTop: '1px solid #d8d8d8',
            paddingTop: '6px',
            flexShrink: 0
          }}
        >
          <div />
          <div style={{ position: 'relative', width: '100%', height: '18px' }}>
            {visibleXLabels.map((p, idx) => {
              const leftPercent = (p.x / 500) * 100;
              return (
                <span
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: `${leftPercent}%`,
                    transform: leftPercent === 0 ? 'none' : leftPercent === 100 ? 'translateX(-100%)' : 'translateX(-50%)',
                    fontSize: '11px',
                    color: '#65666c',
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
    </section>
  );
};

export default ReportChart;
