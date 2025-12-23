import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { useCloudinaryUpload } from '../../../hooks/useCloudinaryUpload';
import { Salon } from '../../../types';
import {
    BuildingStorefrontIcon,
    PhotoIcon,
    ClockIcon,
    PhoneIcon,
    MapPinIcon,
    XMarkIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    EnvelopeIcon,
    GlobeAltIcon,
    CheckIcon,
    ExclamationCircleIcon,
    CameraIcon,
} from '@heroicons/react/16/solid';

interface BusinessInfoFormData {
    name: string;
    description: string;
    businessType: string;
    capacity: number;

    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;

    phone: string;
    email: string;
    website: string;

    images: string[];

    workingHours: {
        [key: string]: {
            open: string;
            close: string;
            closed: boolean;
        };
    };
}

const SalonBusinessInfoPage: React.FC = () => {
    const { userProfile } = useAuth();
    const { uploadImage, uploading, error: uploadError } = useCloudinaryUpload();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [expandedSections, setExpandedSections] = useState({
        basic: true,
        address: false,
        contact: false,
        images: false,
        hours: false,
    });

    const [formData, setFormData] = useState<BusinessInfoFormData>({
        name: '',
        description: '',
        businessType: '',
        capacity: 1,
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: '',
        email: '',
        website: '',
        images: [],
        workingHours: {
            monday: { open: '09:00', close: '17:00', closed: false },
            tuesday: { open: '09:00', close: '17:00', closed: false },
            wednesday: { open: '09:00', close: '17:00', closed: false },
            thursday: { open: '09:00', close: '17:00', closed: false },
            friday: { open: '09:00', close: '17:00', closed: false },
            saturday: { open: '09:00', close: '17:00', closed: false },
            sunday: { open: '09:00', close: '17:00', closed: true },
        }
    });

    const businessTypes = [
        'Hair Salon',
        'Beauty Salon',
        'Spa',
        'Barbershop',
        'Nail Salon',
        'Massage Therapy',
        'Medical Spa',
        'Wellness Center',
        'Other'
    ];

    const daysOfWeek = [
        { key: 'monday', label: 'Mon', fullLabel: 'Monday' },
        { key: 'tuesday', label: 'Tue', fullLabel: 'Tuesday' },
        { key: 'wednesday', label: 'Wed', fullLabel: 'Wednesday' },
        { key: 'thursday', label: 'Thu', fullLabel: 'Thursday' },
        { key: 'friday', label: 'Fri', fullLabel: 'Friday' },
        { key: 'saturday', label: 'Sat', fullLabel: 'Saturday' },
        { key: 'sunday', label: 'Sun', fullLabel: 'Sunday' },
    ];

    useEffect(() => {
        fetchSalonData();
    }, [userProfile?.salonId]);

    const fetchSalonData = async () => {
        if (!userProfile?.salonId) return;

        try {
            const salonDoc = await getDoc(doc(db, 'salons', userProfile.salonId));
            if (salonDoc.exists()) {
                const salonData = {
                    id: salonDoc.id,
                    ...salonDoc.data(),
                    createdAt: salonDoc.data().createdAt?.toDate() || new Date(),
                    updatedAt: salonDoc.data().updatedAt?.toDate() || new Date(),
                } as Salon;

                setFormData({
                    name: salonData.name || '',
                    description: salonData.description || '',
                    businessType: salonData.businessType || '',
                    capacity: salonData.capacity || 1,
                    street: salonData.address?.street || '',
                    city: salonData.address?.city || '',
                    state: salonData.address?.state || (salonData.address && (salonData.address as any).province) || '',
                    zipCode: salonData.address?.zipCode || '',
                    country: salonData.address?.country || '',
                    phone: salonData.contact?.phone || '',
                    email: salonData.contact?.email || '',
                    website: salonData.contact?.website || '',
                    images: Array.isArray(salonData.images) ? salonData.images : [],
                    workingHours: salonData.workingHours || {
                        monday: { open: '09:00', close: '17:00', closed: false },
                        tuesday: { open: '09:00', close: '17:00', closed: false },
                        wednesday: { open: '09:00', close: '17:00', closed: false },
                        thursday: { open: '09:00', close: '17:00', closed: false },
                        friday: { open: '09:00', close: '17:00', closed: false },
                        saturday: { open: '09:00', close: '17:00', closed: false },
                        sunday: { open: '09:00', close: '17:00', closed: true },
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching salon data:', error);
            setMessage({ type: 'error', text: 'Failed to load salon information' });
        } finally {
            setLoading(false);
        }
    };

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleWorkingHourChange = (day: string, field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                [day]: {
                    ...prev.workingHours[day],
                    [field]: value
                }
            }
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const imageUrl = await uploadImage(file, 'salon-images');
            if (imageUrl) {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, imageUrl]
                }));
                setMessage({ type: 'success', text: 'Image uploaded successfully' });
                setTimeout(() => setMessage(null), 3000);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setMessage({ type: 'error', text: uploadError || 'Failed to upload image' });
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userProfile?.salonId) return;

        setSaving(true);
        setMessage(null);

        try {
            const updateData = {
                name: formData.name,
                description: formData.description,
                businessType: formData.businessType,
                capacity: formData.capacity,
                address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode,
                    country: formData.country,
                },
                contact: {
                    phone: formData.phone,
                    email: formData.email,
                    website: formData.website,
                },
                images: formData.images,
                workingHours: formData.workingHours,
                updatedAt: new Date(),
            };

            await updateDoc(doc(db, 'salons', userProfile.salonId), updateData);

            setMessage({ type: 'success', text: 'Business information updated successfully!' });
            setTimeout(() => setMessage(null), 5000);
            await fetchSalonData();
        } catch (error) {
            console.error('Error updating salon:', error);
            setMessage({ type: 'error', text: 'Failed to update business information' });
        } finally {
            setSaving(false);
        }
    };

    const getSectionProgress = (section: string) => {
        switch (section) {
            case 'basic':
                return formData.name && formData.businessType ? 100 : 50;
            case 'address':
                const addressFields = [formData.street, formData.city, formData.state, formData.country];
                return (addressFields.filter(Boolean).length / addressFields.length) * 100;
            case 'contact':
                const contactFields = [formData.phone, formData.email];
                return (contactFields.filter(Boolean).length / contactFields.length) * 100;
            case 'images':
                return formData.images.length > 0 ? 100 : 0;
            case 'hours':
                return 100;
            default:
                return 0;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-dark-bg p-6">
                <div className="p-4 space-y-4">
                    <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-dark-bg min-h-screen">
            <div className="bg-white sticky top-0 dark:bg-dark-card border-b border-gray-200 dark:border-dark-border p-6">
                <h1 className="text-lg font-bold text-gray-800 dark:text-dark-text">Business Information</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage your salon's details and settings
                </p>

                {message && (
                    <div className={`mt-4 p-3 rounded-lg flex items-center ${message.type === 'success'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {message.type === 'success' ? (
                            <CheckIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                        ) : (
                            <ExclamationCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                        )}
                        <span className="text-sm">{message.text}</span>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4 pb-24">
                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
                    <button
                        type="button"
                        onClick={() => toggleSection('basic')}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors"
                    >
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-3">
                                <BuildingStorefrontIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="text-left">
                                <h2 className="text-sm font-semibold text-gray-800 dark:text-dark-text">Basic Information</h2>
                                <div className="flex items-center mt-1">
                                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mr-2">
                                        <div
                                            className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                                            style={{ width: `${getSectionProgress('basic')}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {getSectionProgress('basic')}% complete
                                    </span>
                                </div>
                            </div>
                        </div>
                        {expandedSections.basic ? (
                            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                        )}
                    </button>

                    {expandedSections.basic && (
                        <div className="border-t border-gray-100 dark:border-gray-700 p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Salon Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter your salon name"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Business Type *
                                </label>
                                <select
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                >
                                    <option value="">Select Business Type</option>
                                    {businessTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Capacity (Number of customers)
                                </label>
                                <input
                                    type="number"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleInputChange}
                                    min="1"
                                    max="100"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    placeholder="Describe your salon and services..."
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
                    <button
                        type="button"
                        onClick={() => toggleSection('address')}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors"
                    >
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-3">
                                <MapPinIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="text-left">
                                <h2 className="text-sm font-semibold text-gray-800 dark:text-dark-text">Address</h2>
                                <div className="flex items-center mt-1">
                                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mr-2">
                                        <div
                                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                            style={{ width: `${getSectionProgress('address')}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {getSectionProgress('address')}% complete
                                    </span>
                                </div>
                            </div>
                        </div>
                        {expandedSections.address ? (
                            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                        )}
                    </button>

                    {expandedSections.address && (
                        <div className="border-t border-gray-100 dark:border-gray-700 p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Street Address
                                </label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    placeholder="123 Main Street"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="City"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        State/Province
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        placeholder="State"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        ZIP/Postal Code
                                    </label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        placeholder="12345"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        placeholder="Country"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
                    <button
                        type="button"
                        onClick={() => toggleSection('contact')}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors"
                    >
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-3">
                                <PhoneIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="text-left">
                                <h2 className="text-sm font-semibold text-gray-800 dark:text-dark-text">Contact Information</h2>
                                <div className="flex items-center mt-1">
                                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mr-2">
                                        <div
                                            className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                                            style={{ width: `${getSectionProgress('contact')}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {getSectionProgress('contact')}% complete
                                    </span>
                                </div>
                            </div>
                        </div>
                        {expandedSections.contact ? (
                            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                        )}
                    </button>

                    {expandedSections.contact && (
                        <div className="border-t border-gray-100 dark:border-gray-700 p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+1 (555) 123-4567"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="salon@example.com"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Website (optional)
                                </label>
                                <div className="relative">
                                    <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        placeholder="https://www.yoursalon.com"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
                    <button
                        type="button"
                        onClick={() => toggleSection('images')}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors"
                    >
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                                <PhotoIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="text-left">
                                <h2 className="text-sm font-semibold text-gray-800 dark:text-dark-text">Salon Images</h2>
                                <div className="flex items-center mt-1">
                                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mr-2">
                                        <div
                                            className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                                            style={{ width: `${getSectionProgress('images')}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {formData.images.length} images
                                    </span>
                                </div>
                            </div>
                        </div>
                        {expandedSections.images ? (
                            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                        )}
                    </button>

                    {expandedSections.images && (
                        <div className="border-t border-gray-100 dark:border-gray-700 p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    Upload Images
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${uploading
                                            ? 'border-gray-300 bg-gray-50 cursor-not-allowed'
                                            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-gray-800'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {uploading ? (
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                                            ) : (
                                                <CameraIcon className="w-8 h-8 text-gray-400 mb-2" />
                                            )}
                                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                                {uploading ? 'Uploading...' : 'Tap to upload image'}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">
                                                PNG, JPG up to 10MB
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {formData.images.length > 0 && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Uploaded Images ({formData.images.length})
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {formData.images.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={image}
                                                    alt={`Salon image ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                </button>
                                                {index === 0 && (
                                                    <div className="absolute bottom-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded">
                                                        Cover
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
                    <button
                        type="button"
                        onClick={() => toggleSection('hours')}
                        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors"
                    >
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center mr-3">
                                <ClockIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div className="text-left">
                                <h2 className="text-sm font-semibold text-gray-800 dark:text-dark-text">Working Hours</h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {Object.values(formData.workingHours).filter(day => !day.closed).length} days open
                                </p>
                            </div>
                        </div>
                        {expandedSections.hours ? (
                            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                        )}
                    </button>

                    {expandedSections.hours && (
                        <div className="border-t border-gray-100 dark:border-gray-700 p-4 space-y-3">
                            {daysOfWeek.map(day => (
                                <div key={day.key} className="bg-gray-50 dark:bg-dark-bg rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {day.fullLabel}
                                        </span>
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={!formData.workingHours[day.key]?.closed}
                                                onChange={(e) => handleWorkingHourChange(day.key, 'closed', !e.target.checked)}
                                                className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Open</span>
                                        </label>
                                    </div>

                                    {!formData.workingHours[day.key]?.closed && (
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                    Opening Time
                                                </label>
                                                <input
                                                    type="time"
                                                    value={formData.workingHours[day.key]?.open || '09:00'}
                                                    onChange={(e) => handleWorkingHourChange(day.key, 'open', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                    Closing Time
                                                </label>
                                                <input
                                                    type="time"
                                                    value={formData.workingHours[day.key]?.close || '17:00'}
                                                    onChange={(e) => handleWorkingHourChange(day.key, 'close', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {formData.workingHours[day.key]?.closed && (
                                        <div className="text-center py-2">
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Closed</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </form>

            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-card border-t border-gray-200 dark:border-dark-border p-4 safe-bottom">
                <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={saving || uploading}
                    className="w-full py-3 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
                >
                    {saving ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Saving Changes...
                        </>
                    ) : (
                        <>
                            <CheckIcon className="w-5 h-5 mr-2" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default SalonBusinessInfoPage;