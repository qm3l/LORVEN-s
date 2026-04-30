const CACHE_NAME = 'lorven-cache-v3';
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/core/state.js',
  './js/core/data.js',
  './js/core/i18n.js',
  './js/core/helpers.js',
  './js/core/ui.js',
  './js/pages/dashboard.js',
  './js/pages/customers.js',
  './js/pages/invoices.js',
  './js/pages/invoiceHistory.js',
  './js/pages/shipments.js',
  './js/pages/suppliers.js',
  './js/pages/reports.js',
  './js/pages/settings.js',
  './js/pages/notes.js',
  './js/pages/debts.js',
  './js/pages/loyalty.js',
  './js/pages/more.js',
  './js/features/bundles.js',
  './js/features/notifications.js',
  './js/features/search.js',
  './js/features/export.js',
  './js/features/wishlist.js',
  './js/system/auth.js',
  './js/system/sound.js',
  './js/system/import.js',
  './js/system/backup.js',
  './js/system/clearData.js',
  './js/main.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
