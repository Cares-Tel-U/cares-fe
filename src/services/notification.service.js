import { apiRequest } from './api';

export function transformNotification(n) {
  if (!n) return null;
  const createdAt = new Date(n.createdAt || Date.now());
  const now = new Date();
  const isToday = createdAt.toDateString() === now.toDateString();
  const timeStr = `${String(createdAt.getHours()).padStart(2, '0')}:${String(createdAt.getMinutes()).padStart(2, '0')} WIB`;

  let title = 'Pembaruan Laporan';
  const pesan = n.pesan || '';
  if (pesan.includes('DIPROSES') || pesan.includes('diproses')) {
    title = 'Laporan Sedang Diproses';
  } else if (pesan.includes('SELESAI') || pesan.includes('selesai')) {
    title = 'Laporan Telah Selesai';
  } else if (pesan.includes('DITOLAK') || pesan.includes('ditolak')) {
    title = 'Laporan Ditolak';
  } else if (pesan.includes('berhasil dikirim') || pesan.includes('menunggu verifikasi')) {
    title = 'Laporan Menunggu Verifikasi';
  }

  return {
    ...n,
    id: n.id,
    category: isToday ? 'Hari ini' : 'Sebelumnya',
    title,
    time: isToday ? timeStr : createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    desc: pesan,
    isUnread: !n.isRead,
  };
}

export const notificationService = {
  // Mengambil Daftar Notifikasi Pengguna
  async getNotifications() {
    const res = await apiRequest('/notifications');
    const items = (res.data || []).map(transformNotification);
    return items;
  },

  // Menandai Satu Notifikasi Telah Dibaca
  async markAsRead(id) {
    const res = await apiRequest(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
    return transformNotification(res.data);
  },

  // Menandai Seluruh Notifikasi Telah Dibaca
  async markAllAsRead() {
    const res = await apiRequest('/notifications/read-all', {
      method: 'PATCH',
      body: {},
    });
    return res.data;
  },
};
