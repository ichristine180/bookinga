
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCQjcPEa4JMNobLBeSc_k-DCc3UVu6hkio",
  authDomain: "salon-booking-platform.firebaseapp.com",
  projectId: "salon-booking-platform",
  storageBucket: "salon-booking-platform.firebasestorage.app",
  messagingSenderId: "317211551908",
  appId: "1:317211551908:web:198a06143422b66ab29e31"
};


firebase.initializeApp(firebaseConfig);


const messaging = firebase.messaging();


const recentNotifications = new Map();
const NOTIFICATION_COOLDOWN = 30000;

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  console.log('[firebase-messaging-sw.js] App visibility state:', document?.visibilityState || 'unknown');


  if (!payload || !payload.notification || !payload.notification.title || !payload.notification.body) {
    console.log('[firebase-messaging-sw.js] Invalid payload - missing required fields:', payload);
    return;
  }

  const notificationTitle = payload.notification.title;
  const notificationKey = `${payload.data?.type || 'general'}_${payload.data?.relatedId || 'default'}`;
  const now = Date.now();

  console.log('[firebase-messaging-sw.js] Notification key:', notificationKey);
  console.log('[firebase-messaging-sw.js] Recent notifications map size:', recentNotifications.size);

  if (recentNotifications.has(notificationKey)) {
    const lastNotification = recentNotifications.get(notificationKey);
    const timeDiff = now - lastNotification;
    console.log('[firebase-messaging-sw.js] Time since last notification:', timeDiff, 'ms');
    if (timeDiff < NOTIFICATION_COOLDOWN) {
      console.log('[firebase-messaging-sw.js] Duplicate notification prevented:', notificationKey);
      return;
    }
  }

  recentNotifications.set(notificationKey, now);
  console.log('[firebase-messaging-sw.js] Showing notification:', notificationTitle);

  setTimeout(() => {
    recentNotifications.delete(notificationKey);
    console.log('[firebase-messaging-sw.js] Cleaned up notification key:', notificationKey);
  }, NOTIFICATION_COOLDOWN);

  const notificationOptions = {
    body: payload.notification.body,
    icon: '/android/android-launchericon-192-192.png',
    badge: '/android/android-launchericon-96-96.png',
    image: payload.notification.image,
    data: payload.data,
    tag: payload.data?.type || 'general',
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/android/android-launchericon-48-48.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/android/android-launchericon-48-48.png'
      }
    ],
    requireInteraction: true,
    silent: false,
    timestamp: now
  };


  if (payload.data?.badgeCount) {
    notificationOptions.badge = `/android/android-launchericon-96-96.png`;

    if ('setAppBadge' in navigator) {
      navigator.setAppBadge(parseInt(payload.data.badgeCount));
    }
  }

  console.log('[firebase-messaging-sw.js] About to show notification with options:', notificationOptions);
  return self.registration.showNotification(notificationTitle, notificationOptions);
});


self.addEventListener('notificationclick', function (event) {
  console.log('[Service Worker] Notification click received.');

  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }


  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function (clientList) {

      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }


      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});






self.addEventListener('notificationclose', function (event) {
  console.log('[Service Worker] Notification closed.');





});


self.addEventListener('sync', function (event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncNotifications());
  }
});

async function syncNotifications() {
  try {

    console.log('[Service Worker] Background sync triggered');




  } catch (error) {
    console.error('[Service Worker] Background sync failed:', error);
  }
}