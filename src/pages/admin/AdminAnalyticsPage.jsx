import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { adminService } from '../../services';

// Area Chart Dinamis berbasis Data Riil API
const AreaChart = ({ data = [] }) => {
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
  const padT = 8;
  const padB = 8;
  const chartH = H - padT - padB;

  const pts = chartData.map((d, i) => ({
    x: chartData.length > 1 ? (i / (chartData.length - 1)) * W : W / 2,
    y: padT + chartH - (d.value / maxVal) * chartH
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = pts.length > 1
    ? `${linePath} L${pts[pts.length - 1].x},${padT + chartH} L${pts[0].x},${padT + chartH} Z`
    : '';

  return (
    <div style={{ width: '100%', userSelect: 'none' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: '10px', alignItems: 'stretch' }}>
        {/* Y Axis Ticks (HTML: proporsional, rapi, tajam, ukuran 11px) */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '2px 0', fontSize: '11px', color: '#9ca3af', textAlign: 'right', fontWeight: 500, height: '140px' }}>
          {yTicks.map((t, idx) => (
            <span key={idx} style={{ lineHeight: 1 }}>{t}</span>
          ))}
        </div>

        {/* Chart SVG */}
        <div style={{ position: 'relative', width: '100%', height: '140px' }}>
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

            {/* Line: garis ramping 1.5px presisi */}
            <path
              d={linePath}
              fill="none"
              stroke="#dc2626"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Dots: titik data proporsional */}
            {pts.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="3"
                fill="#dc2626"
                stroke="#fff"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* X Axis Labels (HTML: proporsional, ukuran 11px, terpusat persis di bawah titik data) */}
      <div style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: '10px', marginTop: '10px' }}>
        <div />
        <div style={{ position: 'relative', width: '100%', height: '16px' }}>
          {pts.map((p, i) => (
            <span
              key={i}
              style={{
                position: 'absolute',
                left: `${(p.x / W) * 100}%`,
                transform: 'translateX(-50%)',
                fontSize: '11px',
                color: '#9ca3af',
                fontWeight: 500,
                whiteSpace: 'nowrap'
              }}
            >
              {p.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// SVG Donut Chart Dinamis
const DonutChart = ({ data = DONUT_DATA }) => {
  const chartData = data && data.length > 0 ? data : DONUT_DATA;
  const cx = 80, cy = 80, R = 65, r = 44;
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
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="20" fontWeight="800" fill="#111827">{total}</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fill="#9ca3af">Laporan</text>
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

// Hourly Bar Chart Dinamis
const default24Hours = Array.from({ length: 24 }, (_, h) => ({ hour: h, val: 0 }));
const HourlyBarChart = ({ data = default24Hours }) => {
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
        {/* Y Axis Ticks (HTML: proporsional, ukuran 11px) */}
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

            {/* Bars: proporsional dan rapi */}
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

      {/* X Axis Labels (HTML: proporsional, ukuran 11px) */}
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

// ─── Main Page ─────────────────────────────────────────────────────────────────
const AdminAnalyticsPage = ({
  user,
  reports = [],
  notifications = [],
  onMarkAllNotificationsAsRead,
  onMarkNotificationAsRead,
  onLogout,
  onUpdateAvatar
}) => {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const filters = ['Semua', 'Minggu Ini', 'Bulan Ini'];

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        setLoading(true);
        const timeframe = activeFilter === 'Minggu Ini' ? 'weekly' : activeFilter === 'Bulan Ini' ? 'monthly' : 'weekly';
        const res = await adminService.getAdminStats(timeframe);
        if (isMounted && res) {
          setStats(res);
        }
      } catch (err) {
        console.warn('Gagal memuat statistik dari API:', err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [activeFilter]);

  // Perhitungan Angka Metrik Dinamis
  const totalReportsCount = stats?.summary?.total ?? reports.length;
  const pendingReportsCount = stats?.summary?.pending ?? reports.filter((r) => r.status === 'Menunggu Verifikasi').length;
  const inProgressReportsCount = stats?.summary?.inProgress ?? reports.filter((r) => r.status === 'Diproses').length;
  const completedReportsCount = stats?.summary?.completed ?? reports.filter((r) => r.status === 'Selesai').length;
  const rejectedReportsCount = stats?.summary?.rejected ?? reports.filter((r) => r.status === 'Ditolak').length;

  // Data Donut Chart Dinamis
  const donutData = useMemo(() => {
    const total = totalReportsCount || 1;
    return [
      {
        label: 'Menunggu Verifikasi',
        count: pendingReportsCount,
        percent: Number(((pendingReportsCount / total) * 100).toFixed(2)),
        color: '#facc15'
      },
      {
        label: 'Diproses',
        count: inProgressReportsCount,
        percent: Number(((inProgressReportsCount / total) * 100).toFixed(2)),
        color: '#38bdf8'
      },
      {
        label: 'Selesai',
        count: completedReportsCount,
        percent: Number(((completedReportsCount / total) * 100).toFixed(2)),
        color: '#22c55e'
      },
      {
        label: 'Ditolak',
        count: rejectedReportsCount,
        percent: Number(((rejectedReportsCount / total) * 100).toFixed(2)),
        color: '#ef4444'
      }
    ];
  }, [totalReportsCount, pendingReportsCount, inProgressReportsCount, completedReportsCount, rejectedReportsCount]);

  // Data Area Chart Dinamis
  const areaChartData = useMemo(() => {
    if (stats?.chartData && Array.isArray(stats.chartData) && stats.chartData.length > 0) {
      return stats.chartData.map((d) => {
        const parts = d.date.split('-');
        const label = parts.length === 3 ? `${parseInt(parts[2], 10)}/${parseInt(parts[1], 10)}` : d.date;
        return { label, value: d.count };
      });
    }
    return [];
  }, [stats]);

  // Data Lokasi Terbanyak Dinamis
  const locationData = useMemo(() => {
    if (!reports || reports.length === 0) return [];
    const map = {};
    reports.forEach((r) => {
      const loc = r.namaRuangan || r.lokasi || 'Fasilitas Kampus';
      map[loc] = (map[loc] || 0) + 1;
    });
    const total = reports.length || 1;
    return Object.entries(map)
      .map(([name, count]) => ({
        name,
        count,
        percent: Number(((count / total) * 100).toFixed(2))
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [reports]);

  // Data Jam Ramai Dinamis
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, h) => ({ hour: h, val: 0 }));
    if (!reports || reports.length === 0) return hours;
    reports.forEach((r) => {
      if (r.createdAt) {
        const d = new Date(r.createdAt);
        const h = d.getHours();
        if (h >= 0 && h < 24) {
          hours[h].val += 1;
        }
      }
    });
    return hours;
  }, [reports]);

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #e5e7eb',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
    overflow: 'hidden'
  };

  return (
    <AdminLayout
      title="Data Statistik"
      subtitle="Lihat statistik dan perkembangan laporan fasilitas kampus"
      user={user}
      notifications={notifications}
      onMarkAllNotificationsAsRead={onMarkAllNotificationsAsRead}
      onMarkNotificationAsRead={onMarkNotificationAsRead}
      onLogout={onLogout}
      onUpdateAvatar={onUpdateAvatar}
    >
      {/* Pill Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveFilter(f)}
            style={{
              padding: '6px 18px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              backgroundColor: activeFilter === f ? '#dc2626' : '#f3f4f6',
              color: activeFilter === f ? '#ffffff' : '#6b7280'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* 3 Metric Cards */}
      <div className="analytics-metric-grid">
        {/* Card 1 – Total */}
        <div
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            borderRadius: '14px',
            padding: '22px 22px',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: '500', opacity: 0.88, marginBottom: '10px' }}>
                Total Laporan Masuk
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', lineHeight: 1 }}>{totalReportsCount}</div>
            </div>
            <div style={{ opacity: 0.3 }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: '-18px', right: '-18px', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Card 2 – Menunggu Verifikasi */}
        <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12.5px', color: '#6b7280', fontWeight: '500', marginBottom: '10px' }}>
                Menunggu Verifikasi
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{pendingReportsCount}</div>
            </div>
            <div style={{ color: '#d1d5db' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: '-18px', right: '-18px', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f9fafb' }} />
        </div>

        {/* Card 3 – Laporan Diproses */}
        <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12.5px', color: '#6b7280', fontWeight: '500', marginBottom: '10px' }}>
                Laporan Diproses
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>{inProgressReportsCount}</div>
            </div>
            <div style={{ color: '#d1d5db' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: '-18px', right: '-18px', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f9fafb' }} />
        </div>
      </div>

      {/* Middle Row: Area Chart + Donut */}
      <div className="analytics-chart-grid">
        {/* Grafik Laporan */}
        <div style={cardStyle}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
            Grafik Laporan
          </div>
          <AreaChart data={areaChartData} />
        </div>

        {/* Distribusi Status Laporan */}
        <div style={cardStyle}>
          <div style={{ marginBottom: '4px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>
              Distribusi Status Laporan
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
              Persentase status dari seluruh laporan yang masuk
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <DonutChart data={donutData} />
          </div>
        </div>
      </div>

      {/* Bottom Row: Location + Hourly */}
      <div className="analytics-bottom-grid">
        {/* Jumlah Laporan Berdasarkan Lokasi */}
        <div style={cardStyle}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>
            Jumlah Laporan Berdasarkan Lokasi
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px', marginTop: '2px' }}>
            Lokasi yang paling banyak dilaporkan
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {locationData.length > 0 ? (
              locationData.map((loc, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12.5px', color: '#374151', fontWeight: '500' }}>{loc.name}</span>
                    <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>
                      {loc.percent}% ({loc.count})
                    </span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#f3f4f6', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${loc.percent}%`,
                        backgroundColor: '#dc2626',
                        borderRadius: '9999px',
                        transition: 'width 0.6s ease'
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '24px 0', textAlign: 'center', color: '#9ca3af', fontSize: '12px' }}>
                Belum ada data laporan lokasi
              </div>
            )}
          </div>
        </div>

        {/* Jam Ramai Laporan */}
        <div style={cardStyle}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>
            Jam Ramai Laporan
          </div>
          <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px', marginTop: '2px' }}>
            Menunjukkan waktu dengan jumlah laporan yang paling banyak masuk
          </div>
          <HourlyBarChart data={hourlyData} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalyticsPage;