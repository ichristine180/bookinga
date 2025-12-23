import { appointmentService } from '@/services/firebase/appointmentService';
import { serviceService } from '@/services/firebase/serviceService';
import { salonService } from '@/services/firebase/salonService';
import { userService } from '@/services/firebase/userService';
import { ServiceResponse } from '@/services/firebase/baseService';

export interface DashboardStats {
  totalAppointments: number;
  todayAppointments: number;
  upcomingAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  pendingAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageAppointmentValue: number;
  popularServices: Array<{
    serviceId: string;
    serviceName: string;
    bookingCount: number;
    revenue: number;
  }>;
  appointmentsByStatus: Record<string, number>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    appointments: number;
  }>;
}

export interface SalonDashboardStats extends DashboardStats {
  totalServices: number;
  activeServices: number;
  totalStaff: number;
  activeStaff: number;
  customerCount: number;
  repeatCustomers: number;
}

export interface SuperAdminDashboardStats {
  totalSalons: number;
  activeSalons: number;
  pendingSalons: number;
  rejectedSalons: number;
  totalUsers: number;
  customerCount: number;
  salonAdminCount: number;
  pendingUserApprovals: number;
  totalAppointments: number;
  totalRevenue: number;
  salonsByCity: Record<string, number>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    appointments: number;
  }>;
  topPerformingSalons: Array<{
    salonId: string;
    salonName: string;
    appointments: number;
    revenue: number;
  }>;
}

class DashboardService {
  async getSalonDashboardStats(salonId: string): Promise<ServiceResponse<SalonDashboardStats>> {
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      const [
        allAppointments,
        todayAppointments,
        upcomingAppointments,
        services,
        customers
      ] = await Promise.all([
        appointmentService.getAppointmentsBySalon(salonId, { includeDeleted: false }),
        appointmentService.getTodayAppointments({ salonId, includeDeleted: false }),
        appointmentService.getUpcomingAppointments({ salonId, days: 7, includeDeleted: false }),
        serviceService.getServicesBySalon(salonId),
        userService.getUsersBySalon(salonId, { role: 'customer' })
      ]);

      if (!allAppointments.success || !todayAppointments.success || !upcomingAppointments.success) {
        return {
          success: false,
          error: 'Failed to fetch appointment data',
        };
      }

      const appointments = allAppointments.data!.items;
      const completedAppointments = appointments.filter(apt => apt.status === 'completed');
      const cancelledAppointments = appointments.filter(apt => apt.status === 'cancelled');
      const pendingAppointments = appointments.filter(apt => apt.status === 'pending');

      const totalRevenue = completedAppointments.reduce((sum, apt) => sum + apt.totalAmount, 0);

      const monthlyAppointments = appointments.filter(apt => {
        const appointmentDate = new Date(apt.date);
        return appointmentDate >= startOfMonth && appointmentDate <= endOfMonth;
      });

      const monthlyRevenue = monthlyAppointments
        .filter(apt => apt.status === 'completed')
        .reduce((sum, apt) => sum + apt.totalAmount, 0);

      const averageAppointmentValue = completedAppointments.length > 0
        ? totalRevenue / completedAppointments.length
        : 0;

      const serviceBookings = appointments.reduce((acc, apt) => {
        if (apt.status === 'completed') {
          acc[apt.serviceId] = (acc[apt.serviceId] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const popularServices = await this.getPopularServices(serviceBookings, appointments);

      const appointmentsByStatus = appointments.reduce((acc, apt) => {
        acc[apt.status] = (acc[apt.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const revenueByMonth = await this.getRevenueByMonth(appointments);

      const customerIds = new Set(appointments.map(apt => apt.customerId));
      const repeatCustomers = Array.from(customerIds).filter(customerId =>
        appointments.filter(apt => apt.customerId === customerId).length > 1
      ).length;

      return {
        success: true,
        data: {
          totalAppointments: appointments.length,
          todayAppointments: todayAppointments.data!.items.length,
          upcomingAppointments: upcomingAppointments.data!.items.length,
          completedAppointments: completedAppointments.length,
          cancelledAppointments: cancelledAppointments.length,
          pendingAppointments: pendingAppointments.length,
          totalRevenue,
          monthlyRevenue,
          averageAppointmentValue,
          popularServices,
          appointmentsByStatus,
          revenueByMonth,
          totalServices: services.success ? services.data!.items.length : 0,
          activeServices: services.success ? services.data!.items.filter(s => s.isActive).length : 0,
          totalStaff: 0,
          activeStaff: 0,
          customerCount: customers.success ? customers.data!.items.length : 0,
          repeatCustomers,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getSuperAdminDashboardStats(): Promise<ServiceResponse<SuperAdminDashboardStats>> {
    try {
      const [
        allSalons,
        allUsers,
        allAppointments,
        pendingUserApprovals
      ] = await Promise.all([
        salonService.list({}),
        userService.list({}),
        appointmentService.list({}),
        userService.getPendingUsers()
      ]);

      if (!allSalons.success || !allUsers.success || !allAppointments.success) {
        return {
          success: false,
          error: 'Failed to fetch dashboard data',
        };
      }

      const salons = allSalons.data!.items;
      const users = allUsers.data!.items;
      const appointments = allAppointments.data!.items.filter(apt => !apt.deleted); // Exclude deleted appointments

      const activeSalons = salons.filter(s => s.isActive && s.approvalStatus === 'approved');
      const pendingSalons = salons.filter(s => s.approvalStatus === 'pending');
      const rejectedSalons = salons.filter(s => s.approvalStatus === 'rejected');

      const customers = users.filter(u => u.role === 'customer');
      const salonAdmins = users.filter(u => u.role === 'salon_admin');

      const completedAppointments = appointments.filter(apt => apt.status === 'completed');
      const totalRevenue = completedAppointments.reduce((sum, apt) => sum + apt.totalAmount, 0);

      const salonsByCity = salons.reduce((acc, salon) => {
        const city = salon.address.city;
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const revenueByMonth = await this.getRevenueByMonth(appointments);
      const topPerformingSalons = await this.getTopPerformingSalons(appointments, salons);

      return {
        success: true,
        data: {
          totalSalons: salons.length,
          activeSalons: activeSalons.length,
          pendingSalons: pendingSalons.length,
          rejectedSalons: rejectedSalons.length,
          totalUsers: users.length,
          customerCount: customers.length,
          salonAdminCount: salonAdmins.length,
          pendingUserApprovals: pendingUserApprovals.success ? pendingUserApprovals.data!.items.length : 0,
          totalAppointments: appointments.length,
          totalRevenue,
          salonsByCity,
          revenueByMonth,
          topPerformingSalons,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async getPopularServices(
    serviceBookings: Record<string, number>,
    appointments: any[]
  ): Promise<Array<{
    serviceId: string;
    serviceName: string;
    bookingCount: number;
    revenue: number;
  }>> {
    const popularServices: Array<{
      serviceId: string;
      serviceName: string;
      bookingCount: number;
      revenue: number;
    }> = [];

    for (const [serviceId, count] of Object.entries(serviceBookings)) {
      const service = await serviceService.getServiceById(serviceId);
      const serviceAppointments = appointments.filter(apt =>
        apt.serviceId === serviceId && apt.status === 'completed'
      );
      const revenue = serviceAppointments.reduce((sum, apt) => sum + apt.totalAmount, 0);

      popularServices.push({
        serviceId,
        serviceName: service.success ? service.data!.name : 'Unknown Service',
        bookingCount: count,
        revenue,
      });
    }

    return popularServices.sort((a, b) => b.bookingCount - a.bookingCount).slice(0, 10);
  }

  private async getRevenueByMonth(appointments: any[]): Promise<Array<{
    month: string;
    revenue: number;
    appointments: number;
  }>> {
    const monthlyData: Record<string, { revenue: number; appointments: number }> = {};

    appointments.forEach(apt => {
      if (apt.status === 'completed') {
        const date = new Date(apt.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { revenue: 0, appointments: 0 };
        }

        monthlyData[monthKey].revenue += apt.totalAmount;
        monthlyData[monthKey].appointments += 1;
      }
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({ month, ...data }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  private async getTopPerformingSalons(
    appointments: any[],
    salons: any[]
  ): Promise<Array<{
    salonId: string;
    salonName: string;
    appointments: number;
    revenue: number;
  }>> {
    const salonPerformance: Record<string, { appointments: number; revenue: number; name: string }> = {};

    appointments.forEach(apt => {
      if (apt.status === 'completed') {
        if (!salonPerformance[apt.salonId]) {
          const salon = salons.find(s => s.id === apt.salonId);
          salonPerformance[apt.salonId] = {
            appointments: 0,
            revenue: 0,
            name: salon ? salon.name : 'Unknown Salon',
          };
        }

        salonPerformance[apt.salonId].appointments += 1;
        salonPerformance[apt.salonId].revenue += apt.totalAmount;
      }
    });

    return Object.entries(salonPerformance)
      .map(([salonId, data]) => ({
        salonId,
        salonName: data.name,
        appointments: data.appointments,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;