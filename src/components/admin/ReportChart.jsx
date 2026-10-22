import React, { useState, useEffect, useMemo } from 'react';
import { adminService } from '../../services';

// Dimensi internal viewBox SVG
const VB_W = 500;
const VB_H = 160;
const PAD_X = 14;   // Padding horizontal dalam viewBox agar titik data tidak terpotong tepi
const PAD_T = 14;   // Padding vertikal atas viewBox
const PAD_B = 14;   // Padding vertikal bawah viewBox
const CHART_AREA_H = VB_H - PAD_T - PAD_B;  // = 132

// Dimensi layout UI
const Y_AXIS_WIDTH = 32; // Lebar kolom sumbu Y dalam piksel
const X_LABEL_H    = 24; // Tinggi area label sumbu X dalam piksel

const ReportChart = () => {
  const [filter, setFilter]         = useState('Mingguan');
  const [chartData, setChartData]   = useState([]);
  const [isLoading, setIsLoading]   = useState(false);

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
    return () => { isMounted = false; };
  }, [filter]);

  // Lengkapi rentang tanggal sesuai filter
  const processedData = useMemo(() => {
    const rawMap = {};
    if (Array.isArray(chartData)) {
      chartData.forEach((d) => {
        if (d && d.date) rawMap[d.date] = Number(d.count) || 0;
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
      result.push({ date: isoKey, label: `${d}/${m}`, count: rawMap[isoKey] || 0 });
    }
    return result;
  }, [chartData, filter]);

  // Hitung koordinat titik, jalur kurva, dan tick Y
  const { pts, linePath, areaPath, maxVal, yTicks, baselineY } = useMemo(() => {
    const counts = processedData.map((d) => d.count);
    const highest = Math.max(...counts, 4);
    // 4 tick horizontal: max, 2/3, 1/3, 0
    const ticks = [
      highest,
      Math.round((highest * 2) / 3),
      Math.round(highest / 3),
      0
    ];
    const baseline = PAD_T + CHART_AREA_H; // y untuk nilai 0

    const usableWidth = VB_W - 2 * PAD_X;
    const count = processedData.length;

    const points = processedData.map((d, idx) => {
      const x = count > 1 ? PAD_X + (idx / (count - 1)) * usableWidth : VB_W / 2;
      const y = PAD_T + CHART_AREA_H - (d.count / highest) * CHART_AREA_H;
      return {
        x: Math.round(x * 10) / 10,
        y: Math.round(y * 10) / 10,
        count: d.count,
        label: d.label,
        date: d.date,
        isFirst: idx === 0,
        isLast: idx === count - 1
      };
    });

    let lPath = '';
    let aPath = '';
    if (points.length > 1) {
      lPath = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
        .join(' ');
      const first = points[0];
      const last  = points[points.length - 1];
      aPath = `${lPath} L${last.x},${baseline} L${first.x},${baseline} Z`;
    }

    return {
      pts: points,
      linePath: lPath,
      areaPath: aPath,
      maxVal: highest,
      yTicks: ticks,
      baselineY: baseline
    };
  }, [processedData]);

  // Saring label tanggal agar tidak tumpang tindih pada mode Bulanan
  const visibleXLabels = useMemo(() => {
    if (filter === 'Mingguan') return pts;
    const step = Math.ceil(pts.length / 6);
    return pts.filter((_, idx) => idx === 0 || idx === pts.length - 1 || idx % step === 0);
  }, [pts, filter]);

  return (
    <section
      style={{
        background: '#fff',
        border: '1px solid #d7d7d7',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflow: 'hidden',
        height: '100%',
        minHeight: '342px'
      }}
    >
      {/* ── Header Kartu ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
          flexShrink: 0
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#303038' }}>
            Grafik Laporan
          </h3>
          <p style={{ fontSize: '12px', color: '#a3a3a7', margin: '4px 0 0', lineHeight: 1.35 }}>
            Tren volume laporan fasilitas yang masuk
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            border: '1px solid #d8d8d8',
            borderRadius: '16px',
            padding: '2px',
            fontSize: '11.5px',
            flexShrink: 0
          }}
        >
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

      {/* ── Area Grafik ── */}
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            minHeight: '200px',
            color: '#9ca3af',
            fontSize: '12.5px'
          }}
        >
          Memuat grafik tren...
        </div>
      ) : (
        <div style={{ userSelect: 'none', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

          {/* ── Baris: Sumbu Y + Area SVG Kurva ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'stretch',
              flex: 1,
              minHeight: '180px',
              position: 'relative'
            }}
          >
            {/* Kolom Label Sumbu Y — diposisikan absolut per persentase ketinggian viewBox */}
            <div
              style={{
                width: `${Y_AXIS_WIDTH}px`,
                flexShrink: 0,
                position: 'relative',
                boxSizing: 'border-box'
              }}
            >
              {yTicks.map((t, idx) => {
                const y = PAD_T + CHART_AREA_H - (t / maxVal) * CHART_AREA_H;
                const topPct = (y / VB_H) * 100;
                return (
                  <span
                    key={idx}
                    style={{
                      position: 'absolute',
                      top: `${topPct}%`,
                      transform: 'translateY(-50%)',
                      right: '8px',
                      fontSize: '11px',
                      color: '#65666c',
                      fontWeight: 500,
                      lineHeight: 1,
                      userSelect: 'none'
                    }}
                  >
                    {t}
                  </span>
                );
              })}
            </div>

            {/* Kontainer SVG — mengisi sisa ruang flex */}
            <div
              style={{
                flex: 1,
                minWidth: 0,
                minHeight: 0,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <svg
                viewBox={`0 0 ${VB_W} ${VB_H}`}
                preserveAspectRatio="none"
                width="100%"
                height="100%"
                aria-label="Grafik jumlah laporan"
                style={{ display: 'block', overflow: 'hidden', position: 'absolute', inset: 0 }}
              >
                <defs>
                  <linearGradient id="adminReportFillGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#df3541" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#f6d5d7" stopOpacity="0.01" />
                  </linearGradient>
                </defs>

                {/* Garis kisi horizontal — sejajar presisi dengan tick Y */}
                {yTicks.map((t, idx) => {
                  const y = PAD_T + CHART_AREA_H - (t / maxVal) * CHART_AREA_H;
                  return (
                    <line
                      key={idx}
                      x1="0"
                      y1={y}
                      x2={VB_W}
                      y2={y}
                      stroke={t === 0 ? '#d8d8d8' : '#f0f0f0'}
                      strokeWidth="1"
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}

                {/* Area gradien merah di bawah kurva */}
                {areaPath && <path d={areaPath} fill="url(#adminReportFillGrad)" />}

                {/* Garis kurva tren */}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#c81d27"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                )}
              </svg>

              {/* Titik data HTML: Selalu bulat sempurna (tidak terdistorsi oleh rasio SVG) & memiliki efek animasi denyut */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {pts.map((p, idx) => {
                  const hasData = p.count > 0;
                  const leftPct = (p.x / VB_W) * 100;
                  const topPct = (p.y / VB_H) * 100;
                  return (
                    <div
                      key={idx}
                      title={`${p.label}: ${p.count} Laporan`}
                      style={{
                        position: 'absolute',
                        left: `${leftPct}%`,
                        top: `${topPct}%`,
                        transform: 'translate(-50%, -50%)',
                        width: hasData ? '11px' : '6.5px',
                        height: hasData ? '11px' : '6.5px',
                        borderRadius: '50%',
                        backgroundColor: hasData ? '#dc2626' : '#d1d5db',
                        border: hasData ? '2.5px solid #ffffff' : '1px solid #9ca3af',
                        boxShadow: hasData ? '0 1px 4px rgba(220, 38, 38, 0.45)' : 'none',
                        animation: hasData ? 'chartPulse 2s infinite ease-in-out' : 'none',
                        zIndex: hasData ? 2 : 1,
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        boxSizing: 'border-box',
                        transition: 'transform 0.15s ease'
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Baris Tanggal Sumbu X ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '6px',
              height: `${X_LABEL_H}px`
            }}
          >
            {/* Spacer selebar kolom sumbu Y */}
            <div style={{ width: `${Y_AXIS_WIDTH}px`, flexShrink: 0 }} />

            {/* Kontainer label tanggal — sejajar persis dengan lebar area SVG */}
            <div style={{ flex: 1, position: 'relative', height: '100%', minWidth: 0 }}>
              {visibleXLabels.map((p, idx) => {
                const leftPct = (p.x / VB_W) * 100;
                
                // Menjaga agar label di ujung kiri tidak menabrak sumbu Y dan ujung kanan tidak terpotong tepi kartu
                let transformValue = 'translateX(-50%)';
                if (p.isFirst) {
                  transformValue = 'translateX(0)';
                } else if (p.isLast) {
                  transformValue = 'translateX(-100%)';
                }

                return (
                  <span
                    key={idx}
                    style={{
                      position: 'absolute',
                      left: `${leftPct}%`,
                      top: '50%',
                      transform: `${transformValue} translateY(-50%)`,
                      fontSize: '11px',
                      color: '#65666c',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      lineHeight: 1
                    }}
                  >
                    {p.label}
                  </span>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </section>
  );
};

export default ReportChart;
