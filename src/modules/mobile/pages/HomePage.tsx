import React, { useEffect, useState } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Salon, Service } from '@/types';
import { Link } from 'react-router-dom';
import { BuildingStorefrontIcon, MapPinIcon, StarIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/16/solid';
import SearchBar from '@/modules/mobile/components/SearchBar';
import { CalendarIcon } from 'lucide-react';

const MobileHomePage: React.FC = () => {
    const [nearbyMobileSalons, setNearbyMobileSalons] = useState<Salon[]>([]);
    const [popularServices, setPopularServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const salonsQuery = query(
                    collection(db, 'salons'),
                    where('isActive', '==', true),
                    where('approvalStatus', '==', 'approved'),
                    limit(6)
                );
                const salonsSnapshot = await getDocs(salonsQuery);
                const salons = salonsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate(),
                    updatedAt: doc.data().updatedAt?.toDate(),
                    subscription: {
                        ...doc.data().subscription,
                        expiresAt: doc.data().subscription?.expiresAt?.toDate(),
                    },
                })) as Salon[];

                const servicesQuery = query(
                    collection(db, 'services'),
                    where('isActive', '==', true),
                    limit(12)
                );
                const servicesSnapshot = await getDocs(servicesQuery);
                const services = servicesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate(),
                    updatedAt: doc.data().updatedAt?.toDate(),
                })) as Service[];

                setNearbyMobileSalons(salons);
                setPopularServices(services);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                <div className="grid grid-cols-2 gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-36 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <SearchBar />


            <div className="grid grid-cols-2 gap-3">
                <Link
                    to="/salons"
                    className="bg-primary-500 text-white p-4 rounded-xl text-center hover:bg-primary-600 transition-colors"
                >
                    <BuildingStorefrontIcon className="w-6 h-6 mx-auto mb-2" />
                    <span className="font-medium text-sm">Find Salons</span>
                </Link>
                <Link
                    to="/my-bookings"
                    className="bg-secondary-500 text-white p-4 rounded-xl text-center hover:bg-secondary-600 transition-colors"
                >
                    <CalendarIcon className="w-6 h-6 mx-auto mb-2" />
                    <span className="font-medium text-sm">My Bookings</span>
                </Link>
            </div>


            <div>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold font-montserrat text-gray-800 dark:text-dark-text">
                        Popular Services
                    </h2>
                    <Link
                        to="/salons"
                        className="text-primary-500 text-sm font-medium"
                    >
                        See All
                    </Link>
                </div>

                <div className="space-y-3">
                    {popularServices.slice(0, 6).map((service) => (
                        <Link
                            key={service.id}
                            to={`/book-service/${service.id}`}
                            className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden hover:shadow-md transition-all duration-200 block"
                        >
                            <div className="flex p-4">

                                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-lg mr-4 overflow-hidden flex-shrink-0">
                                    {service.images && service.images.length > 0 ? (
                                        <img
                                            src={service.images[0]}
                                            alt={service.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                                                if (target.parentElement) {
                                                    target.parentElement.innerHTML = `
                                                        <div class="flex items-center justify-center h-full text-gray-400">
                                                            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                                            </svg>
                                                        </div>
                                                    `;
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>


                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-gray-800 dark:text-dark-text text-base line-clamp-1">
                                            {service.name}
                                        </h3>
                                        <div className="flex items-center ml-2 flex-shrink-0">
                                            <CurrencyDollarIcon className="w-4 h-4 text-primary-500 mr-1" />
                                            <span className="text-primary-500 font-bold text-lg">
                                                {service.price}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                                        {service.description || 'Professional service with expert care'}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 px-2 py-1 rounded-full">
                                            {service.category}
                                        </span>
                                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                                            <ClockIcon className="w-3 h-3 mr-1" />
                                            <span className="text-xs">{service.duration / 60} hrs</span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="px-4 pb-4">
                                <div className="w-full bg-primary-500 text-white py-2 rounded-lg text-center">
                                    <span className="font-medium text-sm">Book Now</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>


            <div>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold font-montserrat text-gray-800 dark:text-dark-text">
                        Nearby Salons
                    </h2>
                    <Link
                        to="/salons"
                        className="text-primary-500 text-sm font-medium"
                    >
                        See All
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {nearbyMobileSalons.slice(0, 4).map((salon) => (
                        <Link
                            key={salon.id}
                            to={`/salon/${salon.id}`}
                            className="bg-white dark:bg-dark-card rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="h-24 bg-gray-200 dark:bg-gray-800 relative">
                                {salon.images && salon.images[0] && (
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
                                <div className="absolute top-1.5 right-1.5 bg-white/90 px-1.5 py-0.5 rounded-full flex items-center">
                                    <StarIcon className="w-3 h-3 text-yellow-500 mr-0.5" />
                                    <span className="text-xs font-medium">4.8</span>
                                </div>
                            </div>
                            <div className="p-3">
                                <h3 className="font-medium text-gray-800 dark:text-dark-text text-sm line-clamp-1">
                                    {salon.name}
                                </h3>
                                <div className="flex items-center mt-1">
                                    <MapPinIcon className="w-3 h-3 text-gray-400 mr-1" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                        {salon.address.city}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {salon.businessType}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>


            <div>
                <h2 className="text-lg font-bold font-montserrat text-gray-800 dark:text-dark-text mb-3">
                    Browse by Category
                </h2>

                <div className="grid grid-cols-3 gap-3">
                    {[
                        { name: 'Hair', icon: '💇‍♀️', category: 'Hair Styling' },
                        { name: 'Nails', icon: '💅', category: 'Nail Care' },
                        { name: 'Facial', icon: '🧴', category: 'Facial' },
                        { name: 'Massage', icon: '💆‍♀️', category: 'Massage' },
                        { name: 'Makeup', icon: '💄', category: 'Makeup' },
                        { name: 'Spa', icon: '🛀', category: 'Spa' },
                    ].map((category) => (
                        <Link
                            key={category.category}
                            to={`/salons?category=${encodeURIComponent(category.category)}`}
                            className="bg-white dark:bg-dark-card rounded-xl p-4 text-center hover:shadow-md transition-shadow border border-gray-200 dark:border-dark-border"
                        >
                            <div className="text-2xl mb-2">{category.icon}</div>
                            <span className="text-sm font-medium text-gray-800 dark:text-dark-text">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>


            <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
                <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-400 mb-3 text-center">
                    Why Choose Bookinga?
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-sm text-primary-700 dark:text-primary-300 font-medium">
                            Instant Booking
                        </span>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <span className="text-sm text-primary-700 dark:text-primary-300 font-medium">
                            SMS Reminders
                        </span>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <StarIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm text-primary-700 dark:text-primary-300 font-medium">
                            Top Salons
                        </span>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-2">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                        <span className="text-sm text-primary-700 dark:text-primary-300 font-medium">
                            Easy Rebooking
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileHomePage;