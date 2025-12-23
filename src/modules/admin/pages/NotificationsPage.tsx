import React from 'react';
import { BellIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

const AdminNotificationsPage: React.FC = () => {
    const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await markAsRead(notificationId);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const handleDelete = async (notificationId: string) => {
        try {
            await deleteNotification(notificationId);
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'booking_confirmed':
            case 'new_booking':
                return '📅';
            case 'booking_cancelled':
                return '❌';
            case 'appointment_reminder':
                return '⏰';
            case 'account_approved':
                return '✅';
            case 'account_rejected':
                return '❌';
            default:
                return '📢';
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="space-y-6 p-6">

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <BellIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                        Notifications
                    </h1>
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-500 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:hover:text-primary-300 rounded-lg transition-colors"
                    >
                        <CheckIcon className="w-4 h-4" />
                        <span>Mark All Read</span>
                    </button>
                )}
            </div>


            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">
                            No notifications yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            You'll see notifications about bookings, appointments, and account updates here.
                        </p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 rounded-xl border transition-all duration-200 relative ${notification.isRead
                                ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 opacity-75'
                                : 'bg-white dark:bg-dark-card border-blue-200 dark:border-blue-600 shadow-md ring-1 ring-blue-100 dark:ring-blue-900/50'
                                }`}
                        >

                            {!notification.isRead && (
                                <div className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}

                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.isRead
                                        ? 'bg-gray-200 dark:bg-gray-700'
                                        : 'bg-primary-100 dark:bg-primary-900/30'
                                        }`}>
                                        <span className={`text-lg ${notification.isRead ? 'opacity-60' : ''
                                            }`}>
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className={`text-sm font-semibold ${notification.isRead
                                                ? 'text-gray-600 dark:text-gray-400'
                                                : 'text-gray-900 dark:text-dark-text font-bold'
                                                }`}>
                                                {notification.title}
                                            </h3>
                                            <p className={`text-sm mt-1 ${notification.isRead
                                                ? 'text-gray-500 dark:text-gray-500'
                                                : 'text-gray-700 dark:text-gray-300'
                                                }`}>
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                                {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    className="p-1 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <CheckIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(notification.id)}
                                                className="p-1 text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                                                title="Delete notification"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminNotificationsPage;