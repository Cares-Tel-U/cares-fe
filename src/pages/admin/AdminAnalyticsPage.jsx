import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import MetricCards from '../../components/admin/MetricCards';
import ReportChart from '../../components/admin/ReportChart';
import LocationStatsCard from '../../components/admin/LocationStatsCard';

const AdminAnalyticsPage = ({
  user,
  reports = [],
  notifications = [],
  onMarkAllNotificationsAsRead,
  onLogout
}) => {
  return (
    <AdminLayout
      user={user}
      notifications={notifications}
      onMarkAllNotificationsAsRead={onMarkAllNotificationsAsRead}
      onLogout={onLogout}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Statistik</h1>
        <p className="text-xs text-gray-500">Visualisasi komprehensif data laporan dan performa penanganan kampus</p>
      </div>

      <MetricCards reports={reports} />

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2">
          <ReportChart />
        </div>
        <div>
          <LocationStatsCard />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalyticsPage;