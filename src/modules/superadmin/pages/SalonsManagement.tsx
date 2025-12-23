
import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Salon, User, Appointment } from '../../../types';
import {
    BuildingStorefrontIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    TrashIcon,
    CheckIcon,
    XMarkIcon
} from '@heroicons/react/16/solid';
import { format } from 'date-fns';

interface SalonWithStats extends Salon {
    totalAppointments: number;
    totalRevenue: number;
    activeStaff: number;
    owner?: User;
}

const SuperAdminSalonsManagementPage: React.FC = () => {
    const [salons, setSalons] = useState<SalonWithStats[]>([]);
    const [filteredSalons, setFilteredSalons] = useState<SalonWithStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [selectedSalon, setSelectedSalon] = useState<SalonWithStats | null>(null);
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        fetchSalons();
    }, []);

    useEffect(() => {
        filterSalons();
    }, [searchQuery, statusFilter, salons]);

    const fetchSalons = async () => {
        try {

            const salonsSnapshot = await getDocs(collection(db, 'salons'));
            const salonsData = salonsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
                subscription: {
                    ...doc.data().subscription,
                    expiresAt: doc.data().subscription?.expiresAt?.toDate(),
                },
            })) as Salon[];


            const appointmentsSnapshot = await getDocs(collection(db, 'appointments'));
            const appointments = appointmentsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
            })) as Appointment[];


            const staffSnapshot = await getDocs(collection(db, 'staff'));
            const staff = staffSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
            })) as any;

            const usersSnapshot = await getDocs(collection(db, 'users'));
            const users = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
            })) as unknown as User[];


            const salonsWithStats: SalonWithStats[] = salonsData.map(salon => {
                const salonAppointments = appointments.filter(apt => apt.salonId === salon.id);
                const salonStaff = staff.filter((member: { salonId: string; isActive: any; }) => member.salonId === salon.id && member.isActive);
                const owner = users.find(user => user.uid === salon.ownerId);

                const totalRevenue = salonAppointments
                    .filter(apt => apt.status === 'completed')
                    .reduce((sum, apt) => sum + apt.totalAmount, 0);

                return {
                    ...salon,
                    totalAppointments: salonAppointments.length,
                    totalRevenue,
                    activeStaff: salonStaff.length,
                    owner,
                };
            });

            setSalons(salonsWithStats);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching salons:', error);
            setLoading(false);
        }
    };

    const filterSalons = () => {
        let filtered = salons;


        if (searchQuery.trim()) {
            filtered = filtered.filter(salon =>
                salon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                salon.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                salon.owner?.displayName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }


        if (statusFilter !== 'all') {
            filtered = filtered.filter(salon =>
                statusFilter === 'active' ? salon.isActive : !salon.isActive
            );
        }

        setFilteredSalons(filtered);
    };

    const handleStatusToggle = async (salonId: string, currentStatus: boolean) => {
        try {
            await updateDoc(doc(db, 'salons', salonId), {
                isActive: !currentStatus,
                updatedAt: new Date(),
            });

            setSalons(prev =>
                prev.map(salon =>
                    salon.id === salonId
                        ? { ...salon, isActive: !currentStatus }
                        : salon
                )
            );
        } catch (error) {
            console.error('Error updating salon status:', error);
        }
    };

    const handleDeleteSalon = async (salonId: string) => {
        if (!confirm('Are you sure you want to delete this salon? This action cannot be undone.')) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'salons', salonId));
            setSalons(prev => prev.filter(salon => salon.id !== salonId));
        } catch (error) {
            console.error('Error deleting salon:', error);
        }
    };

    const handleViewDetails = (salon: SalonWithStats) => {
        setSelectedSalon(salon);
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            { }
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text">Salons Management</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage all salons on the platform
                </p>
            </div>

            { }
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-800 dark:text-dark-text">{salons.length}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Salons</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{salons.filter(s => s.isActive).length}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Active Salons</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{salons.filter(s => !s.isActive).length}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Inactive Salons</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                            RWF {salons.reduce((sum, s) => sum + s.totalRevenue, 0).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                    </div>
                </div>
            </div>

            { }
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search salons, cities, or owners..."
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border focus:outline-none  focus:ring-primary-500 text-gray-800 dark:text-dark-text"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-4 py-3 border border-gray-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                </select>
            </div>

            { }
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-dark-bg">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Salon
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Owner
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Stats
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                            {filteredSalons.map((salon) => (
                                <tr key={salon.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-4">
                                                {salon.images[0] ? (
                                                    <img
                                                        src={salon.images[0]}
                                                        alt={salon.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <BuildingStorefrontIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-dark-text">{salon.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {salon.subscription?.plan || 'Basic'} Plan
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-dark-text">
                                                {salon.owner?.displayName || 'Unknown'}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {salon.owner?.email || 'No email'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <p className="text-sm text-gray-800 dark:text-dark-text">
                                                {salon.address.city}, {salon.address.state}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {salon.address.country}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">
                                            <p className="text-gray-800 dark:text-dark-text">
                                                {salon.totalAppointments} appointments
                                            </p>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                RWF {salon.totalRevenue.toLocaleString()}
                                            </p>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                {salon.activeStaff} staff
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col space-y-1">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${salon.isActive
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {salon.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                Since {salon.createdAt ? format(salon.createdAt, 'MMM yyyy') : 'Unknown'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleViewDetails(salon)}
                                                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => handleStatusToggle(salon.id, salon.isActive)}
                                                className={`p-2 rounded-lg transition-colors ${salon.isActive
                                                    ? 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30'
                                                    : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30'
                                                    }`}
                                                title={salon.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                {salon.isActive ? <XMarkIcon className="w-4 h-4" /> : <CheckIcon className="w-4 h-4" />}
                                            </button>

                                            <button
                                                onClick={() => handleDeleteSalon(salon.id)}
                                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                title="Delete Salon"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredSalons.length === 0 && (
                        <div className="text-center py-12">
                            <BuildingStorefrontIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-2">
                                No salons found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {searchQuery || statusFilter !== 'all'
                                    ? 'Try adjusting your filters.'
                                    : 'No salons have been registered yet.'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>

            { }
            {showModal && selectedSalon && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-dark-card rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text">
                                {selectedSalon.name}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            { }
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-4">
                                        Basic Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                                            <p className="font-medium text-gray-800 dark:text-dark-text">{selectedSalon.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                                            <p className="text-gray-800 dark:text-dark-text">{selectedSalon.description}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${selectedSalon.isActive
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                }`}>
                                                {selectedSalon.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                { }
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-4">
                                        Contact Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                                            <p className="text-gray-800 dark:text-dark-text">{selectedSalon.contact.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                            <p className="text-gray-800 dark:text-dark-text">{selectedSalon.contact.email}</p>
                                        </div>
                                        {selectedSalon.contact.website && (
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Website</p>
                                                <a
                                                    href={selectedSalon.contact.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary-600 hover:text-primary-700"
                                                >
                                                    {selectedSalon.contact.website}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                { }
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-4">
                                        Address
                                    </h3>
                                    <div className="text-gray-800 dark:text-dark-text">
                                        <p>{selectedSalon.address.street}</p>
                                        <p>{selectedSalon.address.city}, {selectedSalon.address.state} {selectedSalon.address.zipCode}</p>
                                        <p>{selectedSalon.address.country}</p>
                                    </div>
                                </div>
                            </div>

                            { }
                            <div className="space-y-6">
                                { }
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-4">
                                        Statistics
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Appointments</p>
                                            <p className="text-2xl font-bold text-gray-800 dark:text-dark-text">
                                                {selectedSalon.totalAppointments}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                                            <p className="text-2xl font-bold text-gray-800 dark:text-dark-text">
                                                RWF {selectedSalon.totalRevenue.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Active Staff</p>
                                            <p className="text-2xl font-bold text-gray-800 dark:text-dark-text">
                                                {selectedSalon.activeStaff}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                                            <p className="text-lg font-semibold text-gray-800 dark:text-dark-text">
                                                {selectedSalon.createdAt ? format(selectedSalon.createdAt, 'MMM dd, yyyy') : 'Unknown'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                { }
                                {selectedSalon.owner && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-4">
                                            Owner Information
                                        </h3>
                                        <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                                                    <p className="font-medium text-gray-800 dark:text-dark-text">
                                                        {selectedSalon.owner.displayName}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                                    <p className="text-gray-800 dark:text-dark-text">{selectedSalon.owner.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                                                    <p className="text-gray-800 dark:text-dark-text">
                                                        {selectedSalon.owner.phone || 'Not provided'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Joined</p>
                                                    <p className="text-gray-800 dark:text-dark-text">
                                                        {selectedSalon.owner.createdAt
                                                            ? format(selectedSalon.owner.createdAt, 'MMM dd, yyyy')
                                                            : 'Unknown'
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                { }
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-4">
                                        Subscription
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Plan</p>
                                                <p className="font-medium text-gray-800 dark:text-dark-text">
                                                    {selectedSalon.subscription?.plan?.toUpperCase() || 'BASIC'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Expires</p>
                                                <p className="text-gray-800 dark:text-dark-text">
                                                    {selectedSalon.subscription?.expiresAt
                                                        ? format(selectedSalon.subscription.expiresAt, 'MMM dd, yyyy')
                                                        : 'Never'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                { }
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-4">
                                        Working Hours
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                                        <div className="space-y-2">
                                            {Object.entries(selectedSalon.workingHours).map(([day, hours]) => (
                                                <div key={day} className="flex justify-between text-sm">
                                                    <span className="capitalize text-gray-600 dark:text-gray-400">{day}</span>
                                                    <span className="text-gray-800 dark:text-dark-text">
                                                        {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        { }
                        {selectedSalon.images.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-4">
                                    Images
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {selectedSalon.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`${selectedSalon.name} ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        { }
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => handleStatusToggle(selectedSalon.id, selectedSalon.isActive)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedSalon.isActive
                                    ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                                    : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                    }`}
                            >
                                {selectedSalon.isActive ? 'Deactivate Salon' : 'Activate Salon'}
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminSalonsManagementPage;