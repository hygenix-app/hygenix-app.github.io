// NAIKKAN ANGKA INI SETIAP KALI ANDA UPDATE APLIKASI
const CACHE_NAME = 'hygenix-v5'; 
const urlsToCache = [
  './',
  './index.html',
  './login.html',
  './icon.png'
];

// 1. Install Service Worker & Paksa Langsung Aktif
self.addEventListener('install', event => {
  self.skipWaiting(); // Jangan tunggu tab lama ditutup, langsung install
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Hapus Cache Lama Saat Service Worker Baru Aktif
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Ambil kendali atas halaman
  );
});

// 3. Ambil Data (Network First, Fallback to Cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Simpan salinan terbaru ke cache
        let responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Jika offline, ambil dari cache
        return caches.match(event.request);
      })
  );
});
