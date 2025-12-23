
export { default as salonService } from '@/services/firebase/salonService';
export { default as serviceService } from '@/services/firebase/serviceService';
export { default as appointmentService } from '@/services/firebase/appointmentService';
export { default as staffService } from '@/services/firebase/staffService';
export { default as userService } from '@/services/firebase/userService';
export { BaseService } from '@/services/firebase/baseService';


export { default as dashboardService } from '@/services/analytics/dashboardService';


export { default as searchService } from '@/services/search/searchService';


export { emailService } from '@/services/emailService';


export type { ServiceResponse, ListResponse } from '@/services/firebase/baseService';
export type {
  SalonUpdateData,
  SalonFilters
} from '@/services/firebase/salonService';
export type {
  ServiceCreateData,
  ServiceUpdateData,
  ServiceFilters
} from '@/services/firebase/serviceService';
export type {
  AppointmentCreateData,
  AppointmentUpdateData,
  AppointmentFilters
} from '@/services/firebase/appointmentService';
export type {
  StaffCreateData,
  StaffUpdateData,
  StaffFilters
} from '@/services/firebase/staffService';
export type {
  UserCreateData,
  UserUpdateData,
  UserFilters
} from '@/services/firebase/userService';
export type {
  DashboardStats,
  SalonDashboardStats,
  SuperAdminDashboardStats
} from '@/services/analytics/dashboardService';
export type {
  SearchResults,
  SearchFilters,
  SearchOptions
} from '@/services/search/searchService';