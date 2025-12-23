const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp();
}


const sendPushNotification = onDocumentCreated(
    'pushNotifications/{docId}',
    async (event) => {
        try {
            const notificationData = event.data && event.data.data();
            if (!notificationData) {
                console.log('No notification data found');
                return;
            }

            const { userId, payload, status, deduplicationId } = notificationData;

            if (status !== 'pending') {
                console.log('Notification status is not pending:', status);
                return;
            }


            if (!payload || !payload.title || !payload.body) {
                console.error('Invalid payload - missing title or body:', payload);
                await event.data.ref.update({
                    status: 'failed',
                    error: 'Invalid payload - missing title or body',
                    failedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                return;
            }


            if (deduplicationId) {
                const existingNotifications = await admin.firestore()
                    .collection('pushNotifications')
                    .where('deduplicationId', '==', deduplicationId)
                    .where('status', 'in', ['sent', 'duplicate'])
                    .limit(1)
                    .get();

                if (!existingNotifications.empty) {
                    console.log('Duplicate notification detected, skipping:', deduplicationId);
                    await event.data.ref.update({ status: 'duplicate' });
                    return;
                }
            }

            console.log('Processing push notification for user:', userId);

            const userDoc = await admin.firestore().collection('users').doc(userId).get();
            if (!userDoc.exists) {
                console.error('User not found:', userId);
                return;
            }

            const userData = userDoc.data();
            const fcmTokens = userData.fcmTokens || [];

            if (fcmTokens.length === 0) {
                console.log('No FCM tokens found for user:', userId);
                await event.data.ref.update({ status: 'no_tokens' });
                return;
            }

            const message = {
                notification: {
                    title: payload.title,
                    body: payload.body,
                    image: payload.image
                },
                data: {
                    ...payload.data,
                    type: payload.tag || 'general',
                    url: payload.url || '/notifications',
                    badgeCount: payload.badgeCount?.toString() || '0'
                },
                android: {
                    notification: {
                        icon: payload.icon || 'ic_notification',
                        color: '#6366f1',
                        sound: 'default',
                        channelId: 'bookinga_notifications',
                        priority: 'high',
                        vibrateTimingsMillis: [200, 100, 200, 100, 200],
                        lightSettings: {
                            color: '#6366f1',
                            lightOnDurationMillis: 200,
                            lightOffDurationMillis: 200
                        },
                        notificationCount: parseInt(payload.badgeCount) || 1
                    },
                    data: {
                        ...payload.data,
                        click_action: 'FLUTTER_NOTIFICATION_CLICK'
                    }
                },
                apns: {
                    headers: {
                        'apns-priority': '10',
                        'apns-push-type': 'alert'
                    },
                    payload: {
                        aps: {
                            alert: {
                                title: payload.title,
                                body: payload.body
                            },
                            badge: parseInt(payload.badgeCount) || 1,
                            sound: 'default',
                            'content-available': 1,
                            'mutable-content': 1
                        },
                        data: payload.data
                    }
                },
                webpush: {
                    headers: {
                        TTL: '86400'
                    },
                    notification: {
                        title: payload.title,
                        body: payload.body,
                        icon: payload.icon || '/android/android-launchericon-192-192.png',
                        badge: payload.badge || '/android/android-launchericon-96-96.png',
                        image: payload.image,
                        vibrate: [200, 100, 200, 100, 200],
                        requireInteraction: true,
                        actions: [
                            { action: 'view', title: 'View' },
                            { action: 'dismiss', title: 'Dismiss' }
                        ],
                        data: {
                            ...payload.data,
                            url: payload.url
                        }
                    },
                    fcmOptions: {
                        link: payload.url || '/'
                    }
                }
            };

            const results = await Promise.all(
                fcmTokens.map(async (token) => {
                    try {
                        const response = await admin.messaging().send({ ...message, token });
                        console.log('Successfully sent message:', response);
                        return { token, success: true, response };
                    } catch (error) {
                        console.error('Error sending message to token:', token, error);

                        if (
                            error.code === 'messaging/registration-token-not-registered' ||
                            error.code === 'messaging/invalid-registration-token'
                        ) {
                            await admin.firestore().collection('users').doc(userId).update({
                                fcmTokens: admin.firestore.FieldValue.arrayRemove(token)
                            });
                        }

                        return { token, success: false, error: error.message };
                    }
                })
            );

            const successCount = results.filter((r) => r.success).length;
            const failureCount = results.length - successCount;

            await event.data.ref.update({
                status: 'sent',
                sentAt: admin.firestore.FieldValue.serverTimestamp(),
                results: {
                    success: successCount,
                    failure: failureCount,
                    details: results
                },
                processedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log(`Push notification sent. Success: ${successCount}, Failure: ${failureCount}`);
        } catch (error) {
            console.error('Error in sendPushNotification function:', error);
            if (event.data) {
                await event.data.ref.update({
                    status: 'failed',
                    error: error.message,
                    failedAt: admin.firestore.FieldValue.serverTimestamp()
                });
            }
        }
    }
);


const sendBulkPushNotifications = onDocumentCreated(
    'bulkNotifications/{docId}',
    async (event) => {
        try {
            const bulkData = event.data && event.data.data();
            if (!bulkData) return;

            const { userIds, payload, status } = bulkData;
            if (status !== 'pending') return;

            console.log('Processing bulk notification for users:', userIds.length);

            const batch = admin.firestore().batch();
            userIds.forEach((userId) => {
                const notificationRef = admin.firestore().collection('pushNotifications').doc();

                batch.set(notificationRef, {
                    userId,
                    payload,
                    status: 'pending',
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    type: 'bulk_notification',
                    bulkId: event.data.id
                });
            });

            await batch.commit();

            await event.data.ref.update({
                status: 'queued',
                queuedAt: admin.firestore.FieldValue.serverTimestamp(),
                totalUsers: userIds.length
            });

            console.log('Bulk notification queued for', userIds.length, 'users');
        } catch (error) {
            console.error('Error in sendBulkPushNotifications:', error);
            if (event.data) {
                await event.data.ref.update({
                    status: 'failed',
                    error: error.message
                });
            }
        }
    }
);


const cleanupOldNotifications = onSchedule('every 24 hours', async (event) => {
    try {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 7);

        const oldNotifications = await admin
            .firestore()
            .collection('pushNotifications')
            .where('createdAt', '<', cutoffDate)
            .where('status', 'in', ['sent', 'failed', 'no_tokens', 'duplicate'])
            .get();

        const batch = admin.firestore().batch();
        oldNotifications.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log('Cleaned up', oldNotifications.size, 'old push notifications');
    } catch (error) {
        console.error('Error cleaning up notifications:', error);
    }
});

module.exports = {
    sendPushNotification,
    sendBulkPushNotifications,
    cleanupOldNotifications
};
