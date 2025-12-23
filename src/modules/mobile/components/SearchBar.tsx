import React, { useState } from 'react';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/16/solid';

interface SearchBarProps {
    onSearch?: (query: string) => void;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    onSearch,
    placeholder = "Search salons, services..."
}) => {
    const [query, setQuery] = useState('');

    const handleSearch = (value: string) => {
        setQuery(value);
        onSearch?.(value);
    };

    return (
        <div className="space-y-2 mt-5">
            <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border focus:outline-none  focus:ring-primary-500 dark:focus:ring-primary-600 text-gray-800 dark:text-dark-text text-sm"
                />
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPinIcon className="w-3 h-3 mr-1" />
                <span className="text-xs">Kigali, Rwanda</span>
            </div>
        </div>
    );
};

export default SearchBar;