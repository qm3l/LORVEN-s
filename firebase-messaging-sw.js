const CACHE_NAME = 'lorven-v8';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/all.min.css',
    '/js/main.js',
    '/js/core/state.js',
    '/js/core/i18n.js',
    '/js/core/data.js',
    '/js/core/helpers.js',
    '/js/core/ui.js',
    '/js/system/auth.js',
    '/js/system/backup.js',
    '/js/system/clearData.js',
    '/js/system/import.js',
    '/js/system/biometric.js',
    '/js/pages/dashboard.js',
    '/js/pages/customers.js',
    '/js/pages/invoices.js',
    '/js/pages/debts.js',
    '/js/pages/shipments.js',
    '/js/pages/suppliers.js',
    '/js/pages/reports.js',
    '/js/pages/settings.js',
    '/js/pages/notes.js',
    '/js/pages/loyalty.js',
    '/js/pages/invoiceHistory.js',
    '/js/pages/more.js',
    '/js/features/bundles.js',
    '/js/features/wishlist.js',
    '/js/features/notifications.js',
    '/js/features/search.js',
    '/js/features/export.js',
    '/js/lib/sql-wasm.js',
    '/js/lib/crypto-js.min.js',
    '/manifest.json',
    '/img/logo.png',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    '/sounds/success.wav',
    '/sounds/click.wav',
    '/sounds/delete.wav',
    '/sounds/notification.wav'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        urlsToCache.map(url => cache.add(url).catch(() => {}))
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
