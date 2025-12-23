import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { Appointment, User } from '../../../types';
import { UserIcon, MagnifyingGlassIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/16/solid';
import { format } from 'date-fns';

interface CustomerData extends User {
    totalAppointments: number;
    totalSpent: number;
    lastVisit?: Date;
    upcomingAppointments: number;
}

const AdminCustomersPage: React.FC = () => {
    const { userProfile } = useAuth();
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<CustomerData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
    const [customerAppointments, setCustomerAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        fetchCustomers();
    }, [userProfile?.salonId]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredCustomers(customers);
        } else {
            const filtered = customers.filter((customer) => customer.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || customer.email.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredCustomers(filtered);
        }
    }, [searchQuery, customers]);

    const fetchCustomers = async () => {
        if (!userProfile?.salonId) return;

        try {
            const appointmentsQuery = query(collection(db, 'appointments'), where('salonId', '==', userProfile.salonId));
            const appointmentsSnapshot = await getDocs(appointmentsQuery);
            const appointments = appointmentsSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
            })) as Appointment[];

            const customerIds = [...new Set(appointments.map((apt) => apt.customerId))];

            const customersData: CustomerData[] = [];

            for (const customerId of customerIds) {
                try {
                    const customerQuery = query(collection(db, 'users'), where('uid', '==', customerId));
                    const customerSnapshot = await getDocs(customerQuery);

                    if (!customerSnapshot.empty) {
                        const customerDoc = customerSnapshot.docs[0];
                        const customer = {
                            ...customerDoc.data(),
                            createdAt: customerDoc.data().createdAt?.toDate(),
                            updatedAt: customerDoc.data().updatedAt?.toDate(),
                        } as User;

                        const customerAppointments = appointments.filter((apt) => apt.customerId === customerId);
                        const completedAppointments = customerAppointments.filter((apt) => apt.status === 'completed');
                        const upcomingAppointments = customerAppointments.filter((apt) => apt.status === 'confirmed' || apt.status === 'pending');

                        const totalSpent = completedAppointments.reduce((sum, apt) => sum + apt.totalAmount, 0);
                        const lastVisit = completedAppointments.length > 0 ? new Date(Math.max(...completedAppointments.map((apt) => new Date(apt.date).getTime()))) : undefined;

                        customersData.push({
                            ...customer,
                            totalAppointments: customerAppointments.length,
                            totalSpent,
                            lastVisit,
                            upcomingAppointments: upcomingAppointments.length,
                        });
                    }
                } catch (error) {
                    console.error('Error fetching customer:', error);
                }
            }

            customersData.sort((a, b) => b.totalSpent - a.totalSpent);

            setCustomers(customersData);
            setFilteredCustomers(customersData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setLoading(false);
        }
    };

    const fetchCustomerAppointments = async (customerId: string) => {
        if (!userProfile?.salonId) return;

        try {
            const appointmentsQuery = query(collection(db, 'appointments'), where('salonId', '==', userProfile.salonId), where('customerId', '==', customerId), orderBy('date', 'desc'));
            const snapshot = await getDocs(appointmentsQuery);
            const appointments = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
            })) as Appointment[];

            setCustomerAppointments(appointments);
        } catch (error) {
            console.error('Error fetching customer appointments:', error);
        }
    };

    const handleCustomerClick = (customer: CustomerData) => {
        setSelectedCustomer(customer);
        fetchCustomerAppointments(customer.uid);
    };

    const getStatusColor = (status: Appointment['status']) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'in_progress':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
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
                <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text">Customers</h1>
                <p className="text-gray-600 dark:text-gray-400">View and manage your customer relationships</p>
            </div>

            { }
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <UserIcon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-dark-text">{customers.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                            <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-dark-text">RWF {customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                            <CalendarIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Appointments</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-dark-text">
                                {customers.length > 0 ? (customers.reduce((sum, c) => sum + c.totalAppointments, 0) / customers.length).toFixed(1) : '0'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                            <CurrencyDollarIcon className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Spend</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-dark-text">
                                RWF {customers.length > 0 ? (customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toFixed(0) : '0'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            { }
            <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search customers..."
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border focus:outline-none  focus:ring-primary-500 text-gray-800 dark:text-dark-text"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                { }
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="p-6 border-b border-gray-200 dark:border-dark-border">
                        <h2 className="text-lg font-medium text-gray-800 dark:text-dark-text">Customers ({filteredCustomers.length})</h2>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {filteredCustomers.map((customer) => (
                            <div
                                key={customer.uid}
                                onClick={() => handleCustomerClick(customer)}
                                className={`p-4 border-b border-gray-200 dark:border-dark-border cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors ${selectedCustomer?.uid === customer.uid ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-3">
                                            <UserIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-800 dark:text-dark-text">{customer.displayName}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-800 dark:text-dark-text">RWF {customer.totalSpent.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{customer.totalAppointments} appointments</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filteredCustomers.length === 0 && (
                            <div className="text-center py-8">
                                <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">{searchQuery ? 'No customers found matching your search.' : 'No customers yet.'}</p>
                            </div>
                        )}
                    </div>
                </div>

                { }
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="p-6 border-b border-gray-200 dark:border-dark-border">
                        <h2 className="text-lg font-medium text-gray-800 dark:text-dark-text">Customer Details</h2>
                    </div>

                    {selectedCustomer ? (
                        <div className="p-6 space-y-6">
                            { }
                            <div className="flex items-center">
                                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-4">
                                    <UserIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-medium text-gray-800 dark:text-dark-text">{selectedCustomer.displayName}</h3>
                                    <p className="text-gray-500 dark:text-gray-400">{selectedCustomer.email}</p>
                                    {selectedCustomer.phone && <p className="text-gray-500 dark:text-gray-400">{selectedCustomer.phone}</p>}
                                </div>
                            </div>

                            { }
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
                                    <p className="text-xl font-bold text-gray-800 dark:text-dark-text">RWF {selectedCustomer.totalSpent.toLocaleString()}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Visits</p>
                                    <p className="text-xl font-bold text-gray-800 dark:text-dark-text">{selectedCustomer.totalAppointments}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Last Visit</p>
                                    <p className="text-xl font-bold text-gray-800 dark:text-dark-text">{selectedCustomer.lastVisit ? format(selectedCustomer.lastVisit, 'MMM dd, yyyy') : 'Never'}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
                                    <p className="text-xl font-bold text-gray-800 dark:text-dark-text">{selectedCustomer.upcomingAppointments}</p>
                                </div>
                            </div>

                            { }
                            <div>
                                <h4 className="font-medium text-gray-800 dark:text-dark-text mb-3">Recent Appointments</h4>
                                <div className="space-y-3 max-h-48 overflow-y-auto">
                                    {customerAppointments.slice(0, 5).map((appointment) => (
                                        <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 dark:text-dark-text">
                                                    {format(new Date(appointment.date), 'MMM dd, yyyy')} at {appointment.time}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Service ID: {appointment.serviceId.slice(-6)}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>{appointment.status}</span>
                                                <p className="text-sm font-medium text-gray-800 dark:text-dark-text mt-1">
                                                    {appointment.currency} {appointment.totalAmount}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {customerAppointments.length === 0 && <p className="text-gray-500 dark:text-gray-400 text-sm">No appointments found.</p>}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-center">
                                <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">Select a customer to view details</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCustomersPage;
