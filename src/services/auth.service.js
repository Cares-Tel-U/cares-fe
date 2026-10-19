import { apiRequest, setAuthToken, setStoredUser, clearAuth } from './api';

export const authService = {
  // Login Civitas Akademika (Mahasiswa / Dosen / Tendik / Sarpras)
  async login(email, password, rememberMe = false) {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password, rememberMe },
    });

    if (res.data?.token) {
      setAuthToken(res.data.token);
      setStoredUser(res.data.user);
    }

    return res.data;
  },

  // Registrasi Akun Baru (Mahasiswa / Tendik / Dosen)
  async register(nama, email, password, role = 'MAHASISWA', nim = '') {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: {
        nama,
        email,
        password,
        role,
        nim: nim ? String(nim).trim() : undefined,
      },
    });
    return res.data;
  },

  // Mengambil Profil Pengguna yang Sedang Login
  async getProfile() {
    const res = await apiRequest('/users/me');
    if (res.data) {
      setStoredUser(res.data);
    }
    return res.data;
  },

  // Memperbarui Foto Profil Avatar Pengguna (mendukung File upload maupun URL string)
  async updateAvatar(avatarPayload) {
    let options = { method: 'PATCH' };

    if (typeof File !== 'undefined' && avatarPayload instanceof File) {
      const formData = new FormData();
      formData.append('avatar', avatarPayload);
      options.body = formData;
    } else {
      options.body = {
        avatarUrl: typeof avatarPayload === 'string' ? avatarPayload : avatarPayload?.avatarUrl || '',
      };
    }

    const res = await apiRequest('/users/avatar', options);
    if (res.data) {
      setStoredUser(res.data);
    }
    return res.data;
  },

  // Mengatur Preferensi Notifikasi Pengguna (Aktif / Nonaktif)
  async updateNotificationPreference(enabled) {
    const res = await apiRequest('/users/notification-preferences', {
      method: 'PATCH',
      body: { enabled: Boolean(enabled) },
    });
    if (res.data) {
      setStoredUser(res.data);
    }
    return res.data;
  },

  // Permintaan Pemulihan Kata Sandi (Forgot Password)
  async forgotPassword(email) {
    const res = await apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
    return res;
  },

  // Reset Kata Sandi Baru
  async resetPassword(token, newPassword) {
    const res = await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: { token, newPassword },
    });
    return res;
  },

  // Logout
  logout() {
    clearAuth();
  },
};
