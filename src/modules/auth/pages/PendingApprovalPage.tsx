import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    EnvelopeIcon,
    BuildingStorefrontIcon
} from '@heroicons/react/16/solid';

const AuthPendingApprovalPage: React.FC = () => {
    const { userProfile, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const getApprovalContent = () => {
        if (userProfile?.role === 'salon_admin') {
            return {
                icon: BuildingStorefrontIcon,
                title: 'Salon Under Review',
                message: 'Your salon registration is being reviewed by our team.',
                details: [
                    'Verifying salon information',
                    'Checking business credentials',
                    'Reviewing services and pricing',
                    'Email notification on approval'
                ],
                estimatedTime: '24-48 hours',
                bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                iconColor: 'text-blue-600 dark:text-blue-400',
                borderColor: 'border-blue-200 dark:border-blue-800'
            };
        } else {
            return {
                icon: ClockIcon,
                title: 'Account Pending',
                message: 'Your account is pending approval from our administrators.',
                details: [
                    'Reviewing account information',
                    'Verifying credentials',
                    'Email notification on approval'
                ],
                estimatedTime: '24-48 hours',
                bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
                iconColor: 'text-yellow-600 dark:text-yellow-400',
                borderColor: 'border-yellow-200 dark:border-yellow-800'
            };
        }
    };

    const content = getApprovalContent();
    const Icon = content.icon;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            <div className="max-w-md mx-auto px-4 py-6">


                <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${content.bgColor} mb-3`}>
                        <Icon className={`w-6 h-6 ${content.iconColor}`} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-dark-text">
                        {content.title}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {content.message}
                    </p>
                </div>


                <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4 mb-4">
                    <h2 className="text-sm font-medium text-gray-800 dark:text-dark-text mb-3">
                        Account Details
                    </h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Name:</span>
                            <span className="text-xs font-medium text-gray-800 dark:text-dark-text">
                                {userProfile?.displayName}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Email:</span>
                            <span className="text-xs font-medium text-gray-800 dark:text-dark-text">
                                {userProfile?.email}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Role:</span>
                            <span className="text-xs font-medium text-gray-800 dark:text-dark-text capitalize">
                                {userProfile?.role?.replace('_', ' ')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Status:</span>
                            <span className={`text-xs font-medium capitalize ${content.iconColor}`}>
                                {userProfile?.approvalStatus}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400">Submitted:</span>
                            <span className="text-xs font-medium text-gray-800 dark:text-dark-text">
                                {userProfile?.createdAt ?
                                    new Date(userProfile.createdAt).toLocaleDateString() :
                                    'Unknown'
                                }
                            </span>
                        </div>
                    </div>
                </div>


                {!userProfile?.emailVerified && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-4">
                        <div className="flex items-start">
                            <ExclamationTriangleIcon className="w-4 h-4 text-amber-600 dark:text-amber-400 mr-2 mt-0.5" />
                            <div>
                                <p className="text-xs font-medium text-amber-800 dark:text-amber-400">
                                    Email Verification Required
                                </p>
                                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                    Check your email and click the verification link.
                                </p>
                            </div>
                        </div>
                    </div>
                )}


                <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4 mb-4">
                    <h2 className="text-sm font-medium text-gray-800 dark:text-dark-text mb-3">
                        Review Process
                    </h2>
                    <div className="space-y-2">
                        {content.details.map((detail, index) => (
                            <div key={index} className="flex items-start">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-3 h-3 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                                    </div>
                                </div>
                                <p className="ml-2 text-xs text-gray-700 dark:text-gray-300">
                                    {detail}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4 mb-4">
                    <div className="flex items-center mb-3">
                        <ClockIcon className="w-4 h-4 text-gray-400 mr-2" />
                        <h2 className="text-sm font-medium text-gray-800 dark:text-dark-text">
                            Estimated Review Time
                        </h2>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        {content.estimatedTime}
                    </p>
                </div>


                <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4 mb-4">
                    <h2 className="text-sm font-medium text-gray-800 dark:text-dark-text mb-3">
                        What's Next?
                    </h2>
                    <div className="space-y-2">
                        <div className="flex items-start">
                            <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                                Email notification when approved
                            </p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                                {userProfile?.role === 'salon_admin'
                                    ? 'Start accepting bookings and managing your salon'
                                    : 'Access all platform features'
                                }
                            </p>
                        </div>
                        <div className="flex items-start">
                            <EnvelopeIcon className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                            <p className="text-xs text-gray-700 dark:text-gray-300">
                                Login instructions and next steps included
                            </p>
                        </div>
                    </div>
                </div>


                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
                        Need Help?
                    </h3>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                        Our support team is here to help you.
                    </p>
                    <div className="space-y-2">
                        <a
                            href="mailto:he.kwizera@gmail.com"
                            className="block text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            📧 he.kwizera@gmail.com
                        </a>
                        <a
                            href="tel:+250798598574"
                            className="block text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            📞 +250 798 598 574
                        </a>
                    </div>
                </div>


                <div className="space-y-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50 py-3 px-4 rounded-lg font-medium transition-colors text-sm"
                    >
                        Refresh Status
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg py-3 px-4 rounded-lg font-medium transition-colors text-sm"
                    >
                        Sign Out
                    </button>
                </div>


                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-dark-border text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Submitted on {userProfile?.createdAt ?
                            new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            }) : 'Unknown date'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPendingApprovalPage;