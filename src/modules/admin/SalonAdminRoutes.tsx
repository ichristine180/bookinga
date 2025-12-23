import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboardPage from './pages/DashboardPage';
import AdminAppointmentsPage from './pages/AppointmentsPage';
import AdminServicesPage from './pages/ServicesPage';
import AdminStaffPage from './pages/StaffPage';
import AdminCustomersPage from './pages/CustomersPage';
import SalonBusinessInfoPage from './pages/SalonBusinessInfoPage';
import AdminNotificationsPage from './pages/NotificationsPage';
import AuthProtectedRoute from '../auth/components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import PushNotificationTester from '@/components/PushNotificationTester';

const SalonAdminRoutes: React.FC = () => {
    return (
        <AuthProtectedRoute allowedRoles={['salon_admin']}>
            <AdminLayout>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/appointments" element={<AdminAppointmentsPage />} />
                    <Route path="/services" element={<AdminServicesPage />} />
                    <Route path="/business-info" element={<SalonBusinessInfoPage />} />
                    <Route path="/staff" element={<AdminStaffPage />} />
                    <Route path="/customers" element={<AdminCustomersPage />} />
                    <Route path="/notifications" element={<AdminNotificationsPage />} />
                    <Route path="/push-test" element={<PushNotificationTester />} />

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AdminLayout>
        </AuthProtectedRoute>
    );
};

export default SalonAdminRoutes;