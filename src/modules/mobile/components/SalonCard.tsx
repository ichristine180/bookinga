import React from 'react';
import { Link } from 'react-router-dom';
import { Salon } from '../../../types';
import { MapPinIcon, StarIcon, ClockIcon, BuildingStorefrontIcon } from '@heroicons/react/16/solid';

interface SalonCardProps {
    salon: Salon;
}

const SalonCard: React.FC<SalonCardProps> = ({ salon }) => {
    const getCurrentStatus = () => {
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

    const status = getCurrentStatus();

    return (
        <Link
            to={`/salon/${salon.id}`}
            className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden hover:shadow-md transition-all duration-200 block"
        >

            <div className="h-36 bg-gray-200 dark:bg-gray-800 relative overflow-hidden">
                {salon.images && salon.images.length > 0 ? (
                    <img
                        src={salon.images[0]}
                        alt={salon.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                            if (target.parentElement) {
                                target.parentElement.innerHTML = `
                                    <div class="flex flex-col items-center justify-center h-full text-gray-400">
                                        <svg class="w-10 h-10 mb-2" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                        </svg>
                                        <span class="text-sm">${salon.name}</span>
                                    </div>
                                `;
                            }
                        }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <BuildingStorefrontIcon className="w-10 h-10 mb-2" />
                        <span className="text-sm">{salon.name}</span>
                    </div>
                )}


                <div className="absolute top-2 right-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.isOpen
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {status.isOpen ? 'Open' : 'Closed'}
                    </span>
                </div>
            </div>


            <div className="p-3">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-base text-gray-800 dark:text-dark-text line-clamp-1">
                        {salon.name}
                    </h3>
                    <div className="flex items-center ml-2">
                        <StarIcon className="w-3 h-3 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">4.5</span>
                    </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {salon.description}
                </p>

                <div className="space-y-1.5">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPinIcon className="w-3 h-3 mr-2 text-gray-400" />
                        <span className="line-clamp-1">
                            {salon.address.street}, {salon.address.city}
                        </span>
                    </div>

                    <div className="flex items-center text-sm">
                        <ClockIcon className="w-3 h-3 mr-2 text-gray-400" />
                        <span className={status.isOpen ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {status.status}
                        </span>
                    </div>
                </div>


                <div className="mt-2.5 pt-2.5 border-t border-gray-200 dark:border-dark-border">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
                        {salon.businessType || 'Salon'}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default SalonCard;