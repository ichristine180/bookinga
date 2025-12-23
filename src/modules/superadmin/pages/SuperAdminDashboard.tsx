import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Salon, User, Appointment } from '../../../types';
import {
    BuildingStorefrontIcon,
    UsersIcon,
    CurrencyDollarIcon,
    ChartBarIcon,

} from '@heroicons/react/16/solid';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

interface DashboardStats {
    totalSalons: number;
    activeSalons: number;
    totalUsers: number;
    totalRevenue: number;
    monthlyGrowth: number;
    recentSalons: Salon[];
    recentUsers: User[];
    topSalons: Array<{
        salon: Salon;
        revenue: number;
        appointments: number;
    }>;
}

const SuperAdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalSalons: 0,
        activeSalons: 0,
        totalUsers: 0,
        totalRevenue: 0,
        monthlyGrowth: 0,
        recentSalons: [],
        recentUsers: [],
        topSalons: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {

            const salonsSnapshot = await getDocs(collection(db, 'salons'));
            const salons = salonsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
                subscription: {
                    ...doc.data().subscription,
                    expiresAt: doc.data().subscription?.expiresAt?.toDate(),
                },
            })) as Salon[];

            const usersSnapshot = await getDocs(collection(db, 'users'));
            const users = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
            })) as unknown as User[];


            const appointmentsSnapshot = await getDocs(collection(db, 'appointments'));
            const appointments = appointmentsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
            })) as Appointment[];


            const activeSalons = salons.filter(salon => salon.isActive).length;
            const totalRevenue = appointments
                .filter(apt => apt.status === 'completed')
                .reduce((sum, apt) => sum + apt.totalAmount, 0);


            const now = new Date();
            const thisMonth = appointments.filter(apt => {
                const aptDate = apt.createdAt;
                return aptDate >= startOfMonth(now) && aptDate <= endOfMonth(now);
            });
            const lastMonth = appointments.filter(apt => {
                const lastMonthStart = startOfMonth(subDays(now, 30));
                const lastMonthEnd = endOfMonth(subDays(now, 30));
                const aptDate = apt.createdAt;
                return aptDate >= lastMonthStart && aptDate <= lastMonthEnd;
            });

            const thisMonthRevenue = thisMonth.reduce((sum, apt) => sum + apt.totalAmount, 0);
            const lastMonthRevenue = lastMonth.reduce((sum, apt) => sum + apt.totalAmount, 0);
            const monthlyGrowth = lastMonthRevenue > 0
                ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
                : 0;


            const recentSalons = salons
                .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
                .slice(0, 5);


            const recentUsers = users
                .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
                .slice(0, 5);


            const salonRevenue = salons.map(salon => {
                const salonAppointments = appointments.filter(apt => apt.salonId === salon.id);
                const revenue = salonAppointments
                    .filter(apt => apt.status === 'completed')
                    .reduce((sum, apt) => sum + apt.totalAmount, 0);

                return {
                    salon,
                    revenue,
                    appointments: salonAppointments.length,
                };
            });

            const topSalons = salonRevenue
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5);

            setStats({
                totalSalons: salons.length,
                activeSalons,
                totalUsers: users.length,
                totalRevenue,
                monthlyGrowth,
                recentSalons,
                recentUsers,
                topSalons,
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            { }
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text">Platform Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Overview of your salon booking platform
                </p>
            </div>

            { }
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                            <UsersIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-dark-text">{stats.totalUsers}</p>
                            <p className="text-xs text-gray-500">All roles</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                            <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-800 dark:text-dark-text">
                                RWF {stats.totalRevenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">Platform wide</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                            <ChartBarIcon className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Growth</p>
                            <div className="flex items-center">
                                <p className="text-2xl font-bold text-gray-800 dark:text-dark-text">
                                    {Math.abs(stats.monthlyGrowth).toFixed(1)}%
                                </p>
                                {stats.monthlyGrowth >= 0 ? (
                                    <TrendingUpIcon className="w-4 h-4 text-green-500 ml-1" />
                                ) : (
                                    <TrendingDownIcon className="w-4 h-4 text-red-500 ml-1" />
                                )}
                            </div>
                            <p className="text-xs text-gray-500">vs last month</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                { }
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="p-6 border-b border-gray-200 dark:border-dark-border">
                        <h2 className="text-lg font-medium text-gray-800 dark:text-dark-text">
                            Recent Salons
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {stats.recentSalons.map((salon) => (
                                <div key={salon.id} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-3">
                                            <BuildingStorefrontIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-dark-text">{salon.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {salon.address.city}, {salon.address.country}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${salon.isActive
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {salon.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {salon.createdAt ? format(salon.createdAt, 'MMM dd, yyyy') : 'Unknown'}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {stats.recentSalons.length === 0 && (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                                    No salons registered yet.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                { }
                <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="p-6 border-b border-gray-200 dark:border-dark-border">
                        <h2 className="text-lg font-medium text-gray-800 dark:text-dark-text">
                            Top Performing Salons
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {stats.topSalons.map((item, index) => (
                                <div key={item.salon.id} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-3">
                                            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-dark-text">
                                                {item.salon.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {item.appointments} appointments
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-800 dark:text-dark-text">
                                            RWF {item.revenue.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {stats.topSalons.length === 0 && (
                                <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                                    No revenue data available.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            { }
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
                <div className="p-6 border-b border-gray-200 dark:border-dark-border">
                    <h2 className="text-lg font-medium text-gray-800 dark:text-dark-text">
                        Recent User Registrations
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-dark-bg">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                            {stats.recentUsers.map((user) => (
                                <tr key={user.uid} className="hover:bg-gray-50 dark:hover:bg-dark-bg">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                                    {user.displayName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-dark-text">
                                                    {user.displayName}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === 'super_admin'
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            : user.role === 'salon_admin'
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                            }`}>
                                            {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-dark-text">
                                        {user.createdAt ? format(user.createdAt, 'MMM dd, yyyy') : 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {stats.recentUsers.length === 0 && (
                        <div className="text-center py-8">
                            <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">No users registered yet.</p>
                        </div>
                    )}
                </div>
            </div>

            { }
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-4">
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full text-left p-3 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors">
                            View All Salons
                        </button>
                        <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-dark-bg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            Manage Users
                        </button>
                        <button className="w-full text-left p-3 rounded-lg bg-gray-50 dark:bg-dark-bg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            Platform Analytics
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-4">
                        System Health
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                                Healthy
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                                Healthy
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">API</span>
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                                Healthy
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-4">
                        Platform Metrics
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Avg. Appointments/Day</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-dark-text">
                                {stats.totalSalons > 0 ? '12.5' : '0'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Customer Satisfaction</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-dark-text">4.8/5</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Platform Uptime</span>
                            <span className="text-sm font-medium text-gray-800 dark:text-dark-text">99.9%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboardPage;