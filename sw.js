const CACHE_NAME = 'lorven-cache-v4';

const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/css/all.min.css',
  '/webfonts/fa-solid-900.woff2',
  '/webfonts/fa-brands-400.woff2',
  '/webfonts/fa-regular-400.woff2',
  '/js/core/state.js',
  '/js/core/data.js',
  '/js/core/i18n.js',
  '/js/core/helpers.js',
  '/js/core/ui.js',
  '/js/system/auth.js',
  '/js/system/import.js',
  '/js/system/backup.js',
  '/js/system/clearData.js',
  '/js/system/sound.js',
  '/js/pages/dashboard.js',
  '/js/pages/customers.js',
  '/js/pages/invoices.js',
  '/js/pages/reports.js',
  '/js/pages/settings.js',
  '/js/pages/shipments.js',
  '/js/pages/suppliers.js',
  '/js/main.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-180.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) return cachedResponse;
        return new Response('', { status: 408, statusText: 'Network Error' });
      })
  );
});
