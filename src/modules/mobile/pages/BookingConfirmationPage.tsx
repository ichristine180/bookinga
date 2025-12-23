import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Appointment, Service, Salon } from '../../../types';
import { CheckCircleIcon, CalendarIcon, ClockIcon, MapPinIcon } from '@heroicons/react/16/solid';
import { format } from 'date-fns';
import { useAuth } from '../../../contexts/AuthContext';

const MobileBookingConfirmationPage: React.FC = () => {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();
    const { userProfile } = useAuth();
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [service, setService] = useState<Service | null>(null);
    const [salon, setSalon] = useState<Salon | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointmentDetails();
    }, [appointmentId]);

    const fetchAppointmentDetails = async () => {
        if (!appointmentId) return;

        try {

            const appointmentDoc = await getDoc(doc(db, 'appointments', appointmentId));
            if (appointmentDoc.exists()) {
                const appointmentData = {
                    id: appointmentDoc.id,
                    ...appointmentDoc.data(),
                    createdAt: appointmentDoc.data().createdAt?.toDate(),
                    updatedAt: appointmentDoc.data().updatedAt?.toDate(),
                } as Appointment;
                setAppointment(appointmentData);


                const serviceDoc = await getDoc(doc(db, 'services', appointmentData.serviceId));
                if (serviceDoc.exists()) {
                    setService({
                        id: serviceDoc.id,
                        ...serviceDoc.data(),
                        createdAt: serviceDoc.data().createdAt?.toDate(),
                        updatedAt: serviceDoc.data().updatedAt?.toDate(),
                    } as Service);
                }


                const salonDoc = await getDoc(doc(db, 'salons', appointmentData.salonId));
                if (salonDoc.exists()) {
                    setSalon({
                        id: salonDoc.id,
                        ...salonDoc.data(),
                        createdAt: salonDoc.data().createdAt?.toDate(),
                        updatedAt: salonDoc.data().updatedAt?.toDate(),
                        subscription: {
                            ...salonDoc.data().subscription,
                            expiresAt: salonDoc.data().subscription?.expiresAt?.toDate(),
                        },
                    } as Salon);
                }
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching appointment details:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!appointment || !service || !salon) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-4">
                        Booking Not Found
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        We couldn't find your booking details.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                    >
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col justify-center py-12 px-4">
            <div className="max-w-md mx-auto w-full">
                <div className="bg-white dark:bg-dark-card rounded-2xl shadow-lg overflow-hidden">
                    { }
                    <div className="bg-primary-500 text-white p-6 text-center">
                        <CheckCircleIcon className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
                        <p className="mt-2 opacity-90">
                            Your appointment has been successfully booked
                        </p>
                    </div>

                    { }
                    <div className="p-6 space-y-6">
                        { }
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">
                                Service Details
                            </h2>
                            <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                                <h3 className="font-medium text-gray-800 dark:text-dark-text">{service.name}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{service.description}</p>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-primary-500 font-bold text-lg">
                                        {service.currency} {service.price}
                                    </span>
                                    <span className="text-gray-500 text-sm">{service.duration / 60} hours</span>
                                </div>
                            </div>
                        </div>

                        { }
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">
                                Salon Details
                            </h2>
                            <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                                <h3 className="font-medium text-gray-800 dark:text-dark-text">{salon.name}</h3>
                                <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    <MapPinIcon className="w-4 h-4 mr-2" />
                                    <span>{salon.address.street}, {salon.address.city}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    Phone: {salon.contact.phone}
                                </p>
                            </div>
                        </div>

                        { }
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">
                                Appointment Details
                            </h2>
                            <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 space-y-3">
                                <div className="flex items-center">
                                    <CalendarIcon className="w-5 h-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-dark-text">
                                            {format(new Date(appointment.date), 'EEEE, MMMM dd, yyyy')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <ClockIcon className="w-5 h-5 text-gray-400 mr-3" />
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-dark-text">
                                            {appointment.time}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-dark-border">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Booking ID</span>
                                    <span className="font-mono text-sm text-gray-800 dark:text-dark-text">
                                        {appointment.id.slice(-8).toUpperCase()}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        { }
                        {appointment.specialInstructions && (
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-3">
                                    Special Instructions
                                </h2>
                                <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                                    <p className="text-gray-800 dark:text-dark-text">{appointment.specialInstructions}</p>
                                </div>
                            </div>
                        )}

                        { }
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <h3 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
                                Important Notes
                            </h3>
                            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                <li>• Please arrive 10 minutes before your appointment</li>
                                <li>• Bring a valid ID for verification</li>
                                <li>• You'll receive a reminder 24 hours before</li>
                                <li>• Contact the salon if you need to reschedule</li>
                            </ul>
                        </div>

                        { }
                        <div className="flex flex-col space-y-3 pt-4">
                            {userProfile ? (
                                <button
                                    onClick={() => navigate('/my-bookings')}
                                    className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                                >
                                    View My Bookings
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                                >
                                    Create Account to Track Bookings
                                </button>
                            )}

                            <button
                                onClick={() => navigate('/')}
                                className="w-full border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileBookingConfirmationPage;