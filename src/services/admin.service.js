import { apiRequest } from './api';
import { transformReport, mapFrontendStatusToBackend } from './report.service';

export const adminService = {
  // Mengambil Antrean Seluruh Laporan untuk Petugas Sarpras
  async getAdminReports(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'Semua') {
      query.append('status', mapFrontendStatusToBackend(params.status));
    }
    if (params.page) query.append('page', params.page);
    if (params.per_page) query.append('per_page', params.per_page);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await apiRequest(`/admin/reports${queryString}`);
    const items = (res.data || []).map(transformReport);
    return { ...res, data: items };
  },

  // Memperbarui Status Laporan Tunggal (DIPROSES, SELESAI, DITOLAK)
  async updateReportStatus(id, { status, rejectionReason, catatan, completionPhotos, proofImages }) {
    const rawProofs = completionPhotos || proofImages;
    const hasPhysicalFiles =
      Array.isArray(rawProofs) &&
      rawProofs.some((p) => typeof File !== 'undefined' && p instanceof File);

    if (hasPhysicalFiles) {
      const formData = new FormData();
      formData.append('status', status);
      if (rejectionReason) formData.append('rejectionReason', rejectionReason);
      if (catatan) formData.append('catatan', catatan);

      rawProofs.forEach((photo) => {
        if (typeof File !== 'undefined' && photo instanceof File) {
          formData.append('completionPhotos', photo);
        } else if (typeof photo === 'string') {
          formData.append('completionPhotos', photo);
        }
      });

      const res = await apiRequest(`/admin/reports/${id}/status`, {
        method: 'PATCH',
        body: formData,
      });
      return res.data;
    }

    const res = await apiRequest(`/admin/reports/${id}/status`, {
      method: 'PATCH',
      body: {
        status,
        ...(rejectionReason && { rejectionReason }),
        ...(catatan && { catatan }),
        ...(rawProofs && { completionPhotos: rawProofs }),
      },
    });
    return res.data;
  },

  // Memperbarui Status Banyak Laporan Sekaligus (Bulk Status Update - TC26)
  async updateBulkReportStatus(reportIds, status, options = {}) {
    const res = await apiRequest('/admin/reports/bulk-status', {
      method: 'PATCH',
      body: {
        reportIds: Array.isArray(reportIds) ? reportIds : [reportIds],
        status,
        ...(options.rejectionReason && { rejectionReason: options.rejectionReason }),
        ...(options.catatan && { catatan: options.catatan }),
      },
    });
    return res.data;
  },

  // Mengambil Metrik Ringkasan & Grafik Tren Statistik Dashboard Admin
  async getAdminStats(timeframe = 'weekly') {
    const res = await apiRequest(`/admin/stats?timeframe=${timeframe}`);
    return res.data;
  },
};
