import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../hooks/useNotifications';
import { Bars3Icon, BellIcon } from '@heroicons/react/16/solid';

interface AdminHeaderProps {
    onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const { userProfile } = useAuth();
    const { unreadCount } = useNotifications();

    return (
        <header className="bg-white dark:bg-dark-card shadow-sm border-b border-gray-200 dark:border-dark-border">
            <div className="flex items-center justify-between h-16 px-6">
                <div className="flex items-center">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-bg"
                    >
                        <Bars3Icon className="w-5 h-5" />
                    </button>

                    <div className="ml-4 lg:ml-0">
                        <h2 className="text-sm font-semibold text-gray-800 dark:text-dark-text">
                            Hi, {userProfile?.displayName?.split(' ')[0]}!
                        </h2>

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
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                            {userProfile?.displayName?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;