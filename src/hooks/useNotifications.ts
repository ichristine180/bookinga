import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { AppNotification } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import PushNotificationService from '@/services/pushNotificationService';
import BasicNotificationService from '@/services/basicNotificationService';

const getNotificationUrl = (type: AppNotification['type'], relatedId?: string): string => {
    switch (type) {
        case 'booking_confirmed':
        case 'booking_cancelled':
            return relatedId ? `/appointments/${relatedId}` : '/appointments';
        case 'appointment_reminder':
            return relatedId ? `/appointments/${relatedId}` : '/appointments';
        case 'account_approved':
        case 'account_rejected':
            return '/profile';
        case 'salon_approved':
        case 'salon_rejected':
            return '/salon/dashboard';
        default:
            return '/notifications';
    }
};

export const useNotifications = () => {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);
    const pushService = PushNotificationService.getInstance();
    const basicNotificationService = BasicNotificationService.getInstance();

    useEffect(() => {
        if (!currentUser) {
            setNotifications([]);
            setUnreadCount(0);
            try {
                pushService.clearBadge();
            } catch (error) {
                basicNotificationService.clearBadge();
            }
            return;
        }

        const initializePushNotifications = async () => {
            if (isInitialized) {
                console.log('Push notifications already initialized');
                return;
            }

            try {
                console.log('Initializing push notifications for user:', currentUser.uid);

                if (!pushService.isSupported()) {
                    console.log('Push notifications not supported in this browser');
                    setIsInitialized(true);
                    return;
                }

                console.log('Registering service worker...');
                await pushService.registerServiceWorker();

                console.log('Requesting notification permission...');
                const token = await pushService.requestPermission();
                console.log('Permission result:', token ? 'granted' : 'denied');

                if (token && token !== 'basic-notifications-enabled') {
                    console.log('Storing FCM token for user:', currentUser.uid);
                    await pushService.storeFCMToken(currentUser.uid, token);
                    console.log('FCM notifications enabled');
                } else if (token === 'basic-notifications-enabled') {
                    console.log('Basic notifications enabled (FCM not available)');
                } else {
                    console.log('No token received - notifications may not work');
                }

                const unsubscribe = pushService.setupForegroundMessageListener((payload) => {
                    console.log('Foreground message received:', payload);
                    pushService.vibrate([200, 100, 200]);
                });

                setIsInitialized(true);
                return unsubscribe;
            } catch (error) {
                console.error('Error initializing push notifications:', error);

                try {
                    console.log('Falling back to basic notifications');
                    await basicNotificationService.requestPermission();
                    await basicNotificationService.registerServiceWorker();
                    setIsInitialized(true);
                } catch (basicError) {
                    console.error('Error initializing basic notifications:', basicError);
                    setIsInitialized(true);
                }
            }
        };

        if (!isInitialized) {
            initializePushNotifications();
        }

        const q = query(collection(db, 'notifications'), where('userId', '==', currentUser.uid));

        const unsubscribe = onSnapshot(
            q,
            async (snapshot) => {
                const notifs: AppNotification[] = [];

                snapshot.forEach((doc) => {
                    notifs.push({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: doc.data().createdAt?.toDate(),
                    } as AppNotification);
                });

                const sortedNotifs = notifs.sort((a, b) => {
                    const dateA = a.createdAt ? a.createdAt.getTime() : 0;
                    const dateB = b.createdAt ? b.createdAt.getTime() : 0;
                    return dateB - dateA;
                });

                setNotifications(sortedNotifs);
                const newUnreadCount = sortedNotifs.filter((n) => !n.isRead).length;
                setUnreadCount(newUnreadCount);

                try {
                    await pushService.updateBadgeCount(newUnreadCount);
                } catch (error) {
                    await basicNotificationService.updateBadge(newUnreadCount);
                }
            },
            (error) => {
                console.error('Error in notifications listener:', error);
                setNotifications([]);
                setUnreadCount(0);
            }
        );

        return () => unsubscribe();
    }, [currentUser, pushService, isInitialized]);

    const markAsRead = async (notificationId: string) => {
        try {
            await updateDoc(doc(db, 'notifications', notificationId), {
                isRead: true,
            });

            const newUnreadCount = notifications.filter((n) => n.id !== notificationId && !n.isRead).length;
            try {
                await pushService.updateBadgeCount(newUnreadCount);
            } catch (error) {
                await basicNotificationService.updateBadge(newUnreadCount);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const unreadNotifs = notifications.filter((n) => !n.isRead);

            await Promise.all(unreadNotifs.map((notif) => updateDoc(doc(db, 'notifications', notif.id), { isRead: true })));

            try {
                await pushService.clearBadge();
            } catch (error) {
                await basicNotificationService.clearBadge();
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const createNotification = async (userId: string, type: AppNotification['type'], title: string, message: string, relatedId?: string) => {
        try {
            const notificationRef = await addDoc(collection(db, 'notifications'), {
                userId,
                type,
                title,
                message,
                isRead: false,
                relatedId,
                createdAt: new Date(),
            });

            console.log(`Creating notification for user ${userId}, current user: ${currentUser?.uid}`);
            await pushService.sendNotificationToUser(userId, {
                title,
                body: message,
                icon: '/android/android-launchericon-192-192.png',
                badge: '/android/android-launchericon-96-96.png',
                tag: type,
                data: {
                    type,
                    relatedId,
                    notificationId: notificationRef.id,
                },
                url: getNotificationUrl(type, relatedId),
                badgeCount: unreadCount + 1,
            });
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    };

    const deleteNotification = async (notificationId: string) => {
        try {
            await deleteDoc(doc(db, 'notifications', notificationId));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const requestNotificationPermission = async () => {
        if ('Notification' in window && Notification.permission === 'default') {
            try {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    console.log('Notification permission granted');

                    new Notification('Notifications Enabled', {
                        body: "You'll now receive booking notifications!",
                        icon: '/android/android-launchericon-192-192.png',
                        tag: 'permission-granted',
                    });
                }
                return permission;
            } catch (error) {
                console.error('Error requesting notification permission:', error);
                return 'denied';
            }
        }
        return Notification.permission;
    };

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        createNotification,
        requestNotificationPermission,
        deleteNotification,
    };
};
