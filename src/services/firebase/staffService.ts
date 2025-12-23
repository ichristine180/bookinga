import { BaseService, ServiceResponse, ListResponse } from '@/services/firebase/baseService';
import { Staff } from '@/types';

export interface StaffCreateData {
  salonId: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  specialties: string[];
  workingHours: {
    [key: string]: {
      open: string;
      close: string;
      available: boolean;
    };
  };
  isActive?: boolean;
}

export interface StaffUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  specialties?: string[];
  workingHours?: {
    [key: string]: {
      open: string;
      close: string;
      available: boolean;
    };
  };
  isActive?: boolean;
}

export interface StaffFilters {
  salonId?: string;
  specialties?: string[];
  isActive?: boolean;
  availability?: {
    day: string;
    time: string;
  };
}

class StaffService extends BaseService<Staff> {
  constructor() {
    super('staff');
  }

  async createStaff(data: StaffCreateData): Promise<ServiceResponse<Staff>> {
    const staffData = {
      ...data,
      isActive: data.isActive ?? true,
    };

    return this.create(staffData);
  }

  async updateStaff(id: string, data: StaffUpdateData): Promise<ServiceResponse<Staff>> {
    return this.update(id, data);
  }

  async deleteStaff(id: string): Promise<ServiceResponse<boolean>> {
    return this.delete(id);
  }

  async getStaffById(id: string): Promise<ServiceResponse<Staff>> {
    return this.getById(id);
  }

  async getStaffBySalon(salonId: string, options?: {
    isActive?: boolean;
    specialties?: string[];
    limit?: number;
  }): Promise<ServiceResponse<ListResponse<Staff>>> {
    const whereConditions: { field: string; operator: any; value: any }[] = [
      { field: 'salonId', operator: '==', value: salonId }
    ];

    if (options?.isActive !== undefined) {
      whereConditions.push({ field: 'isActive', operator: '==', value: options.isActive });
    }

    const queryOptions = {
      where: whereConditions,
      orderBy: { field: 'name', direction: 'asc' as const },
      limit: options?.limit,
    };

    const result = await this.list(queryOptions);

    if (result.success && result.data && options?.specialties) {
      const filteredItems = result.data.items.filter(staff =>
        options.specialties!.some(specialty =>
          staff.specialties.some(staffSpecialty =>
            staffSpecialty.toLowerCase().includes(specialty.toLowerCase())
          )
        )
      );

      return {
        success: true,
        data: {
          items: filteredItems,
          total: filteredItems.length,
        },
      };
    }

    return result;
  }

  async getActiveStaff(options?: {
    specialty?: string;
    limit?: number;
  }): Promise<ServiceResponse<ListResponse<Staff>>> {
    const whereConditions: { field: string; operator: any; value: any }[] = [
      { field: 'isActive', operator: '==', value: true }
    ];

    const queryOptions = {
      where: whereConditions,
      orderBy: { field: 'name', direction: 'asc' as const },
      limit: options?.limit,
    };

    const result = await this.list(queryOptions);

    if (result.success && result.data && options?.specialty) {
      const filteredItems = result.data.items.filter(staff =>
        staff.specialties.some(staffSpecialty =>
          staffSpecialty.toLowerCase().includes(options.specialty!.toLowerCase())
        )
      );

      return {
        success: true,
        data: {
          items: filteredItems,
          total: filteredItems.length,
        },
      };
    }

    return result;
  }

  async getStaffBySpecialty(specialty: string, options?: {
    salonId?: string;
    isActive?: boolean;
    limit?: number;
  }): Promise<ServiceResponse<ListResponse<Staff>>> {
    const whereConditions: { field: string; operator: any; value: any }[] = [];

    if (options?.salonId) {
      whereConditions.push({ field: 'salonId', operator: '==', value: options.salonId });
    }

    if (options?.isActive !== undefined) {
      whereConditions.push({ field: 'isActive', operator: '==', value: options.isActive });
    }

    const queryOptions = {
      where: whereConditions,
      limit: options?.limit,
    };

    const result = await this.list(queryOptions);

    if (result.success && result.data) {
      const filteredItems = result.data.items.filter(staff =>
        staff.specialties.some(staffSpecialty =>
          staffSpecialty.toLowerCase().includes(specialty.toLowerCase())
        )
      );

      return {
        success: true,
        data: {
          items: filteredItems,
          total: filteredItems.length,
        },
      };
    }

    return result;
  }

