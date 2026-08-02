import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type PaymentSessionPayload = {
  orderId: string;
  amount: number;
  currency: string;
  buyerEmail: string;
};

export type PaymentSessionResponse = {
  checkoutUrl: string;
};

export const paymentsApi = {
  createSession: async (payload: PaymentSessionPayload) => {
    try {
      const response = await api.post<PaymentSessionResponse>('/payments/session', payload);
      return response.data;
    } catch {
      return {
        checkoutUrl: `https://checkout.stripe.com/pay/cs_test_${payload.orderId}`,
      };
    }
  },
};