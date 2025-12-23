import { BaseService, ServiceResponse, ListResponse } from '@/services/firebase/baseService';
import { Service } from '@/types';

export interface ServiceCreateData {
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  duration: number;
  images?: string[];
  salonId: string;
  isActive?: boolean;
}

export interface ServiceUpdateData {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  currency?: string;
  duration?: number;
  images?: string[];
  isActive?: boolean;
}

export interface ServiceFilters {
  salonId?: string;
  category?: string;
  isActive?: boolean;
}

class ServiceService extends BaseService<Service> {
  constructor() {
    super('services');
  }

  async createService(data: ServiceCreateData): Promise<ServiceResponse<Service>> {
    return this.create({ ...data, isActive: data.isActive ?? true });
  }

  async updateService(id: string, data: ServiceUpdateData): Promise<ServiceResponse<Service>> {
    return this.update(id, data);
  }

  async deleteService(id: string): Promise<ServiceResponse<boolean>> {
    return this.delete(id);
  }

  async getServiceById(id: string): Promise<ServiceResponse<Service>> {
    return this.getById(id);
  }

  async getServicesBySalon(salonId: string, options?: { isActive?: boolean; category?: string; limit?: number; }): Promise<ServiceResponse<ListResponse<Service>>> {
    const whereConditions: { field: string; operator: any; value: any }[] = [
      { field: 'salonId', operator: '==', value: salonId }
    ];
    if (options?.isActive !== undefined) {
      whereConditions.push({ field: 'isActive', operator: '==', value: options.isActive });
    }
    if (options?.category) {
      whereConditions.push({ field: 'category', operator: '==', value: options.category });
    }
    return this.list({
      where: whereConditions,
      orderBy: { field: 'name', direction: 'asc' },
      limit: options?.limit,
    });
  }

  async getActiveServices(options?: { category?: string; limit?: number; }): Promise<ServiceResponse<ListResponse<Service>>> {
    const whereConditions: { field: string; operator: any; value: any }[] = [
      { field: 'isActive', operator: '==', value: true }
    ];
    if (options?.category) {
      whereConditions.push({ field: 'category', operator: '==', value: options.category });
    }
    return this.list({
      where: whereConditions,
      orderBy: { field: 'name', direction: 'asc' },
      limit: options?.limit,
    });
  }

  async getServiceCategories(): Promise<ServiceResponse<string[]>> {
    try {
      const result = await this.list({
        where: [{ field: 'isActive', operator: '==', value: true }],
      });

      if (result.success && result.data) {
        const categories = result.data.items.map(service => service.category);
        const uniqueCategories = Array.from(new Set(categories));

        return {
          success: true,
          data: uniqueCategories,
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

const serviceService = new ServiceService();
export { serviceService };

export default serviceService;