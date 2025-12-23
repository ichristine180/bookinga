import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Salon } from '../../../types';
import SearchBar from '../components/SearchBar';
import SalonCard from '../components/SalonCard';
import CategoryFilter from '../components/CategoryFilter';

const MobileSalonsPage: React.FC = () => {
    const [salons, setSalons] = useState<Salon[]>([]);
    const [filteredSalons, setFilteredSalons] = useState<Salon[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const fetchSalons = async () => {
            try {
                const q = query(
                    collection(db, 'salons'),

                    orderBy('name')
                );

                const snapshot = await getDocs(q);
                const salonsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate(),
                    updatedAt: doc.data().updatedAt?.toDate(),
                    subscription: {
                        ...doc.data().subscription,
                        expiresAt: doc.data().subscription?.expiresAt?.toDate(),
                    },
                })) as Salon[];

                setSalons(salonsData);
                setFilteredSalons(salonsData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching salons:', error);
                setLoading(false);
            }
        };

        fetchSalons();
    }, []);

    useEffect(() => {
        let filtered = salons;


        if (searchQuery.trim()) {
            filtered = filtered.filter(salon =>
                salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                salon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                salon.address.city.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }


        if (selectedCategory !== 'all') {


        }

        setFilteredSalons(filtered);
    }, [salons, searchQuery, selectedCategory]);

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <SearchBar onSearch={setSearchQuery} />
            <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
            />

            <div className="space-y-4">
                {filteredSalons.map((salon) => (
                    <SalonCard key={salon.id} salon={salon} />
                ))}

                {filteredSalons.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                            No salons found matching your criteria.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MobileSalonsPage;