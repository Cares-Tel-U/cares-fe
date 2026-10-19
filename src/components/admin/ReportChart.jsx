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

  const { path, dates, maxVal } = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return { path: '', dates: [], maxVal: 4 };
    }

    const datesFormatted = chartData.map((d) => {
      const parts = d.date.split('-');
      return parts.length === 3 ? `${parseInt(parts[2], 10)}/${parseInt(parts[1], 10)}` : d.date;
    });

    const counts = chartData.map((d) => d.count);
    const highest = Math.max(...counts, 4);

    const W = 420;
    const H = 150;
    const padY = 15;
    const effH = H - padY * 2;

    const points = chartData.map((d, idx) => {
      const x = chartData.length > 1 ? (idx / (chartData.length - 1)) * W : W / 2;
      const y = H - padY - (d.count / highest) * effH;
      return `${Math.round(x)} ${Math.round(y)}`;
    });

    const svgPath = points.length > 0 ? `M${points.join(' L')}` : '';

    return { path: svgPath, dates: datesFormatted, maxVal: highest };
  }, [chartData]);

  const yTicks = [maxVal, Math.round((maxVal * 2) / 3), Math.round(maxVal / 3), 0];

  return (
    <section style={{ height: '100%', minHeight: '342px', boxSizing: 'border-box', background: '#fff', border: '1px solid #d7d7d7', borderRadius: '8px', padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#303038' }}>Grafik Laporan</h3>
        <div style={{ display: 'flex', border: '1px solid #d8d8d8', borderRadius: '16px', padding: '1px', fontSize: '9px' }}>
          {['Mingguan', 'Bulanan'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              style={{
                minWidth: '67px',
                padding: '5px 10px',
                border: 0,
                borderRadius: '14px',
                color: filter === option ? '#fff' : '#c1c1c1',
                background: filter === option ? '#d91f2c' : 'transparent',
                fontSize: '9px',
                cursor: 'pointer'
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div style={{ height: '260px', display: 'grid', gridTemplateColumns: '17px 1fr', gridTemplateRows: '1fr 18px', color: '#65666c', fontSize: '8px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '7px 0 17px' }}>
          {yTicks.map((t, idx) => (
            <span key={idx}>{t}</span>
          ))}
        </div>

        {chartData.length > 0 && path ? (
          <svg viewBox="0 0 420 150" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }} aria-label="Grafik jumlah laporan">
            <defs>
              <linearGradient id="adminReportFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#df3541" stopOpacity=".65" />
                <stop offset="100%" stopColor="#f6d5d7" stopOpacity=".15" />
              </linearGradient>
            </defs>
            {[0, 50, 100, 150].map((line) => (
              <line key={line} x1="0" x2="420" y1={line} y2={line} stroke="#ededed" strokeWidth=".6" />
            ))}
            <path d={`${path} L420 150 L0 150 Z`} fill="url(#adminReportFill)" />
            <path d={path} fill="none" stroke="#c81d27" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          </svg>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af', fontSize: '11px' }}>
            {isLoading ? 'Memuat grafik tren...' : 'Belum ada tren laporan pada periode ini'}
          </div>
        )}

        <div />
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #9a9a9a', paddingTop: '4px', whiteSpace: 'nowrap' }}>
          {dates.map((date, idx) => (
            <span key={idx}>{date}</span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReportChart;
