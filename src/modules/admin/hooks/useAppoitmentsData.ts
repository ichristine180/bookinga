// hooks/useAppointmentsData.ts
import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { collection, query, where, getDocs, orderBy, documentId } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { Appointment, Service, User } from '../../../types';

// Enhanced cache implementation with stale-while-revalidate support
class EnhancedDataCache {
    private users = new Map<string, User>();
    private services = new Map<string, Service>();
    private allAppointments = new Map<string, Appointment[]>();
    private lastUsersFetchTime = 0;
    private lastAppointmentsFetch = new Map<string, number>();
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    setUsers(users: User[]) {
        users.forEach(user => this.users.set(user.uid, user));
        this.lastUsersFetchTime = Date.now();
    }

    setServices(services: Service[]) {
        services.forEach(service => this.services.set(service.id, service));
    }

    setAllAppointments(salonId: string, appointments: Appointment[]) {
        this.allAppointments.set(salonId, appointments);
        this.lastAppointmentsFetch.set(salonId, Date.now());
    }

    getUser(uid: string): User | undefined {
        return this.users.get(uid);
    }

    getService(id: string): Service | undefined {
        return this.services.get(id);
    }

    getAllAppointments(salonId: string): Appointment[] | null {
        return this.allAppointments.get(salonId) || null;
    }

    hasUser(uid: string): boolean {
        return this.users.has(uid);
    }

    isUsersCacheValid(): boolean {
        return Date.now() - this.lastUsersFetchTime < this.CACHE_DURATION;
    }

    hasStaleAppointments(salonId: string): boolean {
        const lastFetch = this.lastAppointmentsFetch.get(salonId);
        if (!lastFetch) return false;
        return Date.now() - lastFetch < this.CACHE_DURATION;
    }

    getCachedUserIds(): string[] {
        return Array.from(this.users.keys());
    }

    clear() {
        this.users.clear();
        this.services.clear();
        this.allAppointments.clear();
        this.lastUsersFetchTime = 0;
        this.lastAppointmentsFetch.clear();
    }

    clearAppointments() {
        this.allAppointments.clear();
        this.lastAppointmentsFetch.clear();
    }
}

// Global cache instance
const enhancedCache = new EnhancedDataCache();

// Types for filters
export type DateFilter = 'all' | 'today' | 'week' | 'month' | 'custom';
export type StatusFilter = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface AppointmentFilters {
    dateFilter: DateFilter;
    statusFilter: StatusFilter;
    showDeleted: boolean;
    customDateRange?: { start: string; end: string };
}

export interface AppointmentsData {
    appointments: Appointment[];
    services: Service[];
    customers: Record<string, User>;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

// Utility functions
const createStableKey = (salonId: string, filters: AppointmentFilters): string => {
    return JSON.stringify({ salonId, filters });
};

const chunkArray = <T>(array: T[], size: number): T[][] => {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

// Optimized batch user fetcher
const fetchUsersBatch = async (userIds: string[]): Promise<User[]> => {
    if (userIds.length === 0) return [];

    const BATCH_SIZE = 10; // Firestore 'in' query limit
    const chunks = chunkArray(userIds, BATCH_SIZE);
    const users: User[] = [];

    // Process chunks in parallel for better performance
    const chunkPromises = chunks.map(async (chunk) => {
        const q = query(collection(db, 'users'), where(documentId(), 'in', chunk));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            uid: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        } as User));
    });

    const chunkResults = await Promise.all(chunkPromises);
    chunkResults.forEach(chunkUsers => users.push(...chunkUsers));

    return users;
};

