import React from 'react';
import { BellIcon, CheckIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const MobileNotificationsPage: React.FC = () => {
    const navigate = useNavigate();
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
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg pb-20">

            <div className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-dark-text">
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
                            className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                            Mark All Read
                        </button>
                    )}
                </div>
            </div>


            <div className="p-4 space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text mb-2">
                            No notifications yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center">
                            You'll see updates about your bookings and appointments here.
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
                            <div className="flex items-start space-x-3">
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
                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text">
                                                {notification.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                                {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-1 ml-2">
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification.id)}
                                                    className="p-1.5 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                                                    title="Mark as read"
                                                >
                                                    <CheckIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(notification.id)}
                                                className="p-1.5 text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                                                title="Delete"
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

export default MobileNotificationsPage;