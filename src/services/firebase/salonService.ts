import { BaseService, ServiceResponse, ListResponse } from '@/services/firebase/baseService';
import { Salon, UserApprovalStatus } from '@/types';



export interface SalonUpdateData {
  name?: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  images?: string[];
  workingHours?: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  businessType?: string;
  businessLicense?: string;
  taxNumber?: string;
  capacity?: number;
  isActive?: boolean;
  approvalStatus?: UserApprovalStatus;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
}

export interface SalonFilters {
  city?: string;
  state?: string;
  businessType?: string;
  isActive?: boolean;
  approvalStatus?: UserApprovalStatus;
  ownerId?: string;
}

class SalonService extends BaseService<Salon> {
  constructor() {
    super('salons');
  }

  async createSalon(data: Salon): Promise<ServiceResponse<Salon>> {
    const salonData = {
      ...data,
      isActive: data.isActive ?? true,
      approvalStatus: data.approvalStatus ?? 'pending',
      subscription: {
        plan: 'basic' as const,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      },
    };

    return this.create(salonData);
  }

  async updateSalon(id: string, data: Salon): Promise<ServiceResponse<Salon>> {
    return this.update(id, data);
  }

  async deleteSalon(id: string): Promise<ServiceResponse<boolean>> {
    return this.delete(id);
  }

  async getSalonById(id: string): Promise<ServiceResponse<Salon>> {
    return this.getById(id);
  }

  async getSalonsByOwner(ownerId: string): Promise<ServiceResponse<ListResponse<Salon>>> {
    return this.list({
      where: [{ field: 'ownerId', operator: '==', value: ownerId }],
      orderBy: { field: 'createdAt', direction: 'desc' },
    });
  }

  async getSalonsByCity(city: string, options?: {
    isActive?: boolean;
    approvalStatus?: UserApprovalStatus;
    limit?: number;
  }): Promise<ServiceResponse<ListResponse<Salon>>> {
    const whereConditions: { field: string; operator: any; value: any }[] = [
      { field: 'address.city', operator: '==', value: city }
    ];

    if (options?.isActive !== undefined) {
      whereConditions.push({ field: 'isActive', operator: '==', value: options.isActive });
    }

    if (options?.approvalStatus) {
      whereConditions.push({ field: 'approvalStatus', operator: '==', value: options.approvalStatus });
    }

    return this.list({
      where: whereConditions,
      orderBy: { field: 'name', direction: 'asc' },
      limit: options?.limit,
    });
  }

  async getActiveSalons(options?: {
    city?: string;
    businessType?: string;
    limit?: number;
  }): Promise<ServiceResponse<ListResponse<Salon>>> {
    const whereConditions: { field: string; operator: any; value: any }[] = [
      { field: 'isActive', operator: '==', value: true },
      { field: 'approvalStatus', operator: '==', value: 'approved' }
    ];

    if (options?.city) {
      whereConditions.push({ field: 'address.city', operator: '==', value: options.city });
    }

    if (options?.businessType) {
      whereConditions.push({ field: 'businessType', operator: '==', value: options.businessType });
    }

    return this.list({
      where: whereConditions,
      orderBy: { field: 'name', direction: 'asc' },
      limit: options?.limit,
    });
  }

  async getPendingSalons(limit?: number): Promise<ServiceResponse<ListResponse<Salon>>> {
    return this.list({
      where: [{ field: 'approvalStatus', operator: '==', value: 'pending' }],
      orderBy: { field: 'createdAt', direction: 'asc' },
      limit,
    });
  }

  async approveSalon(id: string, approvedBy: string): Promise<ServiceResponse<Salon>> {
    return this.update(id, {
      approvalStatus: 'approved',
      approvedBy,
      approvedAt: new Date(),
    });
  }

  async rejectSalon(id: string, rejectionReason: string, rejectedBy: string): Promise<ServiceResponse<Salon>> {
    return this.update(id, {
      approvalStatus: 'rejected',
      rejectionReason,
      approvedBy: rejectedBy,
      approvedAt: new Date(),
    });
  }

  async searchSalons(searchTerm: string, options?: {
    city?: string;
    businessType?: string;
    isActive?: boolean;
    limit?: number;
  }): Promise<ServiceResponse<ListResponse<Salon>>> {
    const whereConditions: { field: string; operator: any; value: any }[] = [];

    if (options?.city) {
      whereConditions.push({ field: 'address.city', operator: '==', value: options.city });
    }

    if (options?.businessType) {
      whereConditions.push({ field: 'businessType', operator: '==', value: options.businessType });
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
      const filteredItems = result.data.items.filter(salon =>
        salon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salon.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salon.address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salon.businessType.toLowerCase().includes(searchTerm.toLowerCase())
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

  async toggleSalonStatus(id: string, isActive: boolean): Promise<ServiceResponse<Salon>> {
    return this.update(id, { isActive });
  }

  async updateWorkingHours(id: string, workingHours: Salon['workingHours']): Promise<ServiceResponse<Salon>> {
    return this.update(id, { workingHours });
  }

  async addImages(id: string, images: string[]): Promise<ServiceResponse<Salon>> {
    const salon = await this.getById(id);
    if (!salon.success || !salon.data) {
      return salon;
    }

    const currentImages = salon.data.images || [];
    const updatedImages = [...currentImages, ...images];

    return this.update(id, { images: updatedImages });
  }

  async removeImage(id: string, imageUrl: string): Promise<ServiceResponse<Salon>> {
    const salon = await this.getById(id);
    if (!salon.success || !salon.data) {
      return salon;
    }

    const currentImages = salon.data.images || [];
    const updatedImages = currentImages.filter(img => img !== imageUrl);

    return this.update(id, { images: updatedImages });
  }
}

export const salonService = new SalonService();
export default salonService;