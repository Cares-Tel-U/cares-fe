import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';

// ─── Data ─────────────────────────────────────────────────────────────────────
const AREA_CHART_DATA = [
  { label: '30 Ags', value: 6 },
  { label: '31 Ags', value: 3 },
  { label: '1 Sep',  value: 5 },
  { label: '2 Sep',  value: 6 },
  { label: '3 Sep',  value: 9 },
  { label: '4 Sep',  value: 6 },
  { label: '5 Sep',  value: 7 }
];

const DONUT_DATA = [
  { label: 'Menunggu Verifikasi', percent: 1.61, count: 2,   color: '#facc15' },
  { label: 'Diproses',            percent: 1.61, count: 2,   color: '#38bdf8' },
  { label: 'Selesai',             percent: 88.71, count: 110, color: '#22c55e' },
  { label: 'Ditolak',             percent: 8.07,  count: 10,  color: '#ef4444' }
];

const LOCATION_DATA = [
  { name: 'Parkir Motor TULT', percent: 25.81, count: 32 },
  { name: 'TULT 0712',          percent: 22.58, count: 28 },
  { name: 'Parkir Asrama',      percent: 19.35, count: 24 },
  { name: 'Parkir GKU',         percent: 14.52, count: 18 },
  { name: 'Lainnya',            percent: 17.74, count: 22 }
];

const HOURLY_DATA = [
  { hour: '00:00', val: 0 }, { hour: '03:00', val: 2 }, { hour: '06:00', val: 4 },
  { hour: '09:00', val: 8 }, { hour: '12:00', val: 14 }, { hour: '15:00', val: 22 },
  { hour: '18:00', val: 17 }, { hour: '21:00', val: 8 }
];

// All hours 0-23 for bar chart
const ALL_HOURS = [];
for (let h = 0; h < 24; h++) {
  // bell curve peaking around 15
  const dist = Math.abs(h - 15);
  const val = Math.max(0, Math.round(22 * Math.exp(-0.08 * dist * dist)));
  ALL_HOURS.push({ hour: h, val });
}

// ─── SVG Area Chart ────────────────────────────────────────────────────────────
const AreaChart = () => {
  const W = 480, H = 160, padL = 28, padR = 12, padT = 12, padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxVal = 9;

  const pts = AREA_CHART_DATA.map((d, i) => ({
    x: padL + (i / (AREA_CHART_DATA.length - 1)) * chartW,
    y: padT + chartH - (d.value / maxVal) * chartH
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${pts[pts.length-1].x},${padT+chartH} L${pts[0].x},${padT+chartH} Z`;

  const yTicks = [0, 3, 6, 9];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#dc2626" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Y grid lines */}
      {yTicks.map((t) => {
        const y = padT + chartH - (t / maxVal) * chartH;
        return (
          <g key={t}>
            <line x1={padL} y1={y} x2={padL + chartW} y2={y} stroke="#f3f4f6" strokeWidth="1" />
            <text x={padL - 4} y={y + 4} fontSize="9" fill="#9ca3af" textAnchor="end">{t}</text>
          </g>
        );
      })}
      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />
      {/* Line */}
      <path d={linePath} fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      {/* Dots */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#dc2626" stroke="#fff" strokeWidth="1.5" />
      ))}
      {/* X labels */}
      {AREA_CHART_DATA.map((d, i) => (
        <text
          key={i}
          x={padL + (i / (AREA_CHART_DATA.length - 1)) * chartW}
          y={H - 2}
          fontSize="9"
          fill="#9ca3af"
          textAnchor="middle"
        >
          {d.label}
        </text>
      ))}
    </svg>
  );
};

// ─── SVG Donut Chart ───────────────────────────────────────────────────────────
const DonutChart = () => {
  const cx = 80, cy = 80, R = 65, r = 44;
  const total = DONUT_DATA.reduce((s, d) => s + d.count, 0);
  let startAngle = -Math.PI / 2;

  const slices = DONUT_DATA.map((d) => {
    const angle = (d.count / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(startAngle);
    const y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(startAngle + angle);
    const y2 = cy + R * Math.sin(startAngle + angle);
    const x3 = cx + r * Math.cos(startAngle + angle);
    const y3 = cy + r * Math.sin(startAngle + angle);
    const x4 = cx + r * Math.cos(startAngle);
    const y4 = cy + r * Math.sin(startAngle);
    const large = angle > Math.PI ? 1 : 0;
    const path = `M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${x3},${y3} A${r},${r} 0 ${large},0 ${x4},${y4} Z`;
    startAngle += angle;
    return { ...d, path };
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ flexShrink: 0 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          {slices.map((s, i) => (
            <path key={i} d={s.path} fill={s.color} />
          ))}
          <circle cx={cx} cy={cy} r={r - 1} fill="white" />
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize="20" fontWeight="800" fill="#111827">{total}</text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="10" fill="#9ca3af">Laporan</text>
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', flex: 1 }}>
        {DONUT_DATA.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: d.color, flexShrink: 0 }} />
              <span style={{ fontSize: '11px', color: '#374151' }}>{d.label}</span>
            </div>
            <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', whiteSpace: 'nowrap' }}>
              {d.percent}% ({d.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Hourly Bar Chart ──────────────────────────────────────────────────────────
const HourlyBarChart = () => {
  const maxVal = Math.max(...ALL_HOURS.map((d) => d.val));
  const showLabels = [0, 3, 6, 9, 12, 15, 18, 21];
  const W = 400, H = 120, padB = 18;
  const barW = W / ALL_HOURS.length;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + padB}`} preserveAspectRatio="none" style={{ overflow: 'visible' }}>
      {/* Y axis ticks */}
      {[0, 5, 10, 15, 20, 25].map((t) => {
        const y = H - (t / (maxVal || 1)) * H;
        return (
          <g key={t}>
            <line x1={0} y1={y} x2={W} y2={y} stroke="#f3f4f6" strokeWidth="0.5" />
            <text x={-2} y={y + 4} fontSize="8" fill="#9ca3af" textAnchor="end">{t}</text>
          </g>
        );
      })}
      {/* Bars */}
      {ALL_HOURS.map((d, i) => {
        const bh = (d.val / (maxVal || 1)) * H;
        return (
          <rect
            key={i}
            x={i * barW + 1}
            y={H - bh}
            width={barW - 2}
            height={bh}
            fill="#dc2626"
            rx="2"
          />
        );
      })}
      {/* X labels */}
      {ALL_HOURS.map((d, i) => {
        const label = `${String(d.hour).padStart(2,'0')}:00`;
        if (!showLabels.includes(d.hour)) return null;
        return (
          <text
            key={i}
            x={i * barW + barW / 2}
            y={H + padB - 2}
            fontSize="8"
            fill="#9ca3af"
            textAnchor="middle"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const AdminAnalyticsPage = ({
  user,
  reports = [],
  notifications = [],
  onMarkAllNotificationsAsRead,
  onLogout
}) => {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const filters = ['Semua', 'Minggu Ini', 'Bulan Ini'];

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    border: '1px solid #e5e7eb',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
  };

  return (
    <AdminLayout
      title="Data Statistik"
      subtitle="Lihat statistik dan perkembangan laporan fasilitas kampus"
      user={user}
      notifications={notifications}
      onMarkAllNotificationsAsRead={onMarkAllNotificationsAsRead}
      onLogout={onLogout}
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

      {/* ── 3 Metric Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {/* Card 1 – Total (red gradient) */}
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
                Total Laporan Anda
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', lineHeight: 1 }}>24</div>
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
          {/* decorative circle */}
          <div style={{ position: 'absolute', bottom: '-18px', right: '-18px', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Card 2 – Menunggu Verifikasi */}
        <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '12.5px', color: '#6b7280', fontWeight: '500', marginBottom: '10px' }}>
                Menunggu Verifikasi
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>3</div>
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
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>8</div>
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

      {/* ── Middle Row: Area Chart + Donut ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* Grafik Laporan */}
        <div style={cardStyle}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
            Grafik Laporan
          </div>
          <AreaChart />
        </div>

        {/* Distribusi Status Laporan */}
        <div style={cardStyle}>
          <div style={{ marginBottom: '4px' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>
              Distribusi Status Laporan
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
              Persentase status dari seluruh laporan yang masuk
            </div>
          </div>
          <div style={{ marginTop: '12px' }}>
            <DonutChart />
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Location + Hourly ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Jumlah Laporan Berdasarkan Lokasi */}
        <div style={cardStyle}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>
            Jumlah Laporan Berdasarkan Lokasi
          </div>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '16px', marginTop: '2px' }}>
            Lokasi yang paling banyak dilaporkan
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {LOCATION_DATA.map((loc, i) => (
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
            ))}
          </div>
        </div>

        {/* Jam Ramai Laporan */}
        <div style={cardStyle}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>
            Jam Ramai Laporan
          </div>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '16px', marginTop: '2px' }}>
            Menunjukkan waktu dengan jumlah laporan yang paling banyak masuk
          </div>
          <HourlyBarChart />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalyticsPage;