import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { adminService } from '../../services';
import AnalyticsAreaChart from '../../components/analytics/AnalyticsAreaChart';
import AnalyticsDonutChart from '../../components/analytics/AnalyticsDonutChart';
import AnalyticsHourlyChart from '../../components/analytics/AnalyticsHourlyChart';

const AdminAnalyticsPage = ({
  user,
  reports = [],
  notifications = [],
  onMarkAllNotificationsAsRead,
  onMarkNotificationAsRead,
  onLogout,
  onUpdateAvatar,
  onToggleNotificationPreference
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

  // Data Area Chart Dinamis (Deret Harian Kontinu dari API & Fallback Reports)
  const areaChartData = useMemo(() => {
    const rawMap = {};

    // 1. Ambil data tren dari API stats jika tersedia
    if (stats?.chartData && Array.isArray(stats.chartData)) {
      stats.chartData.forEach((d) => {
        if (d && d.date) {
          rawMap[d.date] = Number(d.count) || 0;
        }
      });
    }

    // 2. Jika rawMap masih kosong tapi ada props reports, gunakan reports sebagai fallback
    if (Object.keys(rawMap).length === 0 && Array.isArray(reports) && reports.length > 0) {
      reports.forEach((r) => {
        if (r.createdAt) {
          const isoKey = new Date(r.createdAt).toISOString().slice(0, 10);
          rawMap[isoKey] = (rawMap[isoKey] || 0) + 1;
        }
      });
    }

    // Tentukan jumlah hari berdasarkan filter ('Bulan Ini' = 30 hari, 'Minggu Ini' & 'Semua' = 7 hari)
    const daysCount = activeFilter === 'Bulan Ini' ? 30 : 7;
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
        value: rawMap[isoKey] || 0
      });
    }

    return result;
  }, [stats, reports, activeFilter]);

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
      onToggleNotificationPreference={onToggleNotificationPreference}
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
          <AnalyticsAreaChart data={areaChartData} />
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
            <AnalyticsDonutChart data={donutData} />
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
          <AnalyticsHourlyChart data={hourlyData} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalyticsPage;