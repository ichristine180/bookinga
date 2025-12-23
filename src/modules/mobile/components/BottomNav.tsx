import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BuildingStorefrontIcon, CalendarIcon, UserIcon } from '@heroicons/react/16/solid';
import { useAuth } from '../../../contexts/AuthContext';

const BottomNav: React.FC = () => {
    const location = useLocation();
    const { currentUser, userProfile } = useAuth();

    const isAuthenticated = currentUser && userProfile;

    const navItems = [
        { path: '/', label: 'Home', icon: HomeIcon },
        { path: '/salons', label: 'Salons', icon: BuildingStorefrontIcon },
        {
            path: '/my-bookings',
            label: 'Bookings',
            icon: CalendarIcon,
            requiresAuth: false
        },
        {
            path: isAuthenticated ? '/profile' : '/auth',
            label: isAuthenticated ? 'Profile' : 'Account',
            icon: UserIcon,
            requiresAuth: false
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border">
            <div className="flex justify-around items-center h-14">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center flex-1 h-full py-1 ${isActive
                                ? 'text-primary-500 dark:text-primary-400'
                                : 'text-gray-500 dark:text-gray-400'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-xs mt-0.5 font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;