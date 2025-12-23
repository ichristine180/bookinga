import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../hooks/useNotifications';
import { BellIcon, UserIcon } from '@heroicons/react/16/solid';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    const { userProfile, currentUser } = useAuth();
    const { unreadCount } = useNotifications();

    const isAuthenticated = currentUser && userProfile;

    return (
        <header className="fixed top-0 left-0 right-0 z-10 bg-white dark:bg-dark-card shadow-sm">
            <div className="flex items-center justify-between h-16 px-4">
                <div>
                    <h1 className="text-xl font-bold font-montserrat text-primary-500">
                        Bookinga
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {isAuthenticated
                            ? `Welcome, ${userProfile.displayName?.split(' ')[0]}`
                            : 'Book your beauty appointment'
                        }
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/notifications"
                                className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors"
                            >
                                <BellIcon className="w-6 h-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Link>

                            <Link
                                to="/profile"
                                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-bg"
                            >
                                <UserIcon className="w-6 h-6" />
                            </Link>
                        </>
                    ) : (
                        <Link
                            to="/auth"
                            className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;