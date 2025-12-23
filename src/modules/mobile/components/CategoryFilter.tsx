import React from 'react';

interface CategoryFilterProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
    selectedCategory,
    onCategoryChange,
}) => {
    const categories = [
        { id: 'all', name: 'All' },
        { id: 'hair', name: 'Hair' },
        { id: 'nails', name: 'Nails' },
        { id: 'spa', name: 'Spa' },
        { id: 'makeup', name: 'Makeup' },
        { id: 'massage', name: 'Massage' },
    ];

    return (
        <div className="flex overflow-x-auto pb-2 space-x-3">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-dark-border'
                        }`}
                >
                    {category.name}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;