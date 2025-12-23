const CACHE_NAME = `bookinga-cache-${Date.now()}`;
const STATIC_CACHE = 'bookinga-static-v2';

self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            return cache.addAll(['/', '/index.html', '/manifest.json', '/vite.svg', '/android/android-launchericon-192-192.png', '/android/android-launchericon-512-512.png']);
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        Promise.all([
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName.startsWith('bookinga-cache-')) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            self.clients.claim()
        ])
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }
            return fetch(event.request).then((response) => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(STATIC_CACHE).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return response;
            });
        })
    );
});

self.addEventListener('push', (event) => {
    console.log('Push event received in general SW:', event);

    if (event.data) {
        try {
            const data = event.data.json();

            if (data.notification || data.data) {
                console.log('FCM message detected, skipping in general SW');
                return;
            }
        } catch (e) { }
    }

    const options = {
        body: event.data ? event.data.text() : 'New notification',
        icon: '/android/android-launchericon-192-192.png',
        badge: '/android/android-launchericon-96-96.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: Math.random(),
        },
        actions: [
            {
                action: 'view',
                title: 'View',
                icon: '/android/android-launchericon-48-48.png',
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/android/android-launchericon-48-48.png',
            },
        ],
    };

    event.waitUntil(self.registration.showNotification('Bookinga', options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(self.clients.openWindow('/'));
    }
});
