import React, { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Salon, Service, Staff } from '../../../types';
import { ArrowLeftIcon, StarIcon, MapPinIcon, PhoneIcon, ClockIcon, ShareIcon } from '@heroicons/react/16/solid';
import { useNavigate, useParams } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';

const SharedSalonDetailPage: React.FC = () => {
    const { salonId } = useParams<{ salonId: string }>();
    const navigate = useNavigate();
    const [salon, setSalon] = useState<Salon | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'services' | 'staff' | 'info'>('services');

    useEffect(() => {
        const fetchSalonData = async () => {
            if (!salonId) return;

            try {

                const salonDoc = await getDoc(doc(db, 'salons', salonId));
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


                const servicesQuery = query(
                    collection(db, 'services'),
                    where('salonId', '==', salonId),
                    where('isActive', '==', true)
                );
                const servicesSnapshot = await getDocs(servicesQuery);
                const servicesData = servicesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate(),
                    updatedAt: doc.data().updatedAt?.toDate(),
                })) as Service[];


                const staffQuery = query(
                    collection(db, 'staff'),
                    where('salonId', '==', salonId),
                    where('isActive', '==', true)
                );
                const staffSnapshot = await getDocs(staffQuery);
                const staffData = staffSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate(),
                })) as Staff[];

                setServices(servicesData);
                setStaff(staffData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching salon data:', error);
                setLoading(false);
            }
        };

        fetchSalonData();
    }, [salonId]);

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

    const handleShare = async () => {
        const shareData = {
            title: salon?.name,
            text: `Check out ${salon?.name} - Book your appointment now!`,
            url: window.location.href,
        };

        if (navigator.share && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (error) {

                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } else {

            await navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!salon) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col justify-center items-center px-4">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPinIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-2">
                        Salon Not Found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        The salon you're looking for doesn't exist or is no longer available.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        Explore Salons
                    </button>
                </div>
            </div>
        );
    }

    const status = getCurrentStatus();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            <div className="space-y-6 -mx-4 -mt-4">
                { }
                <div className="relative">
                    <div className="h-64 bg-gray-200 dark:bg-gray-800">
                        {salon.images && salon.images.length > 0 && (
                            <img
                                src={salon.images[0]}
                                alt={salon.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        )}
                    </div>

                    { }
                    <div className="absolute top-4 left-4 right-4 flex justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 shadow-sm hover:bg-white transition-colors"
                        >
                            <ArrowLeftIcon className="w-5 h-5" />
                        </button>

                        <button
                            onClick={handleShare}
                            className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-800 shadow-sm hover:bg-white transition-colors"
                        >
                            <ShareIcon className="w-5 h-5" />
                        </button>
                    </div>

                    { }
                    <div className="absolute bottom-4 right-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.isOpen
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                            {status.isOpen ? 'Open' : 'Closed'}
                        </span>
                    </div>
                </div>

                <div className="px-4 space-y-6">
                    { }
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text">
                                {salon.name}
                            </h1>
                            <div className="flex items-center">
                                <StarIcon className="w-5 h-5 text-yellow-500 mr-1" />
                                <span className="font-medium">4.8</span>
                                <span className="text-gray-500 ml-1">(124)</span>
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {salon.description}
                        </p>

                        <div className="space-y-2">
                            <div className="flex items-center">
                                <MapPinIcon className="w-5 h-5 text-gray-400 mr-3" />
                                <span className="text-gray-600 dark:text-gray-400">
                                    {salon.address.street}, {salon.address.city}
                                </span>
                            </div>

                            <div className="flex items-center">
                                <PhoneIcon className="w-5 h-5 text-gray-400 mr-3" />
                                <a
                                    href={`tel:${salon.contact.phone}`}
                                    className="text-gray-600 dark:text-gray-400 hover:text-primary-500 transition-colors"
                                >
                                    {salon.contact.phone}
                                </a>
                            </div>

                            <div className="flex items-center">
                                <ClockIcon className="w-5 h-5 text-gray-400 mr-3" />
                                <span className={status.isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                    {status.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    { }
                    <div className="border-b border-gray-200 dark:border-dark-border">
                        <div className="flex">
                            {[
                                { id: 'services', label: 'Services', count: services.length },
                                { id: 'staff', label: 'Staff', count: staff.length },
                                { id: 'info', label: 'Info' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex-1 py-3 text-center font-medium transition-colors relative ${activeTab === tab.id
                                        ? 'text-primary-500 border-b-2 border-primary-500'
                                        : 'text-gray-500 dark:text-gray-400'
                                        }`}
                                >
                                    {tab.label}
                                    {tab.count && tab.count > 0 && (
                                        <span className="ml-1 px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded-full">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    { }
                    {activeTab === 'services' && (
                        <div className="space-y-4">
                            {services.length > 0 ? (
                                services.map((service) => (
                                    <ServiceCard key={service.id} service={service} salonId={salon.id} />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No services available at the moment.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'staff' && (
                        <div className="grid grid-cols-2 gap-4">
                            {staff.length > 0 ? (
                                staff.map((member) => (
                                    <div key={member.id} className="bg-white dark:bg-dark-card rounded-xl p-4 shadow-sm border border-gray-200 dark:border-dark-border">
                                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-3 overflow-hidden">
                                            {member.avatar ? (
                                                <img
                                                    src={member.avatar}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-medium text-center text-gray-800 dark:text-dark-text text-sm">
                                            {member.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                                            {member.specialties.join(', ') || 'General services'}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-12">
                                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No staff members listed.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'info' && (
                        <div className="space-y-6">
                            { }
                            <div>
                                <h3 className="font-medium text-gray-800 dark:text-dark-text mb-3">
                                    Working Hours
                                </h3>
                                <div className="bg-white dark:bg-dark-card rounded-xl p-4 space-y-2 border border-gray-200 dark:border-dark-border">
                                    {Object.entries(salon.workingHours).map(([day, hours]) => (
                                        <div key={day} className="flex justify-between">
                                            <span className="capitalize text-gray-600 dark:text-gray-400">
                                                {day}
                                            </span>
                                            <span className="text-gray-800 dark:text-dark-text">
                                                {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            { }
                            <div>
                                <h3 className="font-medium text-gray-800 dark:text-dark-text mb-3">
                                    Contact Information
                                </h3>
                                <div className="bg-white dark:bg-dark-card rounded-xl p-4 space-y-3 border border-gray-200 dark:border-dark-border">
                                    <div className="flex items-center">
                                        <PhoneIcon className="w-5 h-5 text-gray-400 mr-3" />
                                        <a
                                            href={`tel:${salon.contact.phone}`}
                                            className="text-gray-800 dark:text-dark-text hover:text-primary-500 transition-colors"
                                        >
                                            {salon.contact.phone}
                                        </a>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="w-5 h-5 flex items-center justify-center mr-3 text-gray-400">@</span>
                                        <a
                                            href={`mailto:${salon.contact.email}`}
                                            className="text-gray-800 dark:text-dark-text hover:text-primary-500 transition-colors"
                                        >
                                            {salon.contact.email}
                                        </a>
                                    </div>
                                    {salon.contact.website && (
                                        <div className="flex items-center">
                                            <span className="w-5 h-5 flex items-center justify-center mr-3 text-gray-400">🌐</span>
                                            <a
                                                href={salon.contact.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary-500 hover:text-primary-600 transition-colors"
                                            >
                                                Visit Website
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            { }
                            <div>
                                <h3 className="font-medium text-gray-800 dark:text-dark-text mb-3">
                                    Location
                                </h3>
                                <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-dark-border">
                                    <div className="flex items-start">
                                        <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                                        <div>
                                            <p className="text-gray-800 dark:text-dark-text">
                                                {salon.address.street}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {salon.address.city}, {salon.address.state}
                                            </p>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                {salon.address.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            { }
                            <div>
                                <h3 className="font-medium text-gray-800 dark:text-dark-text mb-3">
                                    Business Information
                                </h3>
                                <div className="bg-white dark:bg-dark-card rounded-xl p-4 space-y-2 border border-gray-200 dark:border-dark-border">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Type:</span>
                                        <span className="text-gray-800 dark:text-dark-text capitalize">
                                            {salon.businessType?.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Capacity:</span>
                                        <span className="text-gray-800 dark:text-dark-text">
                                            {salon.capacity} clients
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    { }
                    {services.length > 0 && (
                        <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-6 border border-primary-200 dark:border-primary-800 mb-6">
                            <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-400 mb-2">
                                Ready to book?
                            </h3>
                            <p className="text-primary-700 dark:text-primary-300 text-sm mb-4">
                                Choose from our available services and book your appointment instantly.
                            </p>
                            <button
                                onClick={() => setActiveTab('services')}
                                className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
                            >
                                View Services
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SharedSalonDetailPage;