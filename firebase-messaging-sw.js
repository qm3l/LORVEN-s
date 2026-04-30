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
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icons/icon-192.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
