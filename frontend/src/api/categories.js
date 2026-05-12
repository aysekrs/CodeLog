import { apiClient } from './client';

export function kategorileriGetir() {
  return apiClient.get('/categories');
}
