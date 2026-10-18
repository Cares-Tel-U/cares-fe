import { apiRequest } from './api';

export const facilityService = {
  // Mengambil Seluruh Master Data Fasilitas Kampus
  async getFacilities() {
    const res = await apiRequest('/facilities');
    return res.data || [];
  },

  // Menambahkan Master Fasilitas Baru (Khusus Admin / Sarpras)
  async createFacility({ nama, lokasi, kategori }) {
    const res = await apiRequest('/facilities', {
      method: 'POST',
      body: { nama, lokasi, kategori },
    });
    return res.data;
  },
};
