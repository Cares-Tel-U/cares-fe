import { apiRequest } from './api';

export function mapBackendStatusToFrontend(status) {
  switch (status) {
    case 'PENDING': return 'Menunggu Verifikasi';
    case 'DIPROSES': return 'Diproses';
    case 'SELESAI': return 'Selesai';
    case 'DITOLAK': return 'Ditolak';
    default: return status || 'Menunggu Verifikasi';
  }
}

export function mapFrontendStatusToBackend(status) {
  switch (status) {
    case 'Menunggu Verifikasi': return 'PENDING';
    case 'Diproses': return 'DIPROSES';
    case 'Selesai': return 'SELESAI';
    case 'Ditolak': return 'DITOLAK';
    default: return status?.toUpperCase() || 'PENDING';
  }
}

export function transformReport(r) {
  if (!r) return null;
  const createdAt = new Date(r.createdAt || Date.now());
  const formattedDate = `${String(createdAt.getDate()).padStart(2, '0')}/${String(createdAt.getMonth() + 1).padStart(2, '0')}/${createdAt.getFullYear()}`;
  const photos = r.photos ? r.photos.map((p) => (typeof p === 'string' ? p : p.url)) : (r.foto || []);

  const frontendStatus = mapBackendStatusToFrontend(r.status);

  return {
    ...r,
    id: r.id,
    nomor: r.nomor || 1,
    judul: r.judul || 'Laporan Kerusakan',
    lokasi: r.facility ? `${r.facility.nama} (${r.facility.lokasi})` : (r.lokasi || '-'),
    namaGedung: r.facility ? r.facility.lokasi : (r.namaGedung || '-'),
    namaRuangan: r.facility ? r.facility.nama : (r.namaRuangan || '-'),
    deskripsi: r.deskripsi || '',
    status: frontendStatus,
    rawStatus: r.status,
    tanggal: formattedDate,
    createdAt: r.createdAt,
    isAnonim: Boolean(r.isAnonymous ?? r.isAnonim),
    foto: photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80'],
    reporterId: r.userId || r.reporterId,
    pelapor: r.user ? r.user.nama : (r.pelapor || (r.isAnonymous ? 'Anonim' : 'Civitas Akademika')),
    rejectReason: r.rejectionReason || r.rejectReason || '',
    timeline: [
      {
        step: 'Laporan terkirim',
        date: `${createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}, ${String(createdAt.getHours()).padStart(2, '0')}:${String(createdAt.getMinutes()).padStart(2, '0')} WIB`,
        completed: true,
        current: r.status === 'PENDING',
      },
      {
        step: 'Laporan berhasil diverifikasi',
        date: r.status !== 'PENDING' && r.status !== 'DITOLAK' ? 'Diverifikasi Sarpras' : '-',
        completed: r.status === 'DIPROSES' || r.status === 'SELESAI',
        current: r.status === 'DIPROSES',
      },
      {
        step: 'Laporan dalam proses',
        date: r.status === 'DIPROSES' || r.status === 'SELESAI' ? 'Dalam Pengerjaan' : '-',
        completed: r.status === 'DIPROSES' || r.status === 'SELESAI',
        current: r.status === 'DIPROSES',
      },
      {
        step: 'Laporan selesai',
        date: r.status === 'SELESAI' ? 'Pekerjaan Selesai' : (r.status === 'DITOLAK' ? 'Laporan Ditolak' : '-'),
        completed: r.status === 'SELESAI',
        current: r.status === 'SELESAI' || r.status === 'DITOLAK',
      },
    ],
  };
}

export const reportService = {
  // Mengambil Seluruh Feed Laporan Publik Kampus
  async getPublicReports(params = {}) {
    const query = new URLSearchParams();
    if (params.status) query.append('status', mapFrontendStatusToBackend(params.status));
    if (params.facilityId) query.append('facilityId', params.facilityId);
    if (params.page) query.append('page', params.page);
    if (params.per_page) query.append('per_page', params.per_page);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await apiRequest(`/reports${queryString}`);
    const items = (res.data || []).map(transformReport);
    return { ...res, data: items };
  },

  // Mengambil Riwayat Laporan Milik Pengguna yang Sedang Login
  async getMyReports(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'Semua Status') {
      query.append('status', mapFrontendStatusToBackend(params.status));
    }
    if (params.page) query.append('page', params.page);
    if (params.per_page) query.append('per_page', params.per_page);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await apiRequest(`/reports/my-reports${queryString}`);
    const items = (res.data || []).map(transformReport);
    return { ...res, data: items };
  },

  // Mengambil Rincian Detail Satu Laporan Spesifik
  async getReportById(id) {
    const res = await apiRequest(`/reports/${id}`);
    return transformReport(res.data);
  },

  // Membuat Laporan Kerusakan Baru (Mendukung upload File foto dan JSON)
  async createReport({ judul, deskripsi, facilityId, isAnonymous, photos }) {
    const hasPhysicalFiles = Array.isArray(photos) && photos.some((p) => typeof File !== 'undefined' && p instanceof File);

    if (hasPhysicalFiles) {
      const formData = new FormData();
      formData.append('judul', judul);
      formData.append('deskripsi', deskripsi);
      formData.append('facilityId', facilityId);
      formData.append('isAnonymous', String(Boolean(isAnonymous)));

      photos.forEach((photo) => {
        if (typeof File !== 'undefined' && photo instanceof File) {
          formData.append('photos', photo);
        } else if (typeof photo === 'string') {
          formData.append('photos', photo);
        }
      });

      const res = await apiRequest('/reports', {
        method: 'POST',
        body: formData,
      });
      return transformReport(res.data);
    }

    const res = await apiRequest('/reports', {
      method: 'POST',
      body: {
        judul,
        deskripsi,
        facilityId,
        isAnonymous: Boolean(isAnonymous),
        photos: Array.isArray(photos) ? photos : [],
      },
    });
    return transformReport(res.data);
  },
};

