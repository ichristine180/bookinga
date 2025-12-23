export type UserRole = 'customer' | 'salon_admin' | 'super_admin';

export type UserApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface User {
    uid: string;
    email: string;
    displayName: string;
    role: UserRole;
    phone?: string;
    avatar?: string;
    salonId?: string;

    approvalStatus: UserApprovalStatus;
    approvedBy?: string;
    approvedAt?: Date;
    rejectionReason?: string;

    profileCompleted: boolean;
    emailVerified: boolean;

    createdAt: Date;
    updatedAt: Date;
    salon?: Salon;
}

export interface Salon {
    id: string;
    name: string;
    description: string;
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    contact: {
        phone: string;
        email: string;
        website?: string;
    };
    images: string[];
    workingHours: {
        [key: string]: {
            open: string;
            close: string;
            closed: boolean;
        };
    };

    businessType: string;
    businessLicense?: string;
    taxNumber?: string;
    capacity: number;

    initialServices: Service[];

    ownerId: string;
    isActive: boolean;
    approvalStatus: UserApprovalStatus;
    approvedBy?: string;
    approvedAt?: Date;
    rejectionReason?: string;

    subscription: {
        plan: 'basic' | 'premium';
        expiresAt: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface Service {
    id: string;
    salonId: string;
    name: string;
    description: string;
    category: string;
    price: number;
    currency: string;
    duration: number;
    images: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Staff {
    id: string;
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
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Appointment {
    id: string;
    salonId: string;
    customerId: string;
    serviceId: string;
    staffId: string;
    date: string;
    time: string;
    duration: number;
    status: AppointmentStatus;
    totalAmount: number;
    currency: string;
    specialInstructions?: string;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: string;
    createdAt: Date;
    updatedAt: Date;
    reminderSent: Boolean;
    paymentStatus?: PaymentStatus;
    paymentSessionId?: string;
    bookingFee?: number;
    customerInfo: {
        name: string;
        phone: string;
        email: string;
    } | undefined;

}

export interface AppNotification {
    read: any;
    id: string;
    userId: string;
    type: 'appointment_reminder' | 'booking_confirmed' | 'booking_cancelled' | 'payment_received' | 'staff_assigned' | 'account_approved' | 'account_rejected' | 'salon_approved' | 'salon_rejected';
    title: string;
    message: string;
    isRead: boolean;
    relatedId?: string;
    actionUrl?: string;
    createdAt: Date;
}

export interface ApprovalRequest {
    id: string;
    type: 'salon_registration' | 'user_registration';
    entityId: string;
    requestedBy: string;
    status: UserApprovalStatus;
    reviewedBy?: string;
    reviewedAt?: Date;
    comments?: string;
    createdAt: Date;
    updatedAt: Date;
}
