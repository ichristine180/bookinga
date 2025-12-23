

export interface BasicNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  vibrate?: number[];
  requireInteraction?: boolean;
}

class BasicNotificationService {
  private static instance: BasicNotificationService;

  public static getInstance(): BasicNotificationService {
    if (!BasicNotificationService.instance) {
      BasicNotificationService.instance = new BasicNotificationService();
    }
    return BasicNotificationService.instance;
  }


  isSupported(): boolean {
    return 'Notification' in window;
  }


  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();

      if (permission === 'granted') {

        this.showNotification({
          title: 'Notifications Enabled',
          body: 'You\'ll now receive booking notifications!',
          icon: '/android/android-launchericon-192-192.png',
          tag: 'permission-granted'
        });
      }

      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }


  showNotification(options: BasicNotificationOptions): Notification | null {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      console.log('Notifications not available or permission denied');
      return null;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/android/android-launchericon-192-192.png',
        badge: options.badge || '/android/android-launchericon-96-96.png',
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction || false,
        silent: false
      });


      notification.onclick = () => {
        notification.close();
        window.focus();


        if (options.data?.url) {
          window.location.href = options.data.url;
        }
      };


      if (options.vibrate && 'vibrate' in navigator) {
        navigator.vibrate(options.vibrate);
      }

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }


  async updateBadge(count: number): Promise<void> {
    try {
      if ('setAppBadge' in navigator) {
        await (navigator as any).setAppBadge(count);
      }
    } catch (error) {
      console.log('Badge API not supported:', error);
    }
  }


  async clearBadge(): Promise<void> {
    try {
      if ('clearAppBadge' in navigator) {
        await (navigator as any).clearAppBadge();
      }
    } catch (error) {
      console.log('Badge API not supported:', error);
    }
  }


  vibrate(pattern: number[] = [200, 100, 200]): void {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }


  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return null;
    }

    try {

      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Basic Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.log('Service Worker registration failed, notifications will work in foreground only:', error);
      return null;
    }
  }


  scheduleNotification(options: BasicNotificationOptions, delay: number): number {
    return window.setTimeout(() => {
      this.showNotification(options);
    }, delay);
  }


  cancelScheduledNotification(id: number): void {
    clearTimeout(id);
  }


  showBookingNotification(title: string, message: string, bookingId?: string): void {
    this.showNotification({
      title,
      body: message,
      icon: '/android/android-launchericon-192-192.png',
      badge: '/android/android-launchericon-96-96.png',
      tag: 'booking',
      vibrate: [200, 100, 200, 100, 200],
      requireInteraction: true,
      data: {
        type: 'booking',
        bookingId,
        url: bookingId ? `/appointments/${bookingId}` : '/appointments'
      }
    });
  }


  showReminderNotification(title: string, message: string, appointmentId?: string): void {
    this.showNotification({
      title,
      body: message,
      icon: '/android/android-launchericon-192-192.png',
      badge: '/android/android-launchericon-96-96.png',
      tag: 'reminder',
      vibrate: [100, 50, 100, 50, 100],
      requireInteraction: true,
      data: {
        type: 'reminder',
        appointmentId,
        url: appointmentId ? `/appointments/${appointmentId}` : '/appointments'
      }
    });
  }
}

export default BasicNotificationService;