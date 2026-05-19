import { API_BASE_URL } from '../constants/config';

/** Blog API'si `accessToken`; eski sayfalar `token` kullanabiliyor. */
function tokenAl() {
  return localStorage.getItem('accessToken') || localStorage.getItem('token');
}

function apidenHataMetni(sonuc) {
  if (!sonuc || typeof sonuc !== 'object') {
    return '';
  }
  const m = sonuc.message ?? sonuc.Message;
  if (typeof m === 'string' && m.trim()) {
    return m.trim();
  }
  const e = sonuc.error ?? sonuc.Error;
  if (typeof e === 'string' && e.trim()) {
    return e.trim();
  }
  const detay = sonuc.data ?? sonuc.Data;
  if (detay && typeof detay === 'object' && !Array.isArray(detay)) {
    const ilk = Object.values(detay).find((v) => typeof v === 'string' && v.trim());
    if (ilk) {
      return String(ilk).trim();
    }
  }
  return '';
}

function httpDurumMetni(status) {
  const harita = {
    400: 'Geçersiz istek.',
    401: 'Oturum doğrulanamadı. Giriş yapın veya erişim anahtarınızı kontrol edin.',
    403: 'Bu işlem için yetkiniz yok.',
    404: 'İstenen kaynak bulunamadı.',
    409: 'Kayıt çakışması.',
    422: 'Gönderilen veriler doğrulanamadı.',
    429: 'Çok fazla istek gönderildi.',
    500: 'Sunucu hatası.',
    502: 'Ara sunucu hatası (bad gateway).',
    503: 'Sunucu geçici olarak kullanılamıyor.'
  };
  return harita[status] || `Sunucu yanıt kodu: ${status}`;
}

async function istekAt(path, options = {}) {
  const token = tokenAl();
  let cevap;
  try {
    cevap = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      },
      ...options
    });
  } catch (agHata) {
    if (agHata instanceof TypeError) {
      throw new Error(
        'Sunucuya bağlanılamadı. Backend çalışıyor mu ve adres doğru mu kontrol edin.'
      );
    }
    throw agHata;
  }

  const hamMetin = await cevap.text();
  let sonuc = null;
  if (hamMetin) {
    try {
      sonuc = JSON.parse(hamMetin);
    } catch {
      sonuc = null;
    }
  }

  const sunucuMesaji = apidenHataMetni(sonuc);

  if (!cevap.ok) {
    throw new Error(sunucuMesaji || httpDurumMetni(cevap.status));
  }

  if (sonuc && sonuc.success === false) {
    throw new Error(sunucuMesaji || httpDurumMetni(cevap.status));
  }

  if (sonuc == null || hamMetin === '') {
    return null;
  }

  return sonuc.data;
}

export const apiClient = {
  get: (path) => istekAt(path),
  post: (path, body) => istekAt(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => istekAt(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => istekAt(path, { method: 'DELETE' })
};
