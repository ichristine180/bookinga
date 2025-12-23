import axios from 'axios';

const PAYPACK_CHECKOUT_URL = 'https://checkout.paypack.rw/api/checkouts/initiate';

interface PaypackItem {
  name: string;
  price: number;
  quantity: number;
}

interface PaypackCheckoutRequest {
  items: PaypackItem[];
  app_id: string;
  email: string;
}

interface PaypackCheckoutResponse {
  session_id: string;
  amount: number;
  kind: 'session:created' | 'session:committed' | 'session:processed';
  payment_link: string;
  created_at: string;
}

export interface PendingBooking {
  salonId: string;
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
  duration: number;
  totalAmount: number;
  currency: string;
  specialInstructions: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  isGuest: boolean;
  guestInfo?: {
    name: string;
    phone: string;
    email: string;
  };
  salonOwnerId: string;
  serviceName: string;
}

const PENDING_BOOKING_KEY = 'pendingBooking';
const PAYPACK_SESSION_KEY = 'paypackSessionId';

export const initiatePaypackCheckout = async (
  serviceName: string,
  amount: number,
  email: string
): Promise<PaypackCheckoutResponse> => {
  const appId = import.meta.env.VITE_PAYPACK_APP_ID;

  if (!appId) {
    throw new Error('Paypack App ID not configured');
  }

  const payload: PaypackCheckoutRequest = {
    items: [
      {
        name: `Booking Fee - ${serviceName}`,
        price: amount,
        quantity: 1,
      },
    ],
    app_id: appId.trim(),
    email: email || 'guest@bookinga.rw',
  };

  try {
    const response = await axios.post<PaypackCheckoutResponse>(
      PAYPACK_CHECKOUT_URL,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Paypack API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          `Payment service error (${error.response?.status})`
      );
    }
    throw error;
  }
};

export const storePendingBooking = (booking: PendingBooking): void => {
  sessionStorage.setItem(PENDING_BOOKING_KEY, JSON.stringify(booking));
};

export const getPendingBooking = (): PendingBooking | null => {
  const data = sessionStorage.getItem(PENDING_BOOKING_KEY);
  if (!data) return null;
  return JSON.parse(data) as PendingBooking;
};

export const clearPendingBooking = (): void => {
  sessionStorage.removeItem(PENDING_BOOKING_KEY);
  sessionStorage.removeItem(PAYPACK_SESSION_KEY);
};

export const storePaypackSession = (sessionId: string): void => {
  sessionStorage.setItem(PAYPACK_SESSION_KEY, sessionId);
};

export const getPaypackSession = (): string | null => {
  return sessionStorage.getItem(PAYPACK_SESSION_KEY);
};

export const BOOKING_FEE = 100; // RWF
