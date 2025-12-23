import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-dark-bg">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-2">
                    Bookinga
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;