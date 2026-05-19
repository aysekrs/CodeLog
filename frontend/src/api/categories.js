import { apiClient } from './client';

/**
 * Kategori listesini döner; beklenmeyen gövde şeklinde boş dizi verir.
 */
export async function kategorileriGetir() {
  const veri = await apiClient.get('/categories');
  return Array.isArray(veri) ? veri : [];
}
