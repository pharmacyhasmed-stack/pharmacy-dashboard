// Hasmed Pharmacy Monitor - Service Worker

self.addEventListener('install', (e) => {
  console.log('[SW] Installing...');
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  console.log('[SW] Activated');
  e.waitUntil(clients.claim());
});

// Handle push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  let data = {
    title: '🚨 Pharmacy Alert',
    body: 'Check temperatures immediately!',
    icon: '/icon-192.png',
    badge: '/icon-192.png'
  };
  
  try {
    if (event.data) {
      const json = event.data.json();
      data = { ...data, ...json };
    }
  } catch (e) {
    if (event.data) {
      data.body = event.data.text();
    }
  }
  
  const options = {
    body: data.body,
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-192.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: 'pharmacy-alert-' + Date.now(),
    requireInteraction: true,
    actions: [
      { action: 'open', title: '📊 Open Dashboard' },
      { action: 'ack', title: '✓ Acknowledge' }
    ],
    data: data
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);
  event.notification.close();
  
  const urlToOpen = event.action === 'ack' 
    ? '/?acknowledge=true' 
    : '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Focus if already open
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin)) {
            client.focus();
            if (event.action === 'ack') {
              client.postMessage({ action: 'acknowledge' });
            }
            return;
          }
        }
        // Otherwise open new window
        return clients.openWindow(urlToOpen);
      })
  );
});

// Handle messages from main page
self.addEventListener('message', (event) => {
  console.log('[SW] Message:', event.data);
});
