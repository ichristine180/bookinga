import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthProtectedRoute from '@/modules/auth/components/ProtectedRoute';
import SuperAdminLayout from './components/SuperAdminLayout';
import SuperAdminDashboardPage from './pages/SuperAdminDashboard';
import SuperAdminSalonsManagementPage from './pages/SalonsManagement';
import SuperAdminUsersManagementPage from './pages/UsersManagement';
import SuperAdminApprovalsManagementPage from './pages/ApprovalsManagement';
import SuperAdminNotificationsPage from './pages/NotificationsPage';

const SuperAdminRoutes: React.FC = () => {
    return (
        <AuthProtectedRoute allowedRoles={['super_admin']}>
            <SuperAdminLayout>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<SuperAdminDashboardPage />} />
                    <Route path="/salons" element={<SuperAdminSalonsManagementPage />} />
                    <Route path="/users" element={<SuperAdminUsersManagementPage />} />
                    <Route path="/approvals" element={<SuperAdminApprovalsManagementPage />} />
                    <Route path="/notifications" element={<SuperAdminNotificationsPage />} />


                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </SuperAdminLayout>
        </AuthProtectedRoute>
    );
};

export default SuperAdminRoutes;