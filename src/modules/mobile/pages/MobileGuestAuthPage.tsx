import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';
import PhoneSelect, { PhoneValue } from '@/modules/common/PhoneSelect';
import { countries } from '@/config/countries';

const MobileGuestAuthPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const rwanda = countries.find(c => c.code === 'RW') || countries[0];

    const [isSignUp, setIsSignUp] = useState(false);
    const [loginMode, setLoginMode] = useState<'phone' | 'email'>('phone');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        displayName: '',
        email: '',
        phone: { country: rwanda, localNumber: '' } as PhoneValue,
        password: '',
        agreeToTerms: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!isSignUp) {

                let loginIdentifier: string;
                if (loginMode === 'phone') {
                    loginIdentifier = `${formData.phone.country.dialCode}${formData.phone.localNumber.replace(/\D/g, '')}`;
                } else {
                    loginIdentifier = formData.email;
                }

                await login(loginIdentifier, formData.password);
                navigate('/my-bookings');
            } else {

                if (!formData.displayName.trim()) {
                    setError('Full name is required');
                    return;
                }

                const phoneError = validatePhone(formData.phone);
                if (phoneError) {
                    setError(phoneError);
                    return;
                }

                if (formData.password.length < 6) {
                    setError('Password must be at least 6 characters');
                    return;
                }

                if (!formData.agreeToTerms) {
                    setError('You must agree to the Terms of Service and Privacy Policy');
                    return;
                }

                const e164Phone = `${formData.phone.country.dialCode}${formData.phone.localNumber.replace(/\D/g, '')}`;

                await register(
                    e164Phone,
                    formData.password,
                    formData.displayName,
                    'customer'
                );

                navigate('/my-bookings');
            }
        } catch (error: any) {
            console.error('Auth error:', error);
            setError(error.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
            <div className="max-w-md mx-auto px-4 py-6">
                { }
                <div className="text-center mb-8">

                    <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text mb-2">
                        {isSignUp ? 'Create Your Account' : 'Welcome Back!'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {isSignUp ? 'Join us to track your appointments' : 'Sign in to manage your bookings'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    { }
                    {isSignUp && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Full Name *
                            </label>
                            <input
                                name="displayName"
                                type="text"
                                required
                                value={formData.displayName}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Enter your full name"
                            />
                        </div>
                    )}

                    { }
                    {!isSignUp && (
                        <div className="flex bg-gray-100 dark:bg-dark-bg rounded-lg p-1 mb-4">
                            <button
                                type="button"
                                onClick={() => setLoginMode('phone')}
                                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${loginMode === 'phone'
                                    ? 'bg-white dark:bg-dark-card text-primary-600 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                Phone
                            </button>
                            <button
                                type="button"
                                onClick={() => setLoginMode('email')}
                                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${loginMode === 'email'
                                    ? 'bg-white dark:bg-dark-card text-primary-600 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400'
                                    }`}
                            >
                                Email
                            </button>
                        </div>
                    )}

                    { }
                    {(isSignUp || loginMode === 'phone') && (
                        <PhoneSelect
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            label="Phone Number"
                            required
                        />
                    )}

                    { }
                    {(isSignUp || loginMode === 'email') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email Address {isSignUp ? '(Optional)' : '*'}
                            </label>
                            <input
                                name="email"
                                type="email"
                                required={!isSignUp && loginMode === 'email'}
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Enter your email"
                            />
                        </div>
                    )}

                    { }
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Password *
                        </label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder={isSignUp ? "Create a password (min. 6 characters)" : "Enter your password"}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    { }
                    {isSignUp && (
                        <div className="flex items-start">
                            <input
                                name="agreeToTerms"
                                type="checkbox"
                                required
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                            />
                            <label className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                                I agree to the{' '}
                                <a href="#" className="text-primary-600 hover:text-primary-500">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-primary-600 hover:text-primary-500">
                                    Privacy Policy
                                </a>
                            </label>
                        </div>
                    )}

                    { }
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {isSignUp ? 'Creating account...' : 'Signing in...'}
                            </>
                        ) : (
                            isSignUp ? 'Create Account' : 'Sign In'
                        )}
                    </button>
                </form>

                { }
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isSignUp ? (
                            <>
                                Already have an account?{' '}
                                <button
                                    onClick={() => setIsSignUp(false)}
                                    className="text-primary-600 hover:text-primary-500 font-medium"
                                >
                                    Sign in here
                                </button>
                            </>
                        ) : (
                            <>
                                Don't have an account?{' '}
                                <button
                                    onClick={() => setIsSignUp(true)}
                                    className="text-primary-600 hover:text-primary-500 font-medium"
                                >
                                    Create one now
                                </button>
                            </>
                        )}
                    </p>
                </div>

                { }
                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors underline"
                    >
                        Continue browsing without account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileGuestAuthPage;