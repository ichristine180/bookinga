import React, { useState, useMemo, useRef, useEffect } from 'react';
import { countries } from '@/config/countries';

export interface PhoneValue {
    country: typeof countries[0];
    localNumber: string;
}

interface PhoneSelectProps {
    value: PhoneValue;
    onChange: (value: PhoneValue) => void;
    label?: string;
    required?: boolean;
    error?: string;
    disabled?: boolean;
}

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 640;

const PhoneSelect: React.FC<PhoneSelectProps> = ({ value, onChange, label, required, error, disabled }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);


    useEffect(() => {
        if (modalOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 100);
        }
    }, [modalOpen]);


    useEffect(() => {
        if (modalOpen) {
            document.body.style.overflow = 'hidden';

            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport && isMobile()) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
            }
        } else {
            document.body.style.overflow = '';

            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport && isMobile()) {
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
            }
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [modalOpen]);


    const filteredCountries = useMemo(() => {
        if (!search.trim()) return countries;
        return countries.filter(
            c =>
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.dialCode.replace('+', '').includes(search.replace('+', '')) ||
                c.code.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);


    const getValidLengths = (): number[] => {
        const len = value.country.phoneLength?.mobile;
        if (!len) return [10];
        return Array.isArray(len) ? len : [len];
    };
    const validLengths = getValidLengths();


    const handleLocalNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const localNumber = e.target.value.replace(/\D/g, '');
        onChange({ ...value, localNumber });
    };


    const handleCountrySelect = (country: typeof countries[0]) => {
        setModalOpen(false);
        onChange({ country, localNumber: '' });
        setSearch('');
    };


    const handleModalClose = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).id === 'phone-modal-bg') {
            setModalOpen(false);
            setSearch('');
        }
    };


    const handleClearSearch = () => setSearch('');


    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (modalOpen && e.key === 'Escape') {
                setModalOpen(false);
                setSearch('');
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [modalOpen]);

    return (
        <div className="w-full">
            {label && (
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="flex items-center space-x-2">
                { }
                <button
                    type="button"
                    className="flex items-center px-2 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-sm min-w-[90px]"
                    onClick={() => setModalOpen(true)}
                    disabled={disabled}
                >
                    <span className="mr-1 text-lg">{value.country.flag}</span>
                    <span className="font-semibold">{value.country.dialCode}</span>
                    <svg className="ml-1 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                { }
                <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={Math.max(...validLengths)}
                    value={value.localNumber}
                    onChange={handleLocalNumberChange}
                    disabled={disabled}
                    className={`flex-1 px-3 py-2 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-dark-border'} rounded-lg bg-white dark:bg-dark-card text-gray-900 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base`}
                    placeholder={`Local number (${validLengths.join(' or ')} digits)`}
                />
            </div>
            { }
            {error && <div className="text-xs text-red-500 mt-1">{error}</div>}

            { }
            {modalOpen && (
                <>
                    { }
                    {isMobile() ? (
                        <div
                            id="phone-modal-bg"
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                width: '100vw',
                                height: '100vh',
                                minHeight: '100vh',
                                maxHeight: '100vh',
                                zIndex: 2147483647,
                                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                            onClick={handleModalClose}
                        >
                            <div
                                className="bg-white dark:bg-dark-card flex flex-col"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    width: '100vw',
                                    height: '100vh',
                                    minHeight: '100vh',
                                    maxHeight: '100vh',
                                    borderRadius: 0,
                                    overflow: 'hidden'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >


                                { }
                                <div className="sticky top-0 z-10 bg-white dark:bg-dark-card flex flex-col items-center pt-3 pb-2 shadow-md flex-shrink-0">
                                    { }
                                    <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 mb-3" />
                                    <div className="flex items-center w-full px-4">
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            placeholder="Search country name or code"
                                            className="flex-1 px-3 py-3 rounded-lg bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base border border-gray-200 dark:border-dark-border"
                                            style={{ minWidth: 0 }}
                                        />
                                        {search && (
                                            <button
                                                onClick={handleClearSearch}
                                                className="ml-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                                aria-label="Clear search"
                                                type="button"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => { setModalOpen(false); setSearch(''); }}
                                            className="ml-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2"
                                            aria-label="Close modal"
                                            type="button"
                                        >
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                { }
                                <div
                                    className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-dark-border"
                                    style={{
                                        paddingBottom: 'max(env(safe-area-inset-bottom), 34px)',
                                        minHeight: 0
                                    }}
                                >
                                    {filteredCountries.map(country => (
                                        <button
                                            key={country.code}
                                            type="button"
                                            className={`flex items-center w-full px-5 py-4 transition-colors duration-100 active:bg-primary-50 dark:active:bg-dark-bg focus:bg-primary-100 dark:focus:bg-dark-bg ${country.code === value.country.code ? 'bg-primary-50 dark:bg-dark-bg font-semibold' : 'bg-transparent'}`}
                                            onClick={() => handleCountrySelect(country)}
                                            style={{ fontSize: '1.15rem' }}
                                        >
                                            <span className="mr-4 text-2xl">{country.flag}</span>
                                            <span className="flex-1 text-left">{country.name}</span>
                                            <span className="ml-2 text-gray-500 font-mono">{country.dialCode}</span>
                                            {country.code === value.country.code && (
                                                <svg className="ml-2 w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                    {filteredCountries.length === 0 && (
                                        <div className="text-center text-gray-400 py-6">No countries found</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            id="phone-modal-bg"
                            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
                            style={{ zIndex: 999999 }}
                            onClick={handleModalClose}
                        >
                            <div
                                className="bg-white dark:bg-dark-card rounded-xl w-full max-w-md max-h-[80vh] shadow-xl mx-auto p-0 relative flex flex-col"
                                onClick={(e) => e.stopPropagation()}
                            >
                                { }
                                { }
                                <div className="sticky top-0 z-10 bg-white dark:bg-dark-card flex flex-col items-center pt-3 pb-2 shadow-md">
                                    { }
                                    <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 mb-3" />
                                    <div className="flex items-center w-full px-4">
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            placeholder="Search country name or code"
                                            className="flex-1 px-3 py-3 rounded-lg bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text focus:outline-none  focus:ring-primary-500 text-base border border-gray-200 dark:border-dark-border"
                                            style={{ minWidth: 0 }}
                                        />
                                        {search && (
                                            <button
                                                onClick={handleClearSearch}
                                                className="ml-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                                aria-label="Clear search"
                                                type="button"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => { setModalOpen(false); setSearch(''); }}
                                            className="ml-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2"
                                            aria-label="Close modal"
                                            type="button"
                                        >
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                { }
                                <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-dark-border pb-2">
                                    {filteredCountries.map(country => (
                                        <button
                                            key={country.code}
                                            type="button"
                                            className={`flex items-center w-full px-5 py-4 transition-colors duration-100 active:bg-primary-50 dark:active:bg-dark-bg focus:bg-primary-100 dark:focus:bg-dark-bg ${country.code === value.country.code ? 'bg-primary-50 dark:bg-dark-bg font-semibold' : 'bg-transparent'}`}
                                            onClick={() => handleCountrySelect(country)}
                                            style={{ fontSize: '1.15rem' }}
                                        >
                                            <span className="mr-4 text-2xl">{country.flag}</span>
                                            <span className="flex-1 text-left">{country.name}</span>
                                            <span className="ml-2 text-gray-500 font-mono">{country.dialCode}</span>
                                            {country.code === value.country.code && (
                                                <svg className="ml-2 w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                    ))}
                                    {filteredCountries.length === 0 && (
                                        <div className="text-center text-gray-400 py-6">No countries found</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PhoneSelect;