import React from 'react';
import { BellIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

const SuperAdminNotificationsPage: React.FC = () => {
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
            case 'user_registration':
                return '👤';
            case 'salon_registration':
                return '🏪';
            case 'account_approved':
                return '✅';
            case 'account_rejected':
                return '❌';
            case 'booking_confirmed':
            case 'new_booking':
                return '📅';
            case 'booking_cancelled':
                return '❌';
            case 'system_alert':
                return '⚠️';
            default:
                return '📢';
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <BellIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                        System Notifications
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


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <BellIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-3">
                            <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                Total Notifications
                            </div>
                            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                {notifications.length}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <span className="w-5 h-5 text-red-600 dark:text-red-400 text-lg">•</span>
                        </div>
                        <div className="ml-3">
                            <div className="text-sm font-medium text-red-900 dark:text-red-100">
                                Unread
                            </div>
                            <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                                {unreadCount}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="ml-3">
                            <div className="text-sm font-medium text-green-900 dark:text-green-100">
                                Read
                            </div>
                            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                                {notifications.length - unreadCount}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">
                            No notifications yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            System notifications about registrations, approvals, and important alerts will appear here.
                        </p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 rounded-xl border transition-all duration-200 ${notification.isRead
                                ? 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border'
                                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                }`}
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                                        <span className="text-lg">
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text">
                                                    {notification.title}
                                                </h3>
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                                    {notification.type.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
                                                    className="p-1 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                                                    title="Mark as read"
                                                >
                                                    <CheckIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(notification.id)}
                                                className="p-1 text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
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

export default SuperAdminNotificationsPage;