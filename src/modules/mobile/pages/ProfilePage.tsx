import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    UserIcon,
    CalendarIcon,
    HeartIcon,
    CogIcon,
    QuestionMarkCircleIcon,
} from '@heroicons/react/16/solid';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';

const MobileProfilePage: React.FC = () => {
    const { currentUser, userProfile, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const menuItems = [
        {
            icon: CalendarIcon,
            label: 'My Bookings',
            action: () => navigate('/my-bookings'),
            description: 'View your appointment history'
        },
        {
            icon: HeartIcon,
            label: 'Favorites',
            action: () => console.log('Favorites'),
            description: 'Your favorite salons and services'
        },
        {
            icon: CogIcon,
            label: 'Settings',
            action: () => console.log('Settings'),
            description: 'Manage your preferences'
        },
        {
            icon: QuestionMarkCircleIcon,
            label: 'Help & Support',
            action: () => console.log('Help'),
            description: 'Get help and contact support'
        },
    ];

    return (
        <div className="space-y-6">

            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border p-6">
                <div className="flex items-center">
                    <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-4">
                        {userProfile?.avatar ? (
                            <img
                                src={userProfile.avatar}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <UserIcon className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                        )}
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text">
                            {userProfile?.displayName || 'Guest User'}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {currentUser?.email}
                        </p>
                        {userProfile?.phone && (
                            <p className="text-gray-600 dark:text-gray-400">
                                {userProfile.phone}
                            </p>
                        )}
                    </div>
                </div>
            </div>


            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden">
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={index}
                            onClick={item.action}
                            className="w-full p-4 flex items-center hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors border-b border-gray-200 dark:border-dark-border last:border-b-0"
                        >
                            <div className="p-2 bg-gray-100 dark:bg-dark-bg rounded-lg mr-4">
                                <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </div>
                            <div className="flex-1 text-left">
                                <p className="font-medium text-gray-800 dark:text-dark-text">
                                    {item.label}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.description}
                                </p>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    );
                })}
            </div>


            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border p-6">
                <h3 className="font-medium text-gray-800 dark:text-dark-text mb-4">
                    About {import.meta.env.VITE_APP_NAME || 'SalonBook'}
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>Version 1.0.0</p>
                    <p>© 2024 SalonBook. All rights reserved.</p>
                </div>
            </div>


            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                Sign Out
            </button>
        </div>
    );
};

export default MobileProfilePage;