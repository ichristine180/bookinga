import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';
import PhoneSelect, { PhoneValue } from '@/modules/common/PhoneSelect';
import { countries } from '@/config/countries';

interface RegisterPageProps {
    userType: UserRole;
}

const AuthRegisterPage: React.FC<RegisterPageProps> = ({ userType }) => {
    const navigate = useNavigate();
    const { register } = useAuth();


    const rwanda = countries.find(c => c.code === 'RW') || countries[0];

    const [formData, setFormData] = useState({
        displayName: '',
        phone: { country: rwanda, localNumber: '' } as PhoneValue,
        password: '',
        agreeToTerms: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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

    const validateForm = () => {
        if (!formData.displayName.trim()) {
            setError('Full name is required');
            return false;
        }

        const phoneError = validatePhone(formData.phone);
        if (phoneError) {
            setError(phoneError);
            return false;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }

        if (!formData.agreeToTerms) {
            setError('You must agree to the Terms of Service and Privacy Policy');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {

            const e164Phone = `${formData.phone.country.dialCode}${formData.phone.localNumber.replace(/\D/g, '')}`;

            await register(
                e164Phone,
                formData.password,
                formData.displayName,
                userType
            );

            navigate('/registration-success');
        } catch (error: any) {
            console.error('Registration error:', error);

            if (error.code === 'auth/phone-already-in-use') {
                setError('An account with this phone number already exists');
            } else if (error.code === 'auth/weak-password') {
                setError('Password is too weak. Please choose a stronger password');
            } else if (error.code === 'auth/invalid-phone') {
                setError('Invalid phone number');
            } else {
                setError(error.message || 'Failed to create account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-bg dark:via-dark-card dark:to-gray-900 flex flex-col overflow-hidden">
            { }
            <div className="flex items-center justify-between px-6 pt-6 pb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-primary-500 dark:text-dark-text">
                            Bookinga
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Create account
                        </p>
                    </div>
                </div>
            </div>

            { }
            <div className="flex-1 px-6 overflow-y-auto">
                <div className="max-w-sm mx-auto w-full pb-6">
                    {error && (
                        <div className="mb-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-2">
                            <p className="text-red-700 dark:text-red-400 text-xs">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label htmlFor="displayName" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Full Name *
                            </label>
                            <input
                                id="displayName"
                                name="displayName"
                                type="text"
                                required
                                value={formData.displayName}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-lg text-gray-900 dark:text-dark-text placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <PhoneSelect
                            value={formData.phone}
                            onChange={handlePhoneChange}
                            label="Phone Number"
                            required
                            error={error.includes('phone') ? error : undefined}
                        />

                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password *
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 pr-10 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-lg text-gray-900 dark:text-dark-text placeholder-gray-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-start text-xs">
                            <input
                                id="agreeToTerms"
                                name="agreeToTerms"
                                type="checkbox"
                                required
                                checked={formData.agreeToTerms}
                                onChange={handleChange}
                                className="h-3 w-3 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-0.5"
                            />
                            <label htmlFor="agreeToTerms" className="ml-2 text-gray-700 dark:text-gray-300">
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </>
                            ) : (
                                'Create account'
                            )}
                        </button>
                    </form>

                    <div className="mt-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-dark-border" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:bg-dark-bg text-gray-500">
                                    Already have an account?
                                </span>
                            </div>
                        </div>

                        <Link
                            to="/login"
                            className="w-full flex justify-center py-2.5 px-4 border border-gray-300 dark:border-dark-border rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-dark-card focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors mt-3"
                        >
                            Sign in instead
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthRegisterPage;