
import emailjs from '@emailjs/browser';

interface EmailParams {
    to_email: string;
    to_name: string;
    subject: string;
    message: string;
    from_name?: string;
    action_url?: string;
}

interface ApprovalEmailParams {
    to_email: string;
    to_name: string;
    salon_name?: string;
    approval_url: string;
    rejection_reason?: string;
}

class EmailService {
    private readonly serviceId: string;
    private readonly templateId: string;
    private readonly approvalTemplateId: string;
    private readonly publicKey: string;
    private readonly baseUrl: string;

    constructor() {
        this.serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '';
        this.templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '';
        this.approvalTemplateId = import.meta.env.VITE_EMAILJS_APPROVAL_TEMPLATE_ID ?? '';
        this.publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '';
        this.baseUrl = import.meta.env.VITE_APP_URL ?? 'http://localhost:5173';

        if (this.publicKey) {
            emailjs.init(this.publicKey);
        }
    }

    private async sendEmail(templateId: string, params: Record<string, any>): Promise<void> {
        if (!this.serviceId || !templateId || !this.publicKey) {
            console.warn('EmailJS not configured. Skipping email notification.');
            return;
        }

        try {
            await emailjs.send(this.serviceId, templateId, params);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Failed to send email:', error);
            throw error;
        }
    }

    async sendAppointmentConfirmation(params: EmailParams): Promise<void> {
        return this.sendEmail(this.templateId, {
            ...params,
            from_name: params.from_name || 'SalonBook',
        });
    }

    async sendAppointmentReminder(params: EmailParams): Promise<void> {
        return this.sendEmail(this.templateId, {
            ...params,
            subject: `Reminder: ${params.subject}`,
            from_name: params.from_name || 'SalonBook',
        });
    }

    async sendAppointmentCancellation(params: EmailParams): Promise<void> {
        return this.sendEmail(this.templateId, {
            ...params,
            subject: `Cancelled: ${params.subject}`,
            from_name: params.from_name || 'SalonBook',
        });
    }

    async sendNotification(params: EmailParams): Promise<void> {
        return this.sendEmail(this.templateId, {
            ...params,
            from_name: params.from_name || 'SalonBook',
        });
    }


    async sendAccountApprovalNotification(params: ApprovalEmailParams): Promise<void> {
        const loginUrl = `${this.baseUrl}/login`;

        return this.sendEmail(this.approvalTemplateId, {
            to_email: params.to_email,
            to_name: params.to_name,
            subject: 'Account Approved - Welcome to SalonBook!',
            message: `Congratulations! Your account has been approved. You can now log in and start using SalonBook.`,
            action_url: loginUrl,
            action_text: 'Login to Your Account',
            from_name: 'SalonBook Team',
        });
    }

    async sendSalonApprovalNotification(params: ApprovalEmailParams): Promise<void> {
        const loginUrl = `${this.baseUrl}/admin`;

        return this.sendEmail(this.approvalTemplateId, {
            to_email: params.to_email,
            to_name: params.to_name,
            subject: `Salon "${params.salon_name}" Approved!`,
            message: `Great news! Your salon "${params.salon_name}" has been approved and is now live on SalonBook. You can start managing your services and accepting bookings.`,
            action_url: loginUrl,
            action_text: 'Access Your Salon Dashboard',
            from_name: 'SalonBook Team',
        });
    }

    async sendAccountRejectionNotification(params: ApprovalEmailParams): Promise<void> {
        const contactUrl = `${this.baseUrl}/contact`;

        return this.sendEmail(this.templateId, {
            to_email: params.to_email,
            to_name: params.to_name,
            subject: 'Account Application Status',
            message: `We regret to inform you that your account application has been declined. ${params.rejection_reason ? `Reason: ${params.rejection_reason}` : ''} Please contact our support team if you have any questions.`,
            action_url: contactUrl,
            from_name: 'SalonBook Team',
        });
    }

    async sendSalonRejectionNotification(params: ApprovalEmailParams): Promise<void> {
        const contactUrl = `${this.baseUrl}/contact`;

        return this.sendEmail(this.templateId, {
            to_email: params.to_email,
            to_name: params.to_name,
            subject: `Salon "${params.salon_name}" Application Status`,
            message: `We regret to inform you that your salon "${params.salon_name}" application has been declined. ${params.rejection_reason ? `Reason: ${params.rejection_reason}` : ''} Please contact our support team for more information.`,
            action_url: contactUrl,
            from_name: 'SalonBook Team',
        });
    }

    async sendWelcomeEmail(params: EmailParams): Promise<void> {
        const dashboardUrl = `${this.baseUrl}/`;

        return this.sendEmail(this.templateId, {
            to_email: params.to_email,
            to_name: params.to_name,
            subject: 'Welcome to SalonBook!',
            message: `Welcome to SalonBook! We're excited to have you on board. Start exploring and booking amazing salon services in your area.`,
            action_url: dashboardUrl,
            from_name: 'SalonBook Team',
        });
    }

    async sendVerificationEmail(params: EmailParams): Promise<void> {
        return this.sendEmail(this.templateId, {
            to_email: params.to_email,
            to_name: params.to_name,
            subject: 'Verify Your Email Address',
            message: 'Please verify your email address to complete your registration.',
            action_url: params.action_url,
            from_name: 'SalonBook Team',
        });
    }


    generateApprovalUrl(type: 'user' | 'salon', entityId: string, action: 'approve' | 'reject'): string {
        return `${this.baseUrl}/super-admin/approve?type=${type}&id=${entityId}&action=${action}`;
    }
}

export const emailService = new EmailService();