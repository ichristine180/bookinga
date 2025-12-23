import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

const AuthProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { currentUser, userProfile, loading } = useAuth();
    console.log(allowedRoles)

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!currentUser || !userProfile) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(userProfile.role)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-4">
                        Access Denied
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        You don't have permission to access this area.
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthProtectedRoute;