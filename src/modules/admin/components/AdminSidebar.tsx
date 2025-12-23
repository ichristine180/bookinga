import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { HomeIcon, CalendarIcon, WrenchScrewdriverIcon, BuildingStorefrontIcon, XMarkIcon } from '@heroicons/react/16/solid';

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { logout, userProfile } = useAuth();

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: HomeIcon },
        { path: '/appointments', label: 'Appointments', icon: CalendarIcon },
        { path: '/services', label: 'Services', icon: WrenchScrewdriverIcon },
        { path: '/business-info', label: 'Business Info', icon: BuildingStorefrontIcon },
    ];

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <>
            {isOpen && <div className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" onClick={onClose} />}

            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-dark-card shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-dark-border">
                    <div className="text-left">
                        <h1 className="text-xl font-bold text-primary-500">{import.meta.env.VITE_APP_NAME || 'Bookinga'}</h1>
                        <p className="text-[12px] text-gray-600 dark:text-gray-400 truncate">{userProfile?.salon?.name || 'Your Salon'}</p>
                    </div>
                    <button onClick={onClose} className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-bg">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <nav className="mt-6 px-3">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/dashboard');
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path === '/' ? '/dashboard' : item.path}
                                    onClick={onClose}
                                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-bg'
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
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;
