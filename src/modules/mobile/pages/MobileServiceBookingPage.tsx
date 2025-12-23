import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    doc,
    getDoc,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { Salon, Service } from "../../../types";
import {
    ArrowLeftIcon,
    MapPinIcon,
    StarIcon,
    ClockIcon,
    CurrencyDollarIcon,
} from "@heroicons/react/16/solid";
import { CalendarIcon } from "lucide-react";

const MobileServiceBookingPage: React.FC = () => {
    const { serviceId } = useParams<{ serviceId: string }>();
    const navigate = useNavigate();

    const [service, setService] = useState<Service | null>(null);
    const [salon, setSalon] = useState<Salon | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServiceData = async () => {
            if (!serviceId) {
                setLoading(false);
                return;
            }

            try {

                const serviceDoc = await getDoc(doc(db, "services", serviceId));
                if (serviceDoc.exists()) {
                    const serviceData = {
                        id: serviceDoc.id,
                        ...serviceDoc.data(),
                        createdAt: serviceDoc.data().createdAt?.toDate(),
                        updatedAt: serviceDoc.data().updatedAt?.toDate(),
                    } as Service;
                    setService(serviceData);


                    const salonDoc = await getDoc(doc(db, "salons", serviceData.salonId));
                    if (salonDoc.exists()) {
                        const salonData = {
                            id: salonDoc.id,
                            ...salonDoc.data(),
                            createdAt: salonDoc.data().createdAt?.toDate(),
                            updatedAt: salonDoc.data().updatedAt?.toDate(),
                            subscription: {
                                ...salonDoc.data().subscription,
                                expiresAt: salonDoc.data().subscription?.expiresAt?.toDate(),
                            },
                        } as Salon;
                        setSalon(salonData);
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching service data:", error);
                setLoading(false);
            }
        };

        fetchServiceData();
    }, [serviceId]);

    const getCurrentStatus = () => {
        if (!salon) return { isOpen: false, status: 'Unknown' };

        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const currentTime = now.toTimeString().slice(0, 5);

        const todayHours = salon.workingHours[currentDay];
        if (!todayHours || todayHours.closed) {
            return { isOpen: false, status: 'Closed today' };
        }

        const isOpen = currentTime >= todayHours.open && currentTime <= todayHours.close;
        return {
            isOpen,
            status: isOpen ? `Open • Closes at ${todayHours.close}` : `Closed • Opens at ${todayHours.open}`
        };
    };

    const handleBookNow = () => {
        if (salon && service) {
            navigate(`/book/${salon.id}/${service.id}`);
        }
    };

    const handleViewSalon = () => {
        if (salon) {
            navigate(`/salon/${salon.id}`);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
            </div>
        );
    }

    if (!service || !salon) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-2">
                    Service Not Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
                    The service you're looking for is not available.
                </p>
                <button
                    onClick={() => navigate("/salons")}
                    className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                >
                    Browse Salons
                </button>
            </div>
        );
    }

    const status = getCurrentStatus();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            <div className="space-y-6 pb-32">
                { }
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800 dark:text-dark-text">
                        Service Details
                    </h1>
                    <div className="w-9 h-9"></div>
                </div>

                { }
                <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden">
                    { }
                    <div className="h-48 bg-gray-200 dark:bg-gray-800 relative">
                        {service.images && service.images.length > 0 ? (
                            <img
                                src={service.images[0]}
                                alt={service.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            </div>
                        )}

                        { }
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-primary-500 text-white text-sm font-medium rounded-full">
                                {service.category}
                            </span>
                        </div>
                    </div>

                    { }
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-2">
                                    {service.name}
                                </h2>
                                <div className="flex items-center mb-3">
                                    <ClockIcon className="w-4 h-4 text-gray-400 mr-2" />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {service.duration / 60} hours
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex items-center text-2xl font-bold text-primary-500">
                                    <CurrencyDollarIcon className="w-6 h-6 mr-1" />
                                    <span>{service.price}</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{service.currency}</p>
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {service.description}
                        </p>
                    </div>
                </div>

                { }
                <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text">
                            Salon Information
                        </h3>
                        <button
                            onClick={handleViewSalon}
                            className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                        >
                            View Salon →
                        </button>
                    </div>

                    <div className="space-y-4">
                        { }
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-gray-800 dark:text-dark-text">
                                    {salon.name}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {salon.businessType}
                                </p>
                            </div>
                            <div className="flex items-center">
                                <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                <span className="text-sm font-medium">4.8</span>
                                <span className="text-sm text-gray-500 ml-1">(124)</span>
                            </div>
                        </div>

                        { }
                        <div className="flex items-center">
                            <MapPinIcon className="w-4 h-4 text-gray-400 mr-3" />
                            <div>
                                <p className="text-gray-800 dark:text-dark-text">
                                    {salon.address.street}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {salon.address.city}, {salon.address.state}
                                </p>
                            </div>
                        </div>

                        { }
                        <div className="flex items-center">
                            <ClockIcon className="w-4 h-4 text-gray-400 mr-3" />
                            <span className={`text-sm ${status.isOpen
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                                }`}>
                                {status.status}
                            </span>
                        </div>

                        { }
                        <p className="text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-dark-border">
                            {salon.description}
                        </p>
                    </div>
                </div>

                { }
                <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4">
                        Working Hours
                    </h3>
                    <div className="space-y-2">
                        {Object.entries(salon.workingHours).map(([day, hours]) => (
                            <div key={day} className="flex justify-between items-center">
                                <span className="capitalize text-gray-600 dark:text-gray-400 text-sm">
                                    {day}
                                </span>
                                <span className="text-sm text-gray-800 dark:text-dark-text">
                                    {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                { }
                <div className="bg-white dark:bg-dark-card rounded-xl p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text mb-4">
                        Other Services at {salon.name}
                    </h3>
                    <div className="text-center py-4">
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                            Discover more services offered by this salon
                        </p>
                        <button
                            onClick={handleViewSalon}
                            className="text-primary-500 hover:text-primary-600 font-medium text-sm"
                        >
                            View All Services →
                        </button>
                    </div>
                </div>

                { }
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
                    <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-400 mb-3">
                        Why Book With Us?
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-sm text-primary-700 dark:text-primary-300">
                                Instant Confirmation
                            </span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 6.5 15.5 8zM12 13.5l3.5-2.5v4l-3.5 2.5L8.5 15v-4l3.5 2.5z" />
                                </svg>
                            </div>
                            <span className="text-sm text-primary-700 dark:text-primary-300">
                                SMS Reminders
                            </span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                                </svg>
                            </div>
                            <span className="text-sm text-primary-700 dark:text-primary-300">
                                Easy Rebooking
                            </span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                </svg>
                            </div>
                            <span className="text-sm text-primary-700 dark:text-primary-300">
                                Quality Service
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            { }
            <div className="fixed bottom-16 left-0 right-0 p-4 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border shadow-lg">
                <button
                    onClick={handleBookNow}
                    className="w-full bg-primary-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-600 transition-colors shadow-lg flex items-center justify-center"
                >
                    <CalendarIcon className="w-6 h-6 mr-2" />
                    Book Now - {service.currency} {service.price}
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                    Select your preferred date and time in the next step
                </p>
            </div>
        </div>
    );
};

export default MobileServiceBookingPage;