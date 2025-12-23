import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/16/solid';

const AuthRegistrationSuccessPage: React.FC = () => {
    return (
        <div className="h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-bg dark:via-dark-card dark:to-gray-900 flex flex-col overflow-hidden">

            <div className="flex items-center justify-center px-6 pt-6 pb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-primary-500 dark:text-dark-text">
                            Bookinga
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Registration Complete
                        </p>
                    </div>
                </div>
            </div>


            <div className="flex-1 px-6 flex-col justify-center">
                <div className="max-w-sm mx-auto w-full">

                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                            <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text mb-2">
                            Registration Successful!
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Your salon has been submitted for review
                        </p>
                    </div>


                    <div className="space-y-3 mb-6">
                        <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <EnvelopeIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-blue-800 dark:text-blue-400">
                                    Check your email
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-300">
                                    Verify your email address
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                            <ClockIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                                    Review in 24-48 hours
                                </p>
                                <p className="text-xs text-amber-600 dark:text-amber-300">
                                    We'll notify you when approved
                                </p>
                            </div>
                        </div>
                    </div>





                    <div className="space-y-2">
                        <Link
                            to="/login"
                            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-center block text-sm"
                        >
                            Go to Dashboard
                        </Link>

                        <Link
                            to="/login"
                            className="w-full border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg font-medium py-2.5 px-4 rounded-lg transition-colors text-center block text-sm"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>


            <div className="px-6 pb-6">
                <div className="max-w-sm mx-auto text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Need help? Contact support
                    </p>
                    <div className="flex justify-center space-x-4">
                        <a
                            href="mailto:support@bookinga.com"
                            className="text-xs text-primary-600 hover:text-primary-500"
                        >
                            Email
                        </a>
                        <a
                            href="tel:+250123456789"
                            className="text-xs text-primary-600 hover:text-primary-500"
                        >
                            Call
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthRegistrationSuccessPage;