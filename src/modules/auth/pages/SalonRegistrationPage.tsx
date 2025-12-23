import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, SalonRegistrationData } from '@/contexts/AuthContext';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import SalonRegistrationPersonalInfo from '../components/SalonRegistrationPersonalInfo';
import SalonRegistrationSalonDetails from '../components/SalonRegistrationSalonDetails';
import SalonRegistrationLocation from '../components/SalonRegistrationLocation';
import SalonRegistrationServices from '../components/SalonRegistrationServices';
import SalonRegistrationReview from '../components/SalonRegistrationReview';
import { PhoneValue } from '@/modules/common/PhoneSelect';
import { countries } from '@/config/countries';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface ServiceFormData {
    name: string;
    description: string;
    category: string;
    price: number;
    duration: number;
    currency: string;
}

export interface SalonFormData {
    displayName: string;
    email: string;
    password: string;
    phone: PhoneValue;
    salonName: string;
    description: string;
    businessType: string;
    tinNumber: string;
    capacity: number;
    province: string;
    city: string;
    country: string;
    website: string;
    workingHours: {
        [key: string]: {
            open: string;
            close: string;
            closed: boolean;
        };
    };
    services: ServiceFormData[];
    agreeToTerms: boolean;
}

const SalonRegistrationPage: React.FC = () => {
    const navigate = useNavigate();
    const { registerSalonAdmin } = useAuth();


    const rwanda = countries.find(c => c.code === 'RW') || countries[0];

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState<SalonFormData>({
        displayName: '',
        email: '',
        password: '',
        phone: { country: rwanda, localNumber: '' },
        salonName: '',
        description: '',
        businessType: 'hair_salon',
        tinNumber: '',
        capacity: 10,
        province: '',
        city: '',
        country: 'Rwanda',
        website: '',
        workingHours: {
            monday: { open: '09:00', close: '18:00', closed: false },
            tuesday: { open: '09:00', close: '18:00', closed: false },
            wednesday: { open: '09:00', close: '18:00', closed: false },
            thursday: { open: '09:00', close: '18:00', closed: false },
            friday: { open: '09:00', close: '18:00', closed: false },
            saturday: { open: '09:00', close: '18:00', closed: false },
            sunday: { open: '10:00', close: '16:00', closed: true },
        },
        services: [
            {
                name: 'Hair Cut & Style',
                description: 'Professional haircut and styling',
                category: 'Hair Styling',
                price: 15000,
                duration: 1,
                currency: 'RWF'
            }
        ],
        agreeToTerms: false,
    });

    const businessTypes = [
        { value: 'hair_salon', label: 'Hair Salon' },
        { value: 'beauty_salon', label: 'Beauty Salon' },
        { value: 'nail_salon', label: 'Nail Salon' },
        { value: 'spa', label: 'Spa & Wellness' },
        { value: 'barbershop', label: 'Barbershop' },
        { value: 'full_service', label: 'Full Service Salon' },
    ];

    const serviceCategories = [
        'Hair Styling', 'Hair Coloring', 'Hair Treatment', 'Nail Care',
        'Manicure', 'Pedicure', 'Facial', 'Massage', 'Eyebrow & Lashes',
        'Makeup', 'Skin Care',
    ];

    const stepTitles = [
        'Personal Info',
        'Salon Details',
        'Location',
        'Services',
        'Review'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked,
            }));
        } else if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: Number(value),
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    const handleServiceChange = (index: number, field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.map((service, i) =>
                i === index ? { ...service, [field as keyof ServiceFormData]: value } : service
            ),
        }));
    }

    const addService = () => {
        setFormData(prev => ({
            ...prev,
            services: [
                ...prev.services,
                {
                    name: '',
                    description: '',
                    category: serviceCategories[0],
                    price: 0,
                    duration: 1,
                    currency: 'RWF'
                }
            ],
        }));
    };

    const removeService = (index: number) => {
        if (formData.services.length > 1) {
            setFormData(prev => ({
                ...prev,
                services: prev.services.filter((_, i) => i !== index),
            }));
        }
    };

    const handlePhoneChange = (phone: PhoneValue) => {
        setFormData(prev => ({
            ...prev,
            phone,
        }));
    };


    const validatePhone = (phone: PhoneValue): string | null => {
        if (!phone.localNumber.trim()) {
            return 'Phone number is required';
        }

        const localNumber = phone.localNumber.replace(/\D/g, '');
        const validLengths = Array.isArray(phone.country.phoneLength.mobile)
            ? phone.country.phoneLength.mobile
            : [phone.country.phoneLength.mobile];

        if (!validLengths.includes(localNumber.length)) {
            return `Phone number must be ${validLengths.join(' or ')} digits for ${phone.country.name}`;
        }

        return null;
    };

    const validateStep = (step: number): boolean => {
        setError('');

        switch (step) {
            case 1:
                if (!formData.displayName.trim()) {
                    setError('Full name is required');
                    return false;
                }
                if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
                    setError('Valid email is required');
                    return false;
                }
                if (formData.password.length < 6) {
                    setError('Password must be at least 6 characters');
                    return false;
                }
                const phoneError = validatePhone(formData.phone);
                if (phoneError) {
                    setError(phoneError);
                    return false;
                }
                return true;

            case 2:
                if (!formData.salonName.trim()) {
                    setError('Salon name is required');
                    return false;
                }
                if (!formData.description.trim()) {
                    setError('Salon description is required');
                    return false;
                }
                if (formData.capacity < 1) {
                    setError('Capacity must be at least 1');
                    return false;
                }
                return true;

            case 3:
                if (!formData.province.trim() || !formData.city.trim()) {
                    setError('Province and city are required');
                    return false;
                }
                return true;

            case 4:
                const hasValidServices = formData.services.every(service =>
                    service.name.trim() && service.description.trim() && service.price > 0
                );
                if (!hasValidServices) {
                    setError('All services must have valid name, description, and price');
                    return false;
                }
                return true;

            case 5:
                if (!formData.agreeToTerms) {
                    setError('You must agree to the terms and conditions');
                    return false;
                }
                return true;

            default:
                return true;
        }
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 5));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep(5)) return;

        setLoading(true);
        setError('');

        try {

            const phoneNumber = `${formData.phone.country.dialCode}${formData.phone.localNumber.replace(/\D/g, '')}`;
            const salonsRef = collection(db, 'salons');
            const q = query(salonsRef, where('contact.phone', '==', phoneNumber));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setError('A salon with this phone number already exists.');
                setLoading(false);
                return;
            }

            const salonData = {
                salonName: formData.salonName,
                description: formData.description,
                businessType: formData.businessType,
                tinNumber: formData.tinNumber,
                capacity: formData.capacity,
                province: formData.province,
                city: formData.city,
                country: formData.country,
                phone: phoneNumber,
                website: formData.website,
                workingHours: formData.workingHours,
                services: formData.services.map(service => ({
                    ...service,
                    duration: service.duration * 60
                })),
            } as SalonRegistrationData;

            await registerSalonAdmin(
                formData.email,
                formData.password,
                formData.displayName,
                salonData
            );

            navigate('/registration-success');
        } catch (error: any) {
            console.error('Registration error:', error);
            setError(error.message || 'Failed to register salon. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <SalonRegistrationPersonalInfo
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handlePhoneChange={handlePhoneChange}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                    />
                );
            case 2:
                return (
                    <SalonRegistrationSalonDetails
                        formData={formData}
                        handleInputChange={handleInputChange}
                        businessTypes={businessTypes}
                    />
                );
            case 3:
                return (
                    <SalonRegistrationLocation
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                );
            case 4:
                return (
                    <SalonRegistrationServices
                        formData={formData}
                        serviceCategories={serviceCategories}
                        handleServiceChange={handleServiceChange}
                        addService={addService}
                        removeService={removeService}
                    />
                );
            case 5:
                return (
                    <SalonRegistrationReview
                        formData={formData}
                        handleInputChange={handleInputChange}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-bg dark:via-dark-card dark:to-gray-900  flex-col overflow-hidden">
            { }
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <button
                    onClick={() => navigate('/login')}
                    className="p-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-primary-500 dark:text-dark-text">
                            Salon Registration
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {stepTitles[currentStep - 1]}
                        </p>
                    </div>
                </div>
                <div className="w-6"> { }</div>
            </div>

            { }
            <div className="px-6 pb-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Step {currentStep} of 5
                    </span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {Math.round((currentStep / 5) * 100)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-1.5">
                    <div
                        className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / 5) * 100}%` }}
                    />
                </div>
            </div>

            { }
            {error && (
                <div className="mx-6 mb-3 p-2 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                </div>
            )}

            { }
            <div className="flex-1 px-6 overflow-y-auto min-h-0">
                <div className="max-w-sm mx-auto w-full pb-8 overflow-y-auto max-h-[80vh] sm:max-h-none">
                    {renderStepContent()}
                </div>
            </div>

            { }
            <div className="px-6 pb-6 sticky bottom-0 bg-gradient-to-t from-white/90 via-white/80 to-transparent dark:from-dark-bg/90 dark:via-dark-card/80 dark:to-transparent z-10">
                <div className="flex justify-between space-x-2 max-w-sm mx-auto">
                    {currentStep > 1 && (
                        <button
                            onClick={prevStep}
                            className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-bg border border-gray-300 dark:border-dark-border rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                            <ChevronLeftIcon className="w-4 h-4 mr-1" />
                            Previous
                        </button>
                    )}

                    {currentStep < 5 ? (
                        <button
                            onClick={nextStep}
                            className="flex items-center px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium ml-auto"
                        >
                            Next
                            <ChevronRightIcon className="w-4 h-4 ml-1" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex items-center px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium ml-auto"
                        >
                            {loading ? 'Creating...' : 'Complete'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalonRegistrationPage;