import { API_BASE_URL } from '../constants/config';

function tokenAl() {
  return localStorage.getItem('accessToken');
}

async function istekAt(path, options = {}) {
  const token = tokenAl();
  const cevap = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const sonuc = await cevap.json().catch(() => null);

  if (!cevap.ok || !sonuc?.success) {
    throw new Error(sonuc?.message || 'Istek sirasinda bir sorun oldu.');
  }

  return sonuc.data;
}

export const apiClient = {
  get: (path) => istekAt(path),
  post: (path, body) => istekAt(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => istekAt(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => istekAt(path, { method: 'DELETE' })
};
