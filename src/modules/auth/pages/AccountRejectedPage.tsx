import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { XCircleIcon, EnvelopeIcon, QuestionMarkCircleIcon } from '@heroicons/react/16/solid';

const AuthAccountRejectedPage: React.FC = () => {
    const { userProfile, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="bg-white dark:bg-dark-card py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10">


                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                            <XCircleIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text">
                            Application Declined
                        </h2>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            We're sorry, but your {userProfile?.role === 'salon_admin' ? 'salon' : 'account'} application has been declined
                        </p>
                    </div>


                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Applicant:</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-dark-text">
                                    {userProfile?.displayName}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-dark-text">
                                    {userProfile?.email}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Application Type:</span>
                                <span className="text-sm font-medium text-gray-800 dark:text-dark-text capitalize">
                                    {userProfile?.role?.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                    Declined
                                </span>
                            </div>
                            {userProfile?.approvedAt && (
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Reviewed on:</span>
                                    <span className="text-sm font-medium text-gray-800 dark:text-dark-text">
                                        {new Date(userProfile.approvedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>


                    {userProfile?.rejectionReason && (
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-3">
                                Reason for Decline
                            </h3>
                            <div className="bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-lg p-4">
                                <p className="text-gray-700 dark:text-gray-300">
                                    {userProfile.rejectionReason}
                                </p>
                            </div>
                        </div>
                    )}


                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-4">
                            What can you do?
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <EnvelopeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-dark-text">
                                        Contact our support team
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Get more details about the decline reason and discuss potential solutions
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <QuestionMarkCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-dark-text">
                                        Request a review
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        If you believe this decision was made in error, you can request a manual review
                                    </p>
                                </div>
                            </div>

                            {userProfile?.role === 'salon_admin' && (
                                <div className="flex items-start">
                                    <XCircleIcon className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-3 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800 dark:text-dark-text">
                                            Resubmit with corrections
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Address the issues mentioned and submit a new application
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
                            Get Help from Our Support Team
                        </h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                            Our team is here to help you understand the decision and explore your options.
                        </p>
                        <div className="space-y-2">
                            <a
                                href={`mailto:support@salonbook.com?subject=Application Declined - ${userProfile?.displayName}&body=Hello, my application was declined and I would like to understand the reason and discuss next steps.%0A%0AApplication Details:%0AName: ${userProfile?.displayName}%0AEmail: ${userProfile?.email}%0AType: ${userProfile?.role}%0AReason: ${userProfile?.rejectionReason || 'Not specified'}`}
                                className="block text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                📧 Email Support Team
                            </a>
                            <a
                                href="tel:+250123456789"
                                className="block text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                📞 Call: +250 123 456 789
                            </a>
                        </div>
                    </div>


                    <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 mb-6">
                        <h4 className="text-sm font-medium text-gray-800 dark:text-dark-text mb-3">
                            Common Reasons for Application Decline
                        </h4>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {userProfile?.role === 'salon_admin' ? (
                                <>
                                    <li>• Incomplete or inaccurate business information</li>
                                    <li>• Missing required business licenses or documentation</li>
                                    <li>• Inappropriate or insufficient service descriptions</li>
                                    <li>• Duplicate salon registration</li>
                                    <li>• Non-compliance with platform policies</li>
                                </>
                            ) : (
                                <>
                                    <li>• Incomplete profile information</li>
                                    <li>• Invalid or unverified email address</li>
                                    <li>• Suspected fraudulent activity</li>
                                    <li>• Violation of terms of service</li>
                                    <li>• Technical issues during verification</li>
                                </>
                            )}
                        </ul>
                    </div>


                    <div className="space-y-3">
                        <a
                            href={`mailto:support@salonbook.com?subject=Application Review Request - ${userProfile?.displayName}`}
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors text-center block"
                        >
                            Contact Support Team
                        </a>

                        {userProfile?.role === 'salon_admin' && (
                            <Link
                                to="/salon/register"
                                className="w-full border border-primary-500 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-medium py-3 px-4 rounded-lg transition-colors text-center block"
                            >
                                Submit New Application
                            </Link>
                        )}

                        <button
                            onClick={handleLogout}
                            className="w-full border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>


                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-border text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Application reviewed on {userProfile?.approvedAt ?
                                new Date(userProfile.approvedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : 'Unknown date'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthAccountRejectedPage;