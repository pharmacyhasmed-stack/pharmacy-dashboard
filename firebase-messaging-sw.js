importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAqYKrGCKupCxfH5w4vIpEYnhYyb0azSmw",
    authDomain: "pharmacy-monitor-2307f.firebaseapp.com",
    projectId: "pharmacy-monitor-2307f",
    storageBucket: "pharmacy-monitor-2307f.firebasestorage.app",
    messagingSenderId: "525242127430",
    appId: "1:525242127430:web:c258994af86e35b0456647"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
    console.log('[SW] Background message:', payload);
    
    const title = payload.notification?.title || '🚨 Temperature Alert!';
    const options = {
        body: payload.notification?.body || 'Check your pharmacy temperatures',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200],
        tag: 'pharmacy-alert',
        requireInteraction: true,
        data: payload.data
    };
    
    return self.registration.showNotification(title, options);
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('https://pharmacy-dashboard-git-main-hasmeds-projects.vercel.app')
    );
});
