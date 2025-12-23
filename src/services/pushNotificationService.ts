import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import { doc, updateDoc, collection, addDoc, getDoc } from 'firebase/firestore';
import app, { db } from '@/config/firebase';

let messaging: any = null;
let messagingSupported = false;

const initializeMessaging = async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      messaging = getMessaging(app);
      messagingSupported = true;
      console.log('Firebase Messaging is supported');
    } else {
      console.log('Firebase Messaging is not supported in this browser');
    }
  } catch (error) {
    console.log('Error checking Firebase Messaging support:', error);
    messagingSupported = false;
  }
};

initializeMessaging();

const VAPID_KEY = import.meta.env.VITE_KEY_PAIR;
console.log('VAPID Key loaded:', VAPID_KEY ? 'Yes' : 'No');

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  image?: string;
  data?: Record<string, any>;
  tag?: string;
  url?: string;
  badgeCount?: number;
}

class PushNotificationService {
  private static instance: PushNotificationService;

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  async requestPermission(): Promise<string | null> {
    try {
      if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return null;
      }

      const permission = await Notification.requestPermission();

      if (permission === 'granted') {
        console.log('Notification permission granted.');

        if (messagingSupported && messaging && VAPID_KEY) {
          try {
            const token = await getToken(messaging, {
              vapidKey: VAPID_KEY,
            });

            if (token) {
              console.log('FCM Token:', token);
              return token;
            }
          } catch (fcmError) {
            console.log('FCM not available, using basic notifications:', fcmError);
          }
        } else {
          console.log('FCM not supported, using basic notifications only');
        }

        new Notification('Notifications Enabled', {
          body: "You'll now receive booking notifications!",
          icon: '/android/android-launchericon-192-192.png',
          tag: 'permission-granted',
        });

        return 'basic-notifications-enabled';
      } else {
        console.log('Unable to get permission to notify.');
      }

      return null;
    } catch (error) {
      console.error('An error occurred while requesting permission:', error);
      return null;
    }
  }

  async storeFCMToken(userId: string, token: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);

      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      const fcmTokens = userData?.fcmTokens || [];

      const updatedTokens = fcmTokens.filter((t: string) => t !== token);
      updatedTokens.push(token);

      await updateDoc(userRef, {
        fcmTokens: updatedTokens,
        lastTokenUpdate: new Date(),
      });

      console.log('FCM token stored successfully for user:', userId);
      console.log('Total FCM tokens for user:', updatedTokens.length);
      console.log('Latest token:', token.substring(0, 20) + '...');
    } catch (error) {
      console.error('Error storing FCM token:', error);
    }
  }

  async sendNotificationToUser(userId: string, payload: PushNotificationPayload): Promise<void> {
    try {
      const deduplicationId = `${userId}_${payload.tag}_${payload.data?.relatedId || 'general'}`;

      console.log('Sending push notification:', {
        userId,
        title: payload.title,
        body: payload.body,
        deduplicationId,
      });

      const docRef = await addDoc(collection(db, 'pushNotifications'), {
        userId,
        payload,
        status: 'pending',
        createdAt: new Date(),
        type: 'user_notification',
        deduplicationId,
      });

      console.log('Push notification queued with ID:', docRef.id, 'for user:', userId);
    } catch (error) {
      console.error('Error queuing push notification:', error);
    }
  }

  async sendNotificationToUsers(userIds: string[], payload: PushNotificationPayload): Promise<void> {
    try {
      const bulkId = `bulk_${Date.now()}`;
      const promises = userIds.map((userId) => {
        const deduplicationId = `${userId}_${payload.tag}_${payload.data?.relatedId || 'general'}_${bulkId}`;

        return addDoc(collection(db, 'pushNotifications'), {
          userId,
          payload,
          status: 'pending',
          createdAt: new Date(),
          type: 'bulk_notification',
          bulkId,
          deduplicationId,
        });
      });

      await Promise.all(promises);
      console.log('Push notifications queued for users:', userIds.length);
    } catch (error) {
      console.error('Error queuing bulk push notifications:', error);
    }
  }

  async updateBadgeCount(count: number): Promise<void> {
    try {
      if ('setAppBadge' in navigator) {
        await (navigator as any).setAppBadge(count);
      } else if ('clearAppBadge' in navigator && count === 0) {
        await (navigator as any).clearAppBadge();
      }
    } catch (error) {
      console.error('Error updating badge count:', error);
    }
  }

  async clearBadge(): Promise<void> {
    try {
      if ('clearAppBadge' in navigator) {
        await (navigator as any).clearAppBadge();
      }
    } catch (error) {
      console.error('Error clearing badge:', error);
    }
  }

  setupForegroundMessageListener(callback: (payload: any) => void): () => void {
    if (!messagingSupported || !messaging) {
      console.log('FCM foreground listener not available, using basic notifications only');
      return () => { };
    }

    try {
      return onMessage(messaging, (payload) => {
        console.log('Message received in foreground:', payload);

        if (!payload?.notification?.title || !payload?.notification?.body) {
          console.log('Invalid foreground payload - missing required fields:', payload);
          return;
        }

        if (Notification.permission === 'granted') {
          const notification = new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: '/android/android-launchericon-192-192.png',
            badge: '/android/android-launchericon-96-96.png',
            data: payload.data,
            tag: payload.data?.type || 'general',
            requireInteraction: true,
          });

          notification.onclick = () => {
            notification.close();
            window.focus();
            callback(payload);
          };
        }

        callback(payload);
      });
    } catch (error) {
      console.error('Error setting up foreground message listener:', error);
      return () => { };
    }
  }

  async registerServiceWorker(): Promise<void> {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          if (registration.scope.includes('sw.js')) {
            console.log('Unregistering conflicting service worker:', registration.scope);
            await registration.unregister();
          }
        }

        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });

        console.log('Firebase messaging service worker registered:', registration);
        console.log('Service worker scope:', registration.scope);
        console.log('Service worker active:', registration.active?.state);

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New service worker available, please refresh.');
              }
            });
          }
        });
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  isSupported(): boolean {
    const basicSupport = 'serviceWorker' in navigator && 'Notification' in window;

    const advancedSupport = basicSupport && 'PushManager' in window && messagingSupported;

    console.log('Push notification support:', {
      basic: basicSupport,
      advanced: advancedSupport,
      fcm: messagingSupported,
    });

    return basicSupport;
  }

  vibrate(pattern: number[] = [200, 100, 200]): void {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }
}

export default PushNotificationService;
