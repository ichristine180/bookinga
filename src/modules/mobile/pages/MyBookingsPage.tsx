import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { Appointment, Service, Salon } from '../../../types';
import { CalendarIcon, ClockIcon, MapPinIcon, UserPlusIcon, UserIcon } from '@heroicons/react/16/solid';
import { format, isFuture } from 'date-fns';

interface AppointmentWithDetails extends Appointment {
    service?: Service;
    salon?: Salon;
}

const MobileMyBookingsPage: React.FC = () => {
    const { currentUser, userProfile } = useAuth();
    const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

    const isAuthenticated = currentUser && userProfile;

    useEffect(() => {
        if (isAuthenticated) {
            fetchMyBookings();
        } else {
            setLoading(false);
        }
    }, [currentUser, isAuthenticated]);

    const fetchMyBookings = async () => {
        if (!currentUser) return;

        try {
            const appointmentsQuery = query(
                collection(db, 'appointments'),
                where('customerId', '==', currentUser.uid),
                where('deleted', '==', false),
                orderBy('date', 'desc'),
                orderBy('time', 'desc')
            );

            const appointmentsSnapshot = await getDocs(appointmentsQuery);
            const appointmentsData = appointmentsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
            })) as Appointment[];

            const appointmentsWithDetails: AppointmentWithDetails[] = [];

            for (const appointment of appointmentsData) {
                try {
                    const serviceQuery = query(
                        collection(db, 'services'),
                        where('__name__', '==', appointment.serviceId)
                    );
                    const serviceSnapshot = await getDocs(serviceQuery);
                    const service = serviceSnapshot.docs[0]?.data() as Service;

                    const salonQuery = query(
                        collection(db, 'salons'),
                        where('__name__', '==', appointment.salonId)
                    );
                    const salonSnapshot = await getDocs(salonQuery);
                    const salon = salonSnapshot.docs[0]?.data() as Salon;

                    appointmentsWithDetails.push({
                        ...appointment,
                        service,
                        salon,
                    });
                } catch (error) {
                    console.error('Error fetching appointment details:', error);
                    appointmentsWithDetails.push(appointment);
                }
            }

            setAppointments(appointmentsWithDetails);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setLoading(false);
        }
    };

    const getStatusColor = (status: Appointment['status']) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'in_progress':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const isUpcoming = (appointment: Appointment) => {
        const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
        return isFuture(appointmentDateTime) || ['pending', 'confirmed'].includes(appointment.status);
    };


    if (!isAuthenticated) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CalendarIcon className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-4">
                        Track Your Bookings
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                        Create an account to view and manage all your salon appointments in one place.
                    </p>

                    <div className="space-y-4 mb-8">
                        <Link
                            to="/auth"
                            className="w-full bg-primary-500 text-white py-3 px-6 rounded-lg hover:bg-primary-600 transition-colors font-medium flex items-center justify-center"
                        >
                            <UserPlusIcon className="w-5 h-5 mr-2" />
                            Create Account
                        </Link>

                        <Link
                            to="/auth"
                            className="w-full border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors font-medium flex items-center justify-center"
                        >
                            <UserIcon className="w-5 h-5 mr-2" />
                            Sign In
                        </Link>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
                            Benefits of having an account:
                        </h3>
                        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                            <li>• View all your appointments</li>
                            <li>• Get SMS reminders</li>
                            <li>• Quick rebooking</li>
                            <li>• Appointment history</li>
                            <li>• Special offers</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="space-y-4 p-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    const upcomingBookings = appointments.filter(isUpcoming);
    const pastBookings = appointments.filter(appointment => !isUpcoming(appointment));
    const currentBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

    return (
        <div className="space-y-6">
            { }
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text">My Bookings</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Track your salon appointments
                </p>
            </div>

            { }
            <div className="flex bg-gray-100 dark:bg-dark-card rounded-lg p-1">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'upcoming'
                        ? 'bg-white dark:bg-dark-bg text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                        }`}
                >
                    Upcoming ({upcomingBookings.length})
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'past'
                        ? 'bg-white dark:bg-dark-bg text-primary-600 dark:text-primary-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                        }`}
                >
                    Past ({pastBookings.length})
                </button>
            </div>

            { }
            <div className="space-y-4">
                {currentBookings.map((appointment) => (
                    <div
                        key={appointment.id}
                        className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden"
                    >
                        <div className="p-4">
                            { }
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('_', ' ')}
                                </span>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-800 dark:text-dark-text">
                                        {format(new Date(appointment.date), 'MMM dd, yyyy')}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {appointment.time}
                                    </p>
                                </div>
                            </div>

                            { }
                            <div className="mb-3">
                                <h3 className="font-medium text-gray-800 dark:text-dark-text mb-1">
                                    {appointment.service?.name || 'Service'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {appointment.service?.description || 'No description available'}
                                </p>
                            </div>

                            { }
                            {appointment.salon && (
                                <div className="mb-3">
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                        <MapPinIcon className="w-4 h-4 mr-2" />
                                        <span>
                                            {appointment.salon.name} • {appointment.salon.address.city}
                                        </span>
                                    </div>
                                </div>
                            )}

                            { }
                            <div className="flex justify-between items-center">
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <ClockIcon className="w-4 h-4 mr-2" />
                                    <span>{appointment.duration / 60} hours</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-primary-500">
                                        {appointment.currency} {appointment.totalAmount}
                                    </p>
                                </div>
                            </div>

                            { }
                            {appointment.specialInstructions && (
                                <div className="mt-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        <span className="font-medium">Note: </span>
                                        {appointment.specialInstructions}
                                    </p>
                                </div>
                            )}

                            { }
                            {activeTab === 'upcoming' && appointment.status === 'pending' && (
                                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-dark-border">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Waiting for salon confirmation. You'll receive a notification once confirmed.
                                    </p>
                                </div>
                            )}

                            {activeTab === 'upcoming' && appointment.status === 'confirmed' && (
                                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-dark-border">
                                    <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                                        <CalendarIcon className="w-4 h-4 mr-2" />
                                        <span>Confirmed - See you at the salon!</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {currentBookings.length === 0 && (
                    <div className="text-center py-12">
                        <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-2">
                            No {activeTab} bookings
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {activeTab === 'upcoming'
                                ? "You don't have any upcoming appointments. Book one now!"
                                : "You haven't completed any appointments yet."
                            }
                        </p>
                        {activeTab === 'upcoming' && (
                            <Link
                                to="/salons"
                                className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                            >
                                Browse Salons
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileMyBookingsPage;