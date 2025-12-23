import { BaseService, ServiceResponse, ListResponse } from '@/services/firebase/baseService';
import { Appointment, AppointmentStatus } from '@/types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface AppointmentCreateData {
  salonId: string;
  customerId: string;
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
  duration: number;
  totalAmount: number;
  currency: string;
  specialInstructions?: string;
  status?: AppointmentStatus;
}

export interface AppointmentUpdateData {
  salonId?: string;
  customerId?: string;
  serviceId?: string;
  staffId?: string;
  date?: string;
  time?: string;
  duration?: number;
  status?: AppointmentStatus;
  totalAmount?: number;
  currency?: string;
  specialInstructions?: string;
  deleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface AppointmentFilters {
  salonId?: string;
  customerId?: string;
  serviceId?: string;
  staffId?: string;
  status?: AppointmentStatus;
  date?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

class AppointmentService extends BaseService<Appointment> {
  constructor() {
    super('appointments');
  }

  async createAppointment(data: AppointmentCreateData): Promise<ServiceResponse<Appointment>> {
    return this.create({
      ...data,
      status: data.status || 'pending',
      deleted: false,
    });
  }

  async updateAppointment(id: string, data: AppointmentUpdateData): Promise<ServiceResponse<Appointment>> {
    return this.update(id, data);
  }

  async deleteAppointment(id: string, deletedBy?: string): Promise<ServiceResponse<boolean>> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        deleted: true,
        deletedAt: new Date(),
        deletedBy: deletedBy || 'system',
        updatedAt: new Date(),
      });

