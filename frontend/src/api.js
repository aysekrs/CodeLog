import { API_BASE_URL } from './constants/config';

const axiosSunucuKoku =
  typeof API_BASE_URL === 'string' && API_BASE_URL.startsWith('http')
    ? new URL(API_BASE_URL).origin
    : '';

// Not: Bu dosya artık kullanılmıyor; tüm API istekleri api/client.js üzerinden yapılıyor.
// Geriye dönük uyumluluk için burada bırakılmıştır.

export default {};