// Main hook with immediate UI updates and background revalidation
export const useAppointmentsData = (
    salonId: string | undefined,
    filters: AppointmentFilters
): AppointmentsData => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [customers, setCustomers] = useState<Record<string, User>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Use ref to track current fetch to prevent race conditions
    const currentFetchRef = useRef<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const previousFiltersRef = useRef<AppointmentFilters | null>(null);
    const hasInitialDataRef = useRef(false);

    // Create stable cache key
    const cacheKey = useMemo(() =>
        salonId ? createStableKey(salonId, filters) : null,
        [salonId, filters]
    );

    // Check if this is just a filter change (not initial load or salon change)
    const isFilterChange = useMemo(() => {
        if (!previousFiltersRef.current || !hasInitialDataRef.current || !salonId) return false;

        const prev = previousFiltersRef.current;
        const hasValidCachedData = enhancedCache.getAllAppointments(salonId) !== null;

        return hasValidCachedData && (
            prev.dateFilter !== filters.dateFilter ||
            prev.statusFilter !== filters.statusFilter ||
            prev.showDeleted !== filters.showDeleted ||
            JSON.stringify(prev.customDateRange) !== JSON.stringify(filters.customDateRange)
        );
    }, [filters, salonId]);

    // Date filtering logic
    const isAppointmentInDateRange = useCallback((appointmentDate: string): boolean => {
        if (!appointmentDate || filters.dateFilter === 'all') return true;

        const today = new Date();
        let startDate: Date, endDate: Date;

        switch (filters.dateFilter) {
            case 'today':
                startDate = endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                break;
            case 'week':
                const dayOfWeek = today.getDay();
                startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayOfWeek);
                endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayOfWeek + 6);
                break;
            case 'month':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                break;
            case 'custom':
                if (!filters.customDateRange?.start || !filters.customDateRange?.end) return true;
                startDate = new Date(filters.customDateRange.start);
                endDate = new Date(filters.customDateRange.end);
                break;
            default:
                return true;
        }

        try {
            const aptDateStr = appointmentDate.includes('T')
                ? appointmentDate.split('T')[0]
                : appointmentDate;
            const aptDate = new Date(aptDateStr + 'T00:00:00');

            return aptDate >= startDate && aptDate <= endDate;
        } catch {
            return true;
        }
    }, [filters.dateFilter, filters.customDateRange]);

    // Apply filters to cached data immediately for filter changes
    const applyFiltersToData = useCallback((allAppointments: Appointment[]) => {
        return allAppointments
            .filter(apt => filters.showDeleted ? apt.deleted : !apt.deleted)
            .filter(apt => isAppointmentInDateRange(apt.date || ''));
    }, [filters.showDeleted, isAppointmentInDateRange]);

    // Handle immediate filter changes with cached data (stale-while-revalidate)
    useEffect(() => {
        if (isFilterChange && salonId) {
            const cachedAppointments = enhancedCache.getAllAppointments(salonId);
            if (cachedAppointments) {
                const filteredData = applyFiltersToData(cachedAppointments);
                setAppointments(filteredData);
                setLoading(false); // Immediate UI update with cached data
                setError(null);

                // Get required users for the filtered data
                const requiredUserIds = [
                    ...new Set(
                        filteredData
                            .map(apt => apt.customerId)
                            .filter(Boolean)
                    )
                ];

                // Update customers with cached data
                const customersData: Record<string, User> = {};
                requiredUserIds.forEach(id => {
                    const user = enhancedCache.getUser(id);
                    if (user) {
                        customersData[id] = user;
                    }
                });
                setCustomers(customersData);

                // Update services from cache
                const servicesData = Array.from(enhancedCache['services'].values());
                if (servicesData.length > 0) {
                    setServices(servicesData);
                }
            }
        }
        previousFiltersRef.current = filters;
    }, [filters, isFilterChange, salonId, applyFiltersToData]);

    // Core fetch function
    const fetchAppointments = useCallback(async () => {
        if (!salonId || !cacheKey) {
            setLoading(false);
            return;
        }

        // For filter changes with cached data, don't show loading spinner
        const shouldShowLoading = !isFilterChange;

        // Cancel previous fetch
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        currentFetchRef.current = cacheKey;

        try {
            if (shouldShowLoading) {
                setLoading(true);
            }
            setError(null);

            // 1. Fetch appointments and services in parallel
            const appointmentsQuery = query(
                collection(db, 'appointments'),
                where('salonId', '==', salonId),
                orderBy('date', 'desc'),
                orderBy('time', 'desc')
            );

            const [appointmentsSnapshot, servicesSnapshot] = await Promise.all([
                getDocs(appointmentsQuery),
                getDocs(query(collection(db, 'services'), where('salonId', '==', salonId)))
            ]);

            // Check if this fetch is still current
            if (currentFetchRef.current !== cacheKey || abortController.signal.aborted) {
                return;
            }

            // 2. Process appointments
            let appointmentsData = appointmentsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
                deletedAt: doc.data().deletedAt?.toDate() || null,
            })) as Appointment[];

            // Cache ALL appointments for future filter operations
            enhancedCache.setAllAppointments(salonId, appointmentsData);

            // Apply current filters
            const filteredAppointments = applyFiltersToData(appointmentsData);

            // 3. Process services
            const servicesData = servicesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as Service[];

            // Cache services
            enhancedCache.setServices(servicesData);

            // 4. Determine which users to fetch
            const requiredUserIds = [
                ...new Set(
                    filteredAppointments
                        .map(apt => apt.customerId)
                        .filter(Boolean)
                )
            ];

            let customersData: Record<string, User> = {};

            if (requiredUserIds.length > 0) {
                // Get uncached user IDs
                const uncachedUserIds = requiredUserIds.filter(id =>
                    !enhancedCache.hasUser(id) || !enhancedCache.isUsersCacheValid()
                );

                // Fetch only uncached users
                if (uncachedUserIds.length > 0) {
                    const newUsers = await fetchUsersBatch(uncachedUserIds);
                    enhancedCache.setUsers(newUsers);
                }

                // Build customers object from cache
                requiredUserIds.forEach(id => {
                    const user = enhancedCache.getUser(id);
                    if (user) {
                        customersData[id] = user;
                    }
                });
            }

            // Check if this fetch is still current before updating state
            if (currentFetchRef.current === cacheKey && !abortController.signal.aborted) {
                // Batch state updates to minimize re-renders
                setAppointments(filteredAppointments);
                setServices(servicesData);
                setCustomers(customersData);
                hasInitialDataRef.current = true;
            }

        } catch (err: any) {
            if (!abortController.signal.aborted && currentFetchRef.current === cacheKey) {
                console.error('Error fetching appointments:', err);
                setError(err.message || 'Failed to fetch appointments');
            }
        } finally {
            if (!abortController.signal.aborted && currentFetchRef.current === cacheKey) {
                setLoading(false);
            }
        }
    }, [salonId, cacheKey, isFilterChange, applyFiltersToData]);

    // Manual refresh function
    const refresh = useCallback(async () => {
        enhancedCache.clearAppointments();
        hasInitialDataRef.current = false;
        setLoading(true);
        await fetchAppointments();
    }, [fetchAppointments]);

    // Effect with stable dependencies
    useEffect(() => {
        // For filter changes with cached data, don't fetch immediately
        if (isFilterChange && enhancedCache.getAllAppointments(salonId || '')) {
            // Background revalidation for filter changes
            const timeoutId = setTimeout(() => {
                fetchAppointments();
            }, 100); // Small delay to avoid blocking UI

            return () => clearTimeout(timeoutId);
        }

        // Immediate fetch for initial load or salon change
        fetchAppointments();

        // Cleanup function
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchAppointments, isFilterChange, salonId]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        appointments,
        services,
        customers,
        loading,
        error,
        refresh,
    };
};