      return {
        success: true,
        data: true,
      };
    } catch (error) {
      console.error(`Error soft deleting ${this.collectionName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async restoreAppointment(id: string): Promise<ServiceResponse<Appointment>> {
    try {
      const docRef = doc(db, this.collectionName, id);
      await updateDoc(docRef, {
        deleted: false,
        deletedAt: null,
        deletedBy: null,
        updatedAt: new Date(),
      });

      return this.getById(id);
    } catch (error) {
      console.error(`Error restoring ${this.collectionName}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getAppointmentById(id: string): Promise<ServiceResponse<Appointment>> {
    return this.getById(id);
  }

  async getAppointmentsByCustomer(customerId: string, options?: {
    status?: AppointmentStatus;
    dateRange?: { start: string; end: string };
    limit?: number;
    includeDeleted?: boolean;
  }): Promise<ServiceResponse<ListResponse<Appointment>>> {
    const whereConditions: { field: string; operator: any; value: any }[] = [
      { field: 'customerId', operator: '==', value: customerId }
    ];

    if (!options?.includeDeleted) {
      whereConditions.push({ field: 'deleted', operator: '==', value: false });
    }

    if (options?.status) {
      whereConditions.push({ field: 'status', operator: '==', value: options.status });
    }

    if (options?.dateRange) {
      whereConditions.push({ field: 'date', operator: '>=', value: options.dateRange.start });
      whereConditions.push({ field: 'date', operator: '<=', value: options.dateRange.end });
    }

    return this.list({
      where: whereConditions,
      orderBy: { field: 'date', direction: 'desc' },
      limit: options?.limit,
    });
  }

  async getAppointmentsBySalon(salonId: string, options?: {
    status?: AppointmentStatus;
    date?: string;
    dateRange?: { start: string; end: string };
    staffId?: string;
    limit?: number;
    includeDeleted?: boolean;
  }): Promise<ServiceResponse<ListResponse<Appointment>>> {
    const whereConditions: { field: string; operator: any; value: any }[] = [
      { field: 'salonId', operator: '==', value: salonId }
    ];

    if (!options?.includeDeleted) {
      whereConditions.push({ field: 'deleted', operator: '==', value: false });
    }

    if (options?.status) {
      whereConditions.push({ field: 'status', operator: '==', value: options.status });
    }

    if (options?.date) {
      whereConditions.push({ field: 'date', operator: '==', value: options.date });
    }

    if (options?.dateRange) {
      whereConditions.push({ field: 'date', operator: '>=', value: options.dateRange.start });
      whereConditions.push({ field: 'date', operator: '<=', value: options.dateRange.end });
    }

    if (options?.staffId) {
      whereConditions.push({ field: 'staffId', operator: '==', value: options.staffId });
    }

    return this.list({
      where: whereConditions,
      orderBy: { field: 'date', direction: 'desc' },
      limit: options?.limit,
    });
  }

  async getAppointmentsByStaff(staffId: string, options?: {
    status?: AppointmentStatus;
    date?: string;
    dateRange?: { start: string; end: string };
    limit?: number;
    includeDeleted?: boolean;
  }): Promise<ServiceResponse<ListResponse<Appointment>>> {
    const whereConditions: { field: string; operator: any; value: any }[] = [
      { field: 'staffId', operator: '==', value: staffId }
    ];

    if (!options?.includeDeleted) {
      whereConditions.push({ field: 'deleted', operator: '==', value: false });
    }

    if (options?.status) {
      whereConditions.push({ field: 'status', operator: '==', value: options.status });
    }

    if (options?.date) {
      whereConditions.push({ field: 'date', operator: '==', value: options.date });
    }

    if (options?.dateRange) {
      whereConditions.push({ field: 'date', operator: '>=', value: options.dateRange.start });
      whereConditions.push({ field: 'date', operator: '<=', value: options.dateRange.end });
    }

    return this.list({
      where: whereConditions,
      orderBy: { field: 'date', direction: 'asc' },
      limit: options?.limit,
    });
  }

  async getAppointmentsByDate(date: string, options?: {
    salonId?: string;
    staffId?: string;
    status?: AppointmentStatus;
    includeDeleted?: boolean;
  }): Promise<ServiceResponse<ListResponse<Appointment>>> {
    const whereConditions: { field: string; operator: any; value: any }[] = [
      { field: 'date', operator: '==', value: date }
    ];

    if (!options?.includeDeleted) {
      whereConditions.push({ field: 'deleted', operator: '==', value: false });
    }

    if (options?.salonId) {
      whereConditions.push({ field: 'salonId', operator: '==', value: options.salonId });
    }

    if (options?.staffId) {
      whereConditions.push({ field: 'staffId', operator: '==', value: options.staffId });
    }

    if (options?.status) {
      whereConditions.push({ field: 'status', operator: '==', value: options.status });
    }

    return this.list({
      where: whereConditions,
      orderBy: { field: 'time', direction: 'asc' },
    });
  }

  async updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<ServiceResponse<Appointment>> {
    return this.update(id, { status });
  }

  async confirmAppointment(id: string): Promise<ServiceResponse<Appointment>> {
    return this.updateAppointmentStatus(id, 'confirmed');
  }

  async rejectAppointment(id: string, comment?: string): Promise<ServiceResponse<Appointment>> {
    const updateData: any = { status: 'cancelled' };
    if (comment) {
      updateData.rejectionComment = comment;
      updateData.rejectionDate = new Date();
    }
    return this.update(id, updateData);
  }

  async cancelAppointment(id: string): Promise<ServiceResponse<Appointment>> {
    return this.updateAppointmentStatus(id, 'cancelled');
  }

  async completeAppointment(id: string): Promise<ServiceResponse<Appointment>> {
    return this.updateAppointmentStatus(id, 'completed');
  }

  async rescheduleAppointment(id: string, newDate: string, newTime: string): Promise<ServiceResponse<Appointment>> {
    return this.update(id, { date: newDate, time: newTime });
  }

  async getTodayAppointments(options?: {
    salonId?: string;
    staffId?: string;
    customerId?: string;
    status?: AppointmentStatus;
    includeDeleted?: boolean;
  }): Promise<ServiceResponse<ListResponse<Appointment>>> {
    const today = new Date().toISOString().split('T')[0];
    return this.getAppointmentsByDate(today, options);
  }

  async getUpcomingAppointments(options?: {
    salonId?: string;
    staffId?: string;
    customerId?: string;
    status?: AppointmentStatus;
    days?: number;
    includeDeleted?: boolean;
  }): Promise<ServiceResponse<ListResponse<Appointment>>> {
    const today = new Date();
    const endDate = new Date(today.getTime() + (options?.days || 7) * 24 * 60 * 60 * 1000);

    const whereConditions: { field: string; operator: any; value: any }[] = [
      { field: 'date', operator: '>=', value: today.toISOString().split('T')[0] },
      { field: 'date', operator: '<=', value: endDate.toISOString().split('T')[0] }
    ];

    if (!options?.includeDeleted) {
      whereConditions.push({ field: 'deleted', operator: '==', value: false });
    }

    if (options?.salonId) {
      whereConditions.push({ field: 'salonId', operator: '==', value: options.salonId });
    }

    if (options?.staffId) {
      whereConditions.push({ field: 'staffId', operator: '==', value: options.staffId });
    }

    if (options?.customerId) {
      whereConditions.push({ field: 'customerId', operator: '==', value: options.customerId });
    }

    if (options?.status) {
      whereConditions.push({ field: 'status', operator: '==', value: options.status });
    }

    return this.list({
      where: whereConditions,
      orderBy: { field: 'date', direction: 'asc' },
    });
  }

  async checkTimeSlotAvailability(
    salonId: string,
    staffId: string,
    date: string,
    time: string,
    duration: number,
    excludeAppointmentId?: string
  ): Promise<ServiceResponse<boolean>> {
    try {
      const whereConditions: { field: string; operator: any; value: any }[] = [
        { field: 'salonId', operator: '==', value: salonId },
        { field: 'staffId', operator: '==', value: staffId },
        { field: 'date', operator: '==', value: date },
        { field: 'status', operator: 'in', value: ['pending', 'confirmed', 'in_progress'] },
        { field: 'deleted', operator: '==', value: false }
      ];

      const result = await this.list({
        where: whereConditions,
      });

      if (!result.success || !result.data) {
        return { success: false, error: result.error };
      }

      const appointments = result.data.items;

      if (excludeAppointmentId) {
        const filteredAppointments = appointments.filter(apt => apt.id !== excludeAppointmentId);
        appointments.splice(0, appointments.length, ...filteredAppointments);
      }

      const requestedStart = new Date(`${date}T${time}`);
      const requestedEnd = new Date(requestedStart.getTime() + duration * 60000);

      const isAvailable = !appointments.some(appointment => {
        const appointmentStart = new Date(`${appointment.date}T${appointment.time}`);
        const appointmentEnd = new Date(appointmentStart.getTime() + appointment.duration * 60000);

        return (
          (requestedStart >= appointmentStart && requestedStart < appointmentEnd) ||
          (requestedEnd > appointmentStart && requestedEnd <= appointmentEnd) ||
          (requestedStart <= appointmentStart && requestedEnd >= appointmentEnd)
        );
      });

      return {
        success: true,
        data: isAvailable,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const appointmentService = new AppointmentService();
export default appointmentService;