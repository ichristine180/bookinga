import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Appointment } from '@/types';
import {
  getPendingBooking,
  clearPendingBooking,
  getPaypackSession,
} from '@/services/paypackService';
import { format } from 'date-fns';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';

const PaymentCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { createNotification } = useNotifications();

  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>(
    'processing'
  );
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const processPayment = async () => {
      const pendingBooking = getPendingBooking();
      const sessionId = getPaypackSession();
      const urlSessionId = searchParams.get('session_id');
      const paymentStatus = searchParams.get('status');

      if (!pendingBooking) {
        setStatus('failed');
        setMessage('No pending booking found. Please try booking again.');
        return;
      }

      // Check if payment was cancelled or failed
      if (paymentStatus === 'cancelled' || paymentStatus === 'failed') {
        setStatus('failed');
        setMessage('Payment was cancelled or failed. Please try again.');
        clearPendingBooking();
        return;
      }

      try {
        // Create the appointment
        const appointmentData: Omit<Appointment, 'id'> = {
          salonId: pendingBooking.salonId,
          customerId: pendingBooking.customerId,
          serviceId: pendingBooking.serviceId,
          staffId: pendingBooking.staffId,
          date: pendingBooking.date,
          time: pendingBooking.time,
          duration: pendingBooking.duration,
          status: 'pending',
          totalAmount: pendingBooking.totalAmount,
          currency: pendingBooking.currency,
          deleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          reminderSent: false,
          specialInstructions: pendingBooking.specialInstructions,
          paymentStatus: 'paid',
          paymentSessionId: urlSessionId || sessionId || undefined,
          customerInfo: pendingBooking.isGuest
            ? pendingBooking.guestInfo
            : undefined,
        };

        const docRef = await addDoc(
          collection(db, 'appointments'),
          appointmentData
        );

        // Create notification for salon owner
        await createNotification(
          pendingBooking.salonOwnerId,
          'booking_confirmed',
          'New Paid Booking',
          `${pendingBooking.customerName} has booked ${pendingBooking.serviceName} on ${format(
            new Date(pendingBooking.date),
            'MMM dd, yyyy'
          )} at ${pendingBooking.time}. Payment received.`,
          docRef.id
        );

        // Create notification for customer if authenticated
        if (!pendingBooking.isGuest && currentUser) {
          await createNotification(
            currentUser.uid,
            'booking_confirmed',
            'Booking Confirmed',
            `Your booking for ${pendingBooking.serviceName} has been confirmed. Payment received.`,
            docRef.id
          );
        }

        clearPendingBooking();
        setStatus('success');
        setMessage('Payment successful! Your booking has been confirmed.');

        // Redirect to confirmation page after a short delay
        setTimeout(() => {
          navigate(`/booking-confirmation/${docRef.id}`);
        }, 2000);
      } catch (error) {
        console.error('Error creating booking:', error);
        setStatus('failed');
        setMessage('Failed to create booking. Please contact support.');
      }
    };

    processPayment();
  }, [searchParams, navigate, currentUser, createNotification]);

  const handleRetry = () => {
    clearPendingBooking();
    navigate('/salons');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-card rounded-2xl p-8 max-w-md w-full shadow-lg border border-gray-200 dark:border-dark-border text-center">
        {status === 'processing' && (
          <>
            <ArrowPathIcon className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-2">
              Processing Payment
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting to your booking...
            </p>
          </>
        )}

        {status === 'failed' && (
          <>
            <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
            <button
              onClick={handleRetry}
              className="w-full bg-primary-500 text-white py-3 rounded-xl font-semibold hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallbackPage;