  async getAvailableStaff(
    salonId: string,
    day: string,
    time: string,
    options?: {
      specialties?: string[];
      isActive?: boolean;
    }
  ): Promise<ServiceResponse<ListResponse<Staff>>> {
    const whereConditions: { field: string; operator: any; value: any }[] = [
      { field: 'salonId', operator: '==', value: salonId }
    ];

    if (options?.isActive !== undefined) {
      whereConditions.push({ field: 'isActive', operator: '==', value: options.isActive });
    }

    const result = await this.list({
      where: whereConditions,
    });

    if (result.success && result.data) {
      const availableStaff = result.data.items.filter(staff => {
        const daySchedule = staff.workingHours[day];
        if (!daySchedule || !daySchedule.available) {
          return false;
        }

        const requestedTime = new Date(`1970-01-01T${time}`);
        const openTime = new Date(`1970-01-01T${daySchedule.open}`);
        const closeTime = new Date(`1970-01-01T${daySchedule.close}`);

        const isInWorkingHours = requestedTime >= openTime && requestedTime <= closeTime;

        if (!isInWorkingHours) {
          return false;
        }

        if (options?.specialties && options.specialties.length > 0) {
          return options.specialties.some(specialty =>
            staff.specialties.some(staffSpecialty =>
              staffSpecialty.toLowerCase().includes(specialty.toLowerCase())
            )
          );
        }

        return true;
      });

      return {
        success: true,
        data: {
          items: availableStaff,
          total: availableStaff.length,
        },
      };
    }

    return result;
  }

  async toggleStaffStatus(id: string, isActive: boolean): Promise<ServiceResponse<Staff>> {
    return this.update(id, { isActive });
  }

  async updateWorkingHours(id: string, workingHours: Staff['workingHours']): Promise<ServiceResponse<Staff>> {
    return this.update(id, { workingHours });
  }

  async addSpecialty(id: string, specialty: string): Promise<ServiceResponse<Staff>> {
    const staff = await this.getById(id);
    if (!staff.success || !staff.data) {
      return staff;
    }

    const currentSpecialties = staff.data.specialties || [];
    if (!currentSpecialties.includes(specialty)) {
      const updatedSpecialties = [...currentSpecialties, specialty];
      return this.update(id, { specialties: updatedSpecialties });
    }

    return staff;
  }

  async removeSpecialty(id: string, specialty: string): Promise<ServiceResponse<Staff>> {
    const staff = await this.getById(id);
    if (!staff.success || !staff.data) {
      return staff;
    }

    const currentSpecialties = staff.data.specialties || [];
    const updatedSpecialties = currentSpecialties.filter(s => s !== specialty);

    return this.update(id, { specialties: updatedSpecialties });
  }

  async updateAvatar(id: string, avatar: string): Promise<ServiceResponse<Staff>> {
    return this.update(id, { avatar });
  }

  async searchStaff(searchTerm: string, options?: {
    salonId?: string;
    isActive?: boolean;
    limit?: number;
  }): Promise<ServiceResponse<ListResponse<Staff>>> {
    const whereConditions: { field: string; operator: any; value: any }[] = [];

    if (options?.salonId) {
      whereConditions.push({ field: 'salonId', operator: '==', value: options.salonId });
    }

    if (options?.isActive !== undefined) {
      whereConditions.push({ field: 'isActive', operator: '==', value: options.isActive });
    }

    const queryOptions = {
      where: whereConditions,
      limit: options?.limit,
    };

    const result = await this.list(queryOptions);

    if (result.success && result.data) {
      const filteredItems = result.data.items.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.phone.includes(searchTerm) ||
        staff.specialties.some(specialty =>
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      return {
        success: true,
        data: {
          items: filteredItems,
          total: filteredItems.length,
        },
      };
    }

    return result;
  }

  async getStaffSpecialties(salonId?: string): Promise<ServiceResponse<string[]>> {
    try {
      const whereConditions: { field: string; operator: any; value: any }[] = [
        { field: 'isActive', operator: '==', value: true }
      ];

      if (salonId) {
        whereConditions.push({ field: 'salonId', operator: '==', value: salonId });
      }

      const result = await this.list({
        where: whereConditions,
      });

      if (result.success && result.data) {
        const allSpecialties = result.data.items.flatMap(staff => staff.specialties);
        const uniqueSpecialties = Array.from(new Set(allSpecialties));

        return {
          success: true,
          data: uniqueSpecialties,
        };
      }

      return {
        success: false,
        error: result.error,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const staffService = new StaffService();
export default staffService;