// Additional hook for computed values to avoid recalculation in component
export const useAppointmentStats = (appointments: Appointment[]) => {
    return useMemo(() => {
        const active = appointments.filter(apt => !apt.deleted);

        return {
            total: active.length,
            pending: active.filter(apt => apt.status === 'pending').length,
            confirmed: active.filter(apt => apt.status === 'confirmed').length,
            completed: active.filter(apt => apt.status === 'completed').length,
            cancelled: active.filter(apt => apt.status === 'cancelled').length,
            deleted: appointments.filter(apt => apt.deleted).length,
        };
    }, [appointments]);
};

// Utility hook for customer info
export const useCustomerInfo = (customers: Record<string, User>) => {
    return useCallback((customerId: string, appointment: Appointment) => {
        const customer = customers[customerId];

        if (customer) {
            return {
                name: customer.displayName || 'Unknown Customer',
                phone: customer.phone || null,
                email: customer.email || null,
            };
        }

        if (appointment.customerInfo) {
            return {
                name: appointment.customerInfo.name || 'Guest Customer',
                phone: appointment.customerInfo.phone || null,
                email: appointment.customerInfo.email || null,
            };
        }

        return {
            name: 'Unknown Customer',
            phone: null,
            email: null,
        };
    }, [customers]);
};
