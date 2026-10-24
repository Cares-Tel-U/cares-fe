export const API_BASE_URL = (() => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1';
  const trimmed = envUrl.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api/v1') ? trimmed : `${trimmed}/api/v1`;
})();
export const BACKEND_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

/**
 * Mengubah path media relatif (seperti /uploads/...) menjadi URL lengkap backend
 * Mendukung data URL, blob URL, dan URL absolut secara transparan.
 */
export const resolveMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${BACKEND_URL}${cleanPath}`;
};

export const getAuthToken = () => {
  return localStorage.getItem('cares_token');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('cares_token', token);
  } else {
    localStorage.removeItem('cares_token');
  }
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('cares_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem('cares_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('cares_user');
  }
};

export const clearAuth = () => {
  localStorage.removeItem('cares_token');
  localStorage.removeItem('cares_user');
};

/**
 * Helper terpadu untuk melakukan HTTP Request ke CARES Backend API
 * Mendukung otorisasi Bearer Token otomatis dan penanganan form-data maupun JSON.
 */
export async function apiRequest(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData && options.body && typeof options.body === 'object') {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(url, config);
  const contentType = response.headers.get('content-type') || '';
  let responseData = null;

  if (contentType.includes('application/json')) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      (responseData && typeof responseData === 'object' && responseData.message) ||
      (typeof responseData === 'string' && responseData) ||
      `Permintaan gagal dengan status ${response.status}`;

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = responseData;
    throw error;
  }

  return responseData;
}
