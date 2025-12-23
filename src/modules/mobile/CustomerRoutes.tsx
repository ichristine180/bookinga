import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MobileHomePage from './pages/HomePage';
import MobileSalonsPage from './pages/MobileSalonPage';
import MobileSalonDetailPage from './pages/SalonDetailPage';
import MobileBookingPage from './pages/BookingPage';
import MobileBookingConfirmationPage from './pages/BookingConfirmationPage';
import MobileMyBookingsPage from './pages/MyBookingsPage';
import MobileProfilePage from './pages/ProfilePage';
import MobileServiceBookingPage from './pages/MobileServiceBookingPage';
import MobileGuestAuthPage from './pages/MobileGuestAuthPage';
import MobileNotificationsPage from './pages/NotificationsPage';
import PaymentCallbackPage from './pages/PaymentCallbackPage';
import Layout from './components/Layout';

const CustomerRoutes: React.FC = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<MobileHomePage />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/salons" element={<MobileSalonsPage />} />
                <Route path="/salon/:salonId" element={<MobileSalonDetailPage />} />
                <Route path="/book/:salonId/:serviceId" element={<MobileBookingPage />} />
                <Route path="/book-service/:serviceId" element={<MobileServiceBookingPage />} />
                <Route path="/booking-confirmation/:appointmentId" element={<MobileBookingConfirmationPage />} />
                <Route path="/my-bookings" element={<MobileMyBookingsPage />} />
                <Route path="/profile" element={<MobileProfilePage />} />
                <Route path="/auth" element={<MobileGuestAuthPage />} />
                <Route path="/notifications" element={<MobileNotificationsPage />} />
                <Route path="/payment/callback" element={<PaymentCallbackPage />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Layout>
    );
};

export default CustomerRoutes;