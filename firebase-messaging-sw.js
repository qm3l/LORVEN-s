<<<<<<< HEAD
=======
const CACHE_NAME = 'lorven-v6';
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
    '/js/pages/dashboard.js',
    '/js/pages/customers.js',
    '/js/pages/invoices.js',
    '/js/pages/reports.js',
    '/js/pages/settings.js',
    '/manifest.json',
    '/img/logo.png',
    '/icons/icon-192.png'
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
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});

>>>>>>> a423071 (v2.2.0)
importScripts('https://www.gstatic.com/firebasejs/12.12.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.12.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCyPz0BM92T6fuiEnPRHUinR0IY1MNOP7s",
  authDomain: "lorven-sys.firebaseapp.com",
  projectId: "lorven-sys",
  storageBucket: "lorven-sys.firebasestorage.app",
  messagingSenderId: "634746871212",
  appId: "1:634746871212:web:a64826474f26fe48132e09"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
<<<<<<< HEAD
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
=======
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icons/icon-192.png'
  });
>>>>>>> a423071 (v2.2.0)
});
