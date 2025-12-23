import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../hooks/useNotifications';
import {
    HomeIcon,
    BuildingStorefrontIcon,
    UsersIcon,
    CogIcon,
    BellIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/16/solid';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';

interface SuperAdminLayoutProps {
    children: React.ReactNode;
}

const SuperAdminLayout: React.FC<SuperAdminLayoutProps> = ({ children }) => {
    const navigate = useNavigate();
    const { userProfile, logout } = useAuth();
    const { unreadCount } = useNotifications();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: HomeIcon },
        { path: '/salons', label: 'Salons', icon: BuildingStorefrontIcon },
        { path: '/users', label: 'Users', icon: UsersIcon },
        { path: '/settings', label: 'Settings', icon: CogIcon },
    ];

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-dark-bg">

            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}


            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-dark-card shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-dark-border">
                    <h1 className="text-xl font-bold text-primary-500">
                        {import.meta.env.VITE_APP_NAME || 'SalonBook'} Admin
                    </h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-bg"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <nav className="mt-6 px-3">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 mr-3" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                <div className="absolute bottom-6 w-full px-3">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                        Sign Out
                    </button>
                </div>
            </div>


            <div className="flex-1 flex flex-col overflow-hidden">

                <header className="bg-white dark:bg-dark-card shadow-sm border-b border-gray-200 dark:border-dark-border">
                    <div className="flex items-center justify-between h-16 px-6">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-bg"
                            >
                                <Bars3Icon className="w-5 h-5" />
                            </button>

                            <div className="ml-4 lg:ml-0">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text">
                                    Platform Administration
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Manage salons, users, and platform settings
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={() => navigate('/notifications')}
                                className="relative p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg transition-colors"
                            >
                                <BellIcon className="w-6 h-6" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            <div className="flex items-center">
                                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-medium">
                                    {userProfile?.displayName?.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-3 hidden sm:block">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {userProfile?.displayName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Super Admin
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>


                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default SuperAdminLayout;