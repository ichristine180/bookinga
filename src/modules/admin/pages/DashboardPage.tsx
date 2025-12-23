import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { Appointment } from '../../../types';
import { CalendarIcon, CurrencyDollarIcon, UsersIcon, ChartBarIcon, FunnelIcon } from '@heroicons/react/16/solid';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, parseISO, isValid, isSameDay } from 'date-fns';
import ShareLinkComponent from '../components/ShareLinkComponent';

type DateFilter = 'today' | 'week' | 'month' | 'custom' | 'all';

interface DashboardStats {
    todayAppointments: number;
    totalRevenue: number;
    totalCustomers: number;
    completionRate: number;
    totalAppointments: number;
    pendingAppointments: number;
    confirmedAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
}

const AdminDashboardPage: React.FC = () => {
    const { userProfile } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        todayAppointments: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        completionRate: 0,
        totalAppointments: 0,
        pendingAppointments: 0,
        confirmedAppointments: 0,
        completedAppointments: 0,
        cancelledAppointments: 0,
    });
    const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
    const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateFilter, setDateFilter] = useState<DateFilter>('all');
    const [customDateRange, setCustomDateRange] = useState({
        start: '',
        end: '',
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, [userProfile?.salonId]);

    useEffect(() => {
        if (allAppointments.length > 0) {
            calculateStats();
        }
    }, [allAppointments, dateFilter, customDateRange]);

    const parseAppointmentDate = (dateStr: string): Date | null => {
        if (!dateStr) return null;

        try {
            if (dateStr.includes('T')) {
                return parseISO(dateStr);
            } else {
                const [year, month, day] = dateStr.split('-').map(Number);
                if (year && month && day) {
                    return new Date(year, month - 1, day);
                }

                const parsed = parseISO(dateStr);
                return isValid(parsed) ? parsed : null;
            }
        } catch (error) {
            console.error('Error parsing date:', dateStr, error);
            return null;
        }
    };

    const isDateInRange = (appointmentDate: string, filterType: DateFilter): boolean => {
        if (!appointmentDate) return filterType === 'all';

        const aptDate = parseAppointmentDate(appointmentDate);
        if (!aptDate) {
            return filterType === 'all';
        }

        const today = new Date();

        switch (filterType) {
            case 'today':
                return isSameDay(aptDate, today);
            case 'week':
                const weekStart = startOfWeek(today);
                const weekEnd = endOfWeek(today);
                return aptDate >= weekStart && aptDate <= weekEnd;
            case 'month':
                const monthStart = startOfMonth(today);
                const monthEnd = endOfMonth(today);
                return aptDate >= monthStart && aptDate <= monthEnd;
            case 'custom':
                if (customDateRange.start && customDateRange.end) {
                    const rangeStart = parseISO(customDateRange.start);
                    const rangeEnd = parseISO(customDateRange.end);
                    if (isValid(rangeStart) && isValid(rangeEnd)) {
                        return aptDate >= rangeStart && aptDate <= rangeEnd;
                    }
                }
                return false;
            default:
                return true;
        }
    };

    const fetchDashboardData = async () => {
        if (!userProfile?.salonId) {
            setLoading(false);
            return;
        }

        try {
            setError(null);

            const appointmentsQuery = query(collection(db, 'appointments'), where('salonId', '==', userProfile.salonId));

            const appointmentsSnapshot = await getDocs(appointmentsQuery);
            const appointments = appointmentsSnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                } as Appointment;
            });

            setAllAppointments(appointments);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data. Please try again.');
            setLoading(false);
        }
    };

    const calculateStats = () => {
        const filteredAppointments = allAppointments.filter((apt) => isDateInRange(apt.date || '', dateFilter));

        const today = new Date();
        const todayAppointments = allAppointments.filter((apt) => {
            const aptDate = parseAppointmentDate(apt.date || '');
            return aptDate && isSameDay(aptDate, today);
        });

        const pendingAppointments = filteredAppointments.filter((apt) => apt.status === 'pending');
        const confirmedAppointments = filteredAppointments.filter((apt) => apt.status === 'confirmed');
        const completedAppointments = filteredAppointments.filter((apt) => apt.status === 'completed');
        const cancelledAppointments = filteredAppointments.filter((apt) => apt.status === 'cancelled');

        const totalRevenue = completedAppointments.reduce((sum, apt) => {
            const amount = typeof apt.totalAmount === 'number' ? apt.totalAmount : 0;
            return sum + amount;
        }, 0);

        const uniqueCustomers = new Set(filteredAppointments.map((apt) => apt.customerId).filter((id) => id && id.trim() !== ''));

        const totalFilteredAppointments = filteredAppointments.length;
        const completionRate = totalFilteredAppointments > 0 ? (completedAppointments.length / totalFilteredAppointments) * 100 : 0;

        const sortedAppointments = [...filteredAppointments]
            .sort((a, b) => {
                const dateA = parseAppointmentDate(a.date || '');
                const dateB = parseAppointmentDate(b.date || '');

                if (!dateA && !dateB) return 0;
                if (!dateA) return 1;
                if (!dateB) return -1;

                const dateDiff = dateB.getTime() - dateA.getTime();
                if (dateDiff !== 0) return dateDiff;

                const timeA = a.time || '00:00';
                const timeB = b.time || '00:00';
                return timeB.localeCompare(timeA);
            })
            .slice(0, 5);

        const newStats = {
            todayAppointments: todayAppointments.length,
            totalRevenue,
            totalCustomers: uniqueCustomers.size,
            completionRate,
            totalAppointments: filteredAppointments.length,
            pendingAppointments: pendingAppointments.length,
            confirmedAppointments: confirmedAppointments.length,
            completedAppointments: completedAppointments.length,
            cancelledAppointments: cancelledAppointments.length,
        };

        setStats(newStats);
        setRecentAppointments(sortedAppointments);
    };

    const getDateFilterLabel = () => {
        switch (dateFilter) {
            case 'today':
                return 'Today';
            case 'week':
                return 'This Week';
            case 'month':
                return 'This Month';
            case 'custom':
                if (customDateRange.start && customDateRange.end) {
                    try {
                        return `${format(parseISO(customDateRange.start), 'MMM dd')} - ${format(parseISO(customDateRange.end), 'MMM dd')}`;
                    } catch {
                        return 'Custom Range';
                    }
                }
                return 'Custom Range';
            default:
                return 'All Time';
        }
    };

    const getStatCards = () => {
        const baseCards = [
            {
                title: dateFilter === 'today' ? 'Today' : 'Total',
                value: dateFilter === 'today' ? stats.todayAppointments : stats.totalAppointments,
                icon: CalendarIcon,
                color: 'text-blue-600',
                bgColor: 'bg-blue-100 dark:bg-blue-900/30',
            },
            {
                title: 'Revenue',
                value: `RWF ${stats.totalRevenue.toLocaleString()}`,
                icon: CurrencyDollarIcon,
                color: 'text-green-600',
                bgColor: 'bg-green-100 dark:bg-green-900/30',
            },
            {
                title: 'Customers',
                value: stats.totalCustomers,
                icon: UsersIcon,
                color: 'text-purple-600',
                bgColor: 'bg-purple-100 dark:bg-purple-900/30',
            },
            {
                title: 'Completion Rate',
                value: `${stats.completionRate.toFixed(0)}%`,
                icon: ChartBarIcon,
                color: 'text-orange-600',
                bgColor: 'bg-orange-100 dark:bg-orange-900/30',
            },
        ];

        return baseCards;
    };

    if (loading) {
        return (
            <div className="space-y-4 p-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                    ))}
                </div>
                <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-4 p-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-dark-text">Dashboard</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Overview of your salon</p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h3 className="text-red-800 dark:text-red-400 font-medium mb-2">Error Loading Dashboard</h3>
                    <p className="text-red-700 dark:text-red-300 text-sm mb-3">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!userProfile?.salonId) {
        return (
            <div className="space-y-4 p-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-dark-text">Dashboard</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Overview of your salon</p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h3 className="text-yellow-800 dark:text-yellow-400 font-medium mb-2">Setup Required</h3>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">You need to set up your salon profile to view dashboard data.</p>
                </div>
            </div>
        );
    }

    const statCards = getStatCards();

    return (
        <div className="space-y-4 p-6">
            { }
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-dark-text">Dashboard</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Overview of your salon's performance
                        {dateFilter !== 'all' && ` (${getDateFilterLabel()})`}
                    </p>
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm"
                >
                    <FunnelIcon className="w-3 h-3" />
                    <span>Filter</span>
                </button>
            </div>

            { }
            {showFilters && (
                <div className="bg-white dark:bg-dark-card rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Period</label>
                            <select
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-primary-500 text-sm"
                            >
                                <option value="all">All Time</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>

                        {dateFilter === 'custom' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        value={customDateRange.start}
                                        onChange={(e) => setCustomDateRange((prev) => ({ ...prev, start: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-primary-500 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={customDateRange.end}
                                        onChange={(e) => setCustomDateRange((prev) => ({ ...prev, end: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none focus:ring-primary-500 text-sm"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            { }
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {statCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div key={index} className="bg-white dark:bg-dark-card rounded-lg p-3 shadow-sm border border-gray-200 dark:border-dark-border">
                            <div className="flex items-center">
                                <div className={`p-2 rounded-lg ${card.bgColor} mr-3`}>
                                    <Icon className={`w-4 h-4 ${card.color}`} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">{card.title}</p>
                                    <p className="text-lg font-bold text-gray-800 dark:text-dark-text">{card.value}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            { }
            {dateFilter !== 'all' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-3 border border-gray-200 dark:border-dark-border">
                        <div className="text-center">
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Pending</p>
                            <p className="text-lg font-bold text-yellow-600">{stats.pendingAppointments}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-3 border border-gray-200 dark:border-dark-border">
                        <div className="text-center">
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Confirmed</p>
                            <p className="text-lg font-bold text-blue-600">{stats.confirmedAppointments}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-3 border border-gray-200 dark:border-dark-border">
                        <div className="text-center">
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Completed</p>
                            <p className="text-lg font-bold text-green-600">{stats.completedAppointments}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-3 border border-gray-200 dark:border-dark-border">
                        <div className="text-center">
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Cancelled</p>
                            <p className="text-lg font-bold text-red-600">{stats.cancelledAppointments}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                { }
                <div className="lg:col-span-1">
                    <ShareLinkComponent />
                </div>

                { }
                <div className="lg:col-span-2 bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="p-4 border-b border-gray-200 dark:border-dark-border">
                        <h2 className="text-base font-medium text-gray-800 dark:text-dark-text">
                            Recent Appointments
                            {dateFilter !== 'all' && ` (${getDateFilterLabel()})`}
                        </h2>
                    </div>

                    <div className="p-4">
                        {recentAppointments.length === 0 ? (
                            <div className="text-center py-6">
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{dateFilter === 'all' ? 'No appointments found.' : `No appointments found for ${getDateFilterLabel().toLowerCase()}.`}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentAppointments.map((appointment) => {
                                    const aptDate = parseAppointmentDate(appointment.date || '');
                                    return (
                                        <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-bg rounded-lg">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-800 dark:text-dark-text truncate">Customer #{appointment.customerId?.slice(-6) || 'Unknown'}</p>
                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    <span>{aptDate ? format(aptDate, 'MMM dd') : 'No date'}</span>
                                                    <span className="mx-1">•</span>
                                                    <span>{appointment.time || 'No time'}</span>
                                                </div>
                                            </div>
                                            <div className="text-right ml-2">
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${appointment.status === 'completed'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : appointment.status === 'confirmed'
                                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                            : appointment.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                        }`}
                                                >
                                                    {appointment.status || 'Unknown'}
                                                </span>
                                                <p className="text-xs font-medium text-gray-800 dark:text-dark-text mt-1">
                                                    {appointment.currency || 'RWF'} {(appointment.totalAmount || 0).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            { }
            <div className="bg-white dark:bg-dark-card rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-border">
                <h3 className="text-base font-medium text-gray-800 dark:text-dark-text mb-3">Quick Summary {dateFilter !== 'all' && `(${getDateFilterLabel()})`}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Average per Appointment</p>
                        <p className="text-lg font-bold text-gray-800 dark:text-dark-text">RWF {stats.completedAppointments > 0 ? (stats.totalRevenue / stats.completedAppointments).toFixed(0) : '0'}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                        <p className="text-lg font-bold text-gray-800 dark:text-dark-text">{stats.completionRate.toFixed(1)}%</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Today's Appointments</p>
                        <p className="text-lg font-bold text-gray-800 dark:text-dark-text">{stats.todayAppointments}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
