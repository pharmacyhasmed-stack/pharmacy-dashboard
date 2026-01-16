/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAqYKrGCKupCxfH5w4vIpEYnhYyb0azSmw",
  authDomain: "pharmacy-monitor-2307f.firebaseapp.com",
  projectId: "pharmacy-monitor-2307f",
  storageBucket: "pharmacy-monitor-2307f.firebasestorage.app",
  messagingSenderId: "525242127430",
  appId: "1:525242127430:web:c258994af86e35b0456647"
});

const messaging = firebase.messaging();

// Background push handler
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || "🚨 Temperature Alert";
  const body = (payload.notification && payload.notification.body) || "Check temperatures";

  self.registration.showNotification(title, {
    body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: "pharmacy-alert",
    requireInteraction: true
  });
});

// Click opens app
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
