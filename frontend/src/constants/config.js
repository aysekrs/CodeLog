/**
 * Geliştirme: `/api` — Vite proxy backend'e yönlendirir (aynı köken, CORS sorunu olmaz).
 * Üretim derlemesi: `VITE_API_BASE_URL` yoksa `http://localhost:8080/api` (yerel deneme).
 * Canlıda: derlemeden önce `VITE_API_BASE_URL=https://api.siteniz.com/api` ayarlayın.
 */
const ortamdan = import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL =
  ortamdan && ortamdan.length > 0
    ? ortamdan
    : import.meta.env.DEV
      ? '/api'
      : 'http://localhost:8080/api';
