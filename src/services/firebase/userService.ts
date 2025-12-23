import { BaseService, ServiceResponse, ListResponse } from '@/services/firebase/baseService';
import { User, UserRole, UserApprovalStatus } from '@/types';

export interface UserCreateData {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  salonId?: string;
  approvalStatus?: UserApprovalStatus;
  profileCompleted?: boolean;
  emailVerified?: boolean;
}

export interface UserUpdateData {
  displayName?: string;
  phone?: string;
  avatar?: string;
  salonId?: string;
  approvalStatus?: UserApprovalStatus;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  profileCompleted?: boolean;
  emailVerified?: boolean;
}

export interface UserFilters {
  role?: UserRole;
  approvalStatus?: UserApprovalStatus;
  salonId?: string;
  emailVerified?: boolean;
  profileCompleted?: boolean;
}

class UserService extends BaseService<User> {
  constructor() {
    super('users');
  }

  async createUser(data: UserCreateData): Promise<ServiceResponse<User>> {
    const userData = {
      ...data,
      approvalStatus: data.approvalStatus ?? 'pending',
      profileCompleted: data.profileCompleted ?? false,
      emailVerified: data.emailVerified ?? false,
    };

    return this.create(userData);
  }

  async updateUser(id: string, data: UserUpdateData): Promise<ServiceResponse<User>> {
    return this.update(id, data);
  }

  async deleteUser(id: string): Promise<ServiceResponse<boolean>> {
    return this.delete(id);
  }

  async getUserById(id: string): Promise<ServiceResponse<User>> {
    return this.getById(id);
  }

  async getUserByUID(uid: string): Promise<ServiceResponse<User>> {
    const result = await this.list({
      where: [{ field: 'uid', operator: '==', value: uid }],
      limit: 1,
    });

    if (result.success && result.data && result.data.items.length > 0) {
      return {
        success: true,
        data: result.data.items[0],
      };
    }

    return {
      success: false,
      error: 'User not found',
    };
  }

  async getUserByEmail(email: string): Promise<ServiceResponse<User>> {
    const result = await this.list({
      where: [{ field: 'email', operator: '==', value: email }],
      limit: 1,
    });

    if (result.success && result.data && result.data.items.length > 0) {
      return {
        success: true,
        data: result.data.items[0],
      };
    }

    return {
      success: false,
      error: 'User not found',
    };
  }

  async getUsersByRole(role: UserRole, options?: {
    approvalStatus?: UserApprovalStatus;
    salonId?: string;
    limit?: number;
  }): Promise<ServiceResponse<ListResponse<User>>> {
    const whereConditions: { field: string; operator: any; value: any }[] = [
      { field: 'role', operator: '==', value: role }
    ];

    if (options?.approvalStatus) {
      whereConditions.push({ field: 'approvalStatus', operator: '==', value: options.approvalStatus });
    }

    if (options?.salonId) {
      whereConditions.push({ field: 'salonId', operator: '==', value: options.salonId });
    }

    return this.list({
      where: whereConditions,
      orderBy: { field: 'createdAt', direction: 'desc' },
      limit: options?.limit,
    });
  }

  async getUsersBySalon(salonId: string, options?: {
    role?: UserRole;
    approvalStatus?: UserApprovalStatus;
    limit?: number;
  }): Promise<ServiceResponse<ListResponse<User>>> {
    const whereConditions: { field: string; operator: any; value: any }[] = [
      { field: 'salonId', operator: '==', value: salonId }
    ];

    if (options?.role) {
      whereConditions.push({ field: 'role', operator: '==', value: options.role });
    }

    if (options?.approvalStatus) {
      whereConditions.push({ field: 'approvalStatus', operator: '==', value: options.approvalStatus });
    }

    return this.list({
      where: whereConditions,
      orderBy: { field: 'createdAt', direction: 'desc' },
      limit: options?.limit,
    });
  }

