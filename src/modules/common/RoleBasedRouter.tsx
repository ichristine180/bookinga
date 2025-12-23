import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import CustomerRoutes from '@/modules/mobile/CustomerRoutes';
import SalonAdminRoutes from '@/modules/admin/SalonAdminRoutes';
import SuperAdminRoutes from '@/modules/superadmin/SuperAdminRoutes';
import AuthPendingApprovalPage from '@/modules/auth/pages/PendingApprovalPage';

const RoleBasedRouter: React.FC = () => {
    const { userProfile, loading, isApproved, needsApproval } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!userProfile) {
        return <CustomerRoutes />;
    }

    if (needsApproval) {
        return <AuthPendingApprovalPage />;
    }

    if (userProfile.approvalStatus === 'rejected') {
        return <Navigate to="/account-rejected" replace />;
    }

    switch (userProfile.role) {
        case 'salon_admin':
            if (!isApproved) {
                return <AuthPendingApprovalPage />;
            }
            return <SalonAdminRoutes />;

        case 'super_admin':
            if (!isApproved) {
                return <AuthPendingApprovalPage />;
            }
            return <SuperAdminRoutes />;

        default:
            return <CustomerRoutes />;
    }
};

export default RoleBasedRouter;
