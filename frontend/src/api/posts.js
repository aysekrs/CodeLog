import { apiClient } from './client';

export function yaziOlustur(yaziVerisi) {
  return apiClient.post('/posts', yaziVerisi);
}

export function yaziGuncelle(id, yaziVerisi) {
  return apiClient.put(`/posts/${id}`, yaziVerisi);
}

export function yazilarimiGetir() {
  return apiClient.get('/posts/mine');
}

export function tumYazilariGetir() {
  return apiClient.get('/posts/all');
}

export function yaziDetayGetir(id) {
  return apiClient.get(`/posts/${id}`);
}

export function yaziSil(id) {
  return apiClient.delete(`/posts/${id}`);
}
