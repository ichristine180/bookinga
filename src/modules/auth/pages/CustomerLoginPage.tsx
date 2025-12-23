import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';
import { useAuth } from '../../../contexts/AuthContext';
import PhoneSelect, { PhoneValue } from '@/modules/common/PhoneSelect';
import { countries } from '@/config/countries';

const AuthCustomerLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const rwanda = countries.find(c => c.code === 'RW') || countries[0];

    const [loginMode, setLoginMode] = useState<'email' | 'phone'>('email');
    const [formData, setFormData] = useState({
        email: '',
        phone: { country: rwanda, localNumber: '' } as PhoneValue,
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handlePhoneChange = (phone: PhoneValue) => {
        setFormData(prev => ({
            ...prev,
            phone,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let loginIdentifier: string;

            if (loginMode === 'phone') {

                loginIdentifier = `${formData.phone.country.dialCode}${formData.phone.localNumber.replace(/\D/g, '')}`;
            } else {
                loginIdentifier = formData.email;
            }

            await login(loginIdentifier, formData.password);
            navigate('/');
        } catch (error: any) {
            console.error('Login error:', error);

            if (error.message.includes('rejected')) {
                setError(error.message);
            } else if (error.message.includes('user-not-found')) {
                setError(`No account found with this ${loginMode === 'phone' ? 'phone number' : 'email address'}.`);
            } else if (error.message.includes('wrong-password')) {
                setError('Incorrect password. Please try again.');
            } else if (error.message.includes('invalid-email')) {
                setError('Please enter a valid email address.');
            } else if (error.message.includes('too-many-requests')) {
                setError('Too many failed login attempts. Please try again later.');
            } else {
                setError(error.message || 'Failed to sign in. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-dark-bg dark:via-dark-card dark:to-gray-900  flex-col overflow-hidden">
            { }
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
                            Sign in to your account
                        </p>
                    </div>
                </div>
            </div>


            { }
            <div className="flex-1 px-6 flex flex-col ">
                <div className="max-w-sm mx-auto w-full">
                    {error && (
                        <div className="mb-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-2">
                            <p className="text-red-700 dark:text-red-400 text-xs">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-3">
                        { }
                        <div className="flex bg-gray-100 dark:bg-dark-bg rounded-lg p-1">
                            <button
                                type="button"
                                onClick={() => setLoginMode('email')}
                                className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors ${loginMode === 'email'
                                    ? 'bg-white dark:bg-dark-card text-primary-600 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                    }`}
                            >
                                Email
                            </button>
                            <button
                                type="button"
                                onClick={() => setLoginMode('phone')}
                                className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors ${loginMode === 'phone'
                                    ? 'bg-white dark:bg-dark-card text-primary-600 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                    }`}
                            >
                                Phone Number
                            </button>
                        </div>

                        {loginMode === 'email' ? (
                            <div>
                                <label htmlFor="email" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-lg text-gray-900 dark:text-dark-text placeholder-gray-500  focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                                    placeholder="Enter your email"
                                />
                            </div>
                        ) : (
                            <PhoneSelect
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                label="Phone Number"
                                required
                            />
                        )}

                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 pr-10 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-lg text-gray-900 dark:text-dark-text placeholder-gray-500  focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                                    placeholder="Enter your password"
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

                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-3 w-3 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-gray-900 dark:text-gray-300">
                                    Remember me
                                </span>
                            </label>
                            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none  focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
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
                                    Or
                                </span>
                            </div>
                        </div>

                        <Link
                            to="/register"
                            className="w-full flex justify-center py-2.5 px-4 border border-gray-300 dark:border-dark-border rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-dark-card focus:outline-none  focus:ring-offset-2 focus:ring-primary-500 transition-colors mt-3"
                        >
                            Create account
                        </Link>
                    </div>
                </div>
            </div>

            { }
            <div className="px-6 pb-6 pt-6">
                <div className="max-w-sm mx-auto">
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center mb-2">
                        Business owner?
                    </p>
                    <div className="flex items-center justify-center">
                        <Link
                            to="/salon/register"
                            className="flex justify-center py-2 px-3 border border-gray-300 dark:border-dark-border rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-dark-card transition-colors"
                        >
                            Register Salon
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthCustomerLoginPage;