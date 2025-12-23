import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../../../types';
import { ClockIcon, CurrencyDollarIcon } from '@heroicons/react/16/solid';

interface ServiceCardProps {
    service: Service;
    salonId: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, salonId }) => {
    return (
        <Link
            to={`/book/${salonId}/${service.id}`}
            className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden hover:shadow-md transition-all duration-200 block"
        >
            <div className="flex">

                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 flex-shrink-0 relative overflow-hidden">
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
                                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                            </svg>
                                        </div>
                                    `;
                                }
                            }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                    )}
                </div>


                <div className="flex-1 p-3">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-800 dark:text-dark-text line-clamp-1 text-sm">
                            {service.name}
                        </h3>
                        <div className="flex items-center ml-2 flex-shrink-0">
                            <CurrencyDollarIcon className="w-3 h-3 text-primary-500 mr-0.5" />
                            <span className="text-primary-500 font-bold text-base">
                                {service.price}
                            </span>
                        </div>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {service.description || 'Professional service with expert care'}
                    </p>

                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
                            {service.category}
                        </span>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <ClockIcon className="w-3 h-3 mr-1" />
                            <span className="text-xs">{service.duration / 60} hrs</span>
                        </div>
                    </div>


                    <div className="mt-2 pt-2 border-t border-gray-200 dark:border-dark-border">
                        <div className="flex items-center justify-center w-full">
                            <span className="text-primary-500 font-medium text-xs">
                                Book Now →
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ServiceCard;