  async getPendingUsers(options?: {
    role?: UserRole;
    salonId?: string;
    limit?: number;
  }): Promise<ServiceResponse<ListResponse<User>>> {
    const whereConditions: { field: string; operator: any; value: any }[] = [
      { field: 'approvalStatus', operator: '==', value: 'pending' }
    ];

    if (options?.role) {
      whereConditions.push({ field: 'role', operator: '==', value: options.role });
    }

    if (options?.salonId) {
      whereConditions.push({ field: 'salonId', operator: '==', value: options.salonId });
    }

    return this.list({
      where: whereConditions,
      orderBy: { field: 'createdAt', direction: 'asc' },
      limit: options?.limit,
    });
  }

  async approveUser(id: string, approvedBy: string): Promise<ServiceResponse<User>> {
    return this.update(id, {
      approvalStatus: 'approved',
      approvedBy,
      approvedAt: new Date(),
    });
  }

  async rejectUser(id: string, rejectionReason: string, rejectedBy: string): Promise<ServiceResponse<User>> {
    return this.update(id, {
      approvalStatus: 'rejected',
      rejectionReason,
      approvedBy: rejectedBy,
      approvedAt: new Date(),
    });
  }

  async completeProfile(id: string, profileData: {
    displayName?: string;
    phone?: string;
    avatar?: string;
  }): Promise<ServiceResponse<User>> {
    return this.update(id, {
      ...profileData,
      profileCompleted: true,
    });
  }

  async verifyEmail(id: string): Promise<ServiceResponse<User>> {
    return this.update(id, {
      emailVerified: true,
    });
  }

  async updateAvatar(id: string, avatar: string): Promise<ServiceResponse<User>> {
    return this.update(id, { avatar });
  }

  async searchUsers(searchTerm: string, options?: {
    role?: UserRole;
    approvalStatus?: UserApprovalStatus;
    salonId?: string;
    limit?: number;
  }): Promise<ServiceResponse<ListResponse<User>>> {
    const whereConditions: { field: string; operator: any; value: any }[] = [];

    if (options?.role) {
      whereConditions.push({ field: 'role', operator: '==', value: options.role });
    }

    if (options?.approvalStatus) {
      whereConditions.push({ field: 'approvalStatus', operator: '==', value: options.approvalStatus });
    }

    if (options?.salonId) {
      whereConditions.push({ field: 'salonId', operator: '==', value: options.salonId });
    }

    const queryOptions = {
      where: whereConditions,
      limit: options?.limit,
    };

    const result = await this.list(queryOptions);

    if (result.success && result.data) {
      const filteredItems = result.data.items.filter(user =>
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm))
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

  async getCustomers(options?: {
    approvalStatus?: UserApprovalStatus;
    emailVerified?: boolean;
    profileCompleted?: boolean;
    limit?: number;
  }): Promise<ServiceResponse<ListResponse<User>>> {
    return this.getUsersByRole('customer', options);
  }

  async getSalonAdmins(options?: {
    approvalStatus?: UserApprovalStatus;
    salonId?: string;
    limit?: number;
  }): Promise<ServiceResponse<ListResponse<User>>> {
    return this.getUsersByRole('salon_admin', options);
  }

  async getSuperAdmins(options?: {
    approvalStatus?: UserApprovalStatus;
    limit?: number;
  }): Promise<ServiceResponse<ListResponse<User>>> {
    return this.getUsersByRole('super_admin', options);
  }

  async getUserStats(): Promise<ServiceResponse<{
    totalUsers: number;
    usersByRole: Record<UserRole, number>;
    usersByStatus: Record<UserApprovalStatus, number>;
    verifiedUsers: number;
    completedProfiles: number;
  }>> {
    try {
      const result = await this.list({});

      if (result.success && result.data) {
        const users = result.data.items;

        const usersByRole = users.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {} as Record<UserRole, number>);

        const usersByStatus = users.reduce((acc, user) => {
          acc[user.approvalStatus] = (acc[user.approvalStatus] || 0) + 1;
          return acc;
        }, {} as Record<UserApprovalStatus, number>);

        const verifiedUsers = users.filter(user => user.emailVerified).length;
        const completedProfiles = users.filter(user => user.profileCompleted).length;

        return {
          success: true,
          data: {
            totalUsers: users.length,
            usersByRole,
            usersByStatus,
            verifiedUsers,
            completedProfiles,
          },
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

export const userService = new UserService();
export default userService;