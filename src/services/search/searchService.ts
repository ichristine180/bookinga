import { salonService } from '@/services/firebase/salonService';
import { serviceService } from '@/services/firebase/serviceService';
import { staffService } from '@/services/firebase/staffService';
import { ServiceResponse } from '@/services/firebase/baseService';
import { Salon, Service, Staff } from '@/types';

export interface SearchResults {
  salons: Salon[];
  services: Service[];
  staff: Staff[];
}

export interface SearchFilters {
  city?: string;
  businessType?: string;
  serviceCategory?: string;
  staffSpecialty?: string;
}

export interface SearchOptions {
  limit?: number;
}

export const searchSalons = async (query: string, filters: SearchFilters = {}, options: SearchOptions = {}): Promise<ServiceResponse<Salon[]>> => {
  const result = await salonService.getActiveSalons({
    city: filters.city,
    businessType: filters.businessType,
    limit: options.limit,
  });
  if (result.success && result.data) {
    const filteredSalons = result.data.items.filter(
      (salon: Salon) =>
        salon.name.toLowerCase().includes(query.toLowerCase()) || salon.description.toLowerCase().includes(query.toLowerCase()) || salon.address.city.toLowerCase().includes(query.toLowerCase())
    );
    return { success: true, data: filteredSalons };
  }
  return { success: false, error: result.error };
};

export const searchServices = async (query: string, filters: SearchFilters = {}, options: SearchOptions = {}): Promise<ServiceResponse<Service[]>> => {
  const result = await serviceService.getActiveServices({
    category: filters.serviceCategory,
    limit: options.limit,
  });
  if (result.success && result.data) {
    const filteredServices = result.data.items.filter((service: Service) => {
      return (
        service.name.toLowerCase().includes(query.toLowerCase()) || service.description.toLowerCase().includes(query.toLowerCase()) || service.category.toLowerCase().includes(query.toLowerCase())
      );
    });
    return { success: true, data: filteredServices };
  }
  return { success: false, error: result.error };
};

export const searchStaff = async (query: string, filters: SearchFilters = {}, options: SearchOptions = {}): Promise<ServiceResponse<Staff[]>> => {
  const result = await staffService.getActiveStaff({
    specialty: filters.staffSpecialty,
    limit: options.limit,
  });
  if (result.success && result.data) {
    const filteredStaff = result.data.items.filter(
      (staff: Staff) => staff.name.toLowerCase().includes(query.toLowerCase()) || (staff.specialties && staff.specialties.some((spec: string) => spec.toLowerCase().includes(query.toLowerCase())))
    );
    return { success: true, data: filteredStaff };
  }
  return { success: false, error: result.error };
};

export const getPopularSearches = async (): Promise<ServiceResponse<string[]>> => {
  try {
    const popularSearches = [
      'hair styling',
      'haircut',
      'manicure',
      'pedicure',
      'facial',
      'massage',
      'hair coloring',
      'eyebrow shaping',
      'makeup',
      'nail art',
      'hair treatment',
      'spa services',
      'bridal package',
      "men's grooming",
      'beard trim',
    ];

    return {
      success: true,
      data: popularSearches,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const getSuggestions = async (query: string): Promise<ServiceResponse<string[]>> => {
  try {
    const suggestions: string[] = [];

    const categoriesResult = await serviceService.getServiceCategories();
    if (categoriesResult.success && categoriesResult.data) {
      const matchingCategories = categoriesResult.data.filter((category: string) => category.toLowerCase().includes(query.toLowerCase()));
      suggestions.push(...matchingCategories);
    }

    const specialtiesResult = await staffService.getStaffSpecialties();
    if (specialtiesResult.success && specialtiesResult.data) {
      const matchingSpecialties = specialtiesResult.data.filter((specialty) => specialty.toLowerCase().includes(query.toLowerCase()));
      suggestions.push(...matchingSpecialties);
    }

    const uniqueSuggestions = Array.from(new Set(suggestions));

    return {
      success: true,
      data: uniqueSuggestions.slice(0, 10),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const searchByLocation = async (location: string, query?: string, options?: SearchOptions): Promise<ServiceResponse<SearchResults>> => {
  try {
    const filters: SearchFilters = {
      city: location,
    };

    return await search(query || '', filters, options);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const searchByCategory = async (category: string, options?: SearchOptions & { city?: string }): Promise<ServiceResponse<SearchResults>> => {
  try {
    const filters: SearchFilters = {
      serviceCategory: category,
      city: options?.city,
    };

    return await search('', filters, options);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const searchByPriceRange = async (_priceRange: { min: number; max: number }, options?: SearchOptions & { city?: string; serviceCategory?: string }): Promise<ServiceResponse<SearchResults>> => {
  try {
    const filters: SearchFilters = {
      serviceCategory: options?.serviceCategory,
      city: options?.city,
    };

    return await search('', filters, options);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const search = async (query: string, filters: SearchFilters = {}, options: SearchOptions = {}): Promise<ServiceResponse<SearchResults>> => {
  try {
    const [salonsResult, servicesResult, staffResult] = await Promise.all([searchSalons(query, filters, options), searchServices(query, filters, options), searchStaff(query, filters, options)]);

    return {
      success: true,
      data: {
        salons: salonsResult.success ? salonsResult.data || [] : [],
        services: servicesResult.success ? servicesResult.data || [] : [],
        staff: staffResult.success ? staffResult.data || [] : [],
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

const searchService = {
  searchSalons,
  searchServices,
  searchStaff,
  getPopularSearches,
  getSuggestions,
  searchByLocation,
  searchByCategory,
  searchByPriceRange,
  search,
};

export default searchService;
