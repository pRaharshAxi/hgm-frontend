import api from './Api';

export type OrderStatus = 'PLACED' | 'CONFIRMED' | 'FULFILLED' | 'COMPLETED' | 'CANCELLED';

export type OrderItem = {
  id: string;
  listingId: string;
  listingTitle: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type OrderRecord = {
  id: string;
  status: OrderStatus;
  createdAt: string;
  totalAmount: number;
  items: OrderItem[];
  deliveryAddress: string;
  notes?: string;
  buyer: { id: string; name: string };
  supplier: { id: string; name: string };
  buyerId?: string;
  supplierId?: string;
  timeSincePlacedMinutes?: number;
};

export type OrderPayload = {
  items: Array<{ listingId: string; quantity: number }>;
  deliveryAddress: string;
  notes?: string;
};

export const ordersApi = {
  place: async (payload: OrderPayload) => {
    const response = await api.post('/orders', payload);
    return response.data;
  },

  // Backend returns { data, meta } — not { items }
  getHistory: async (role: 'buyer' | 'supplier'): Promise<OrderRecord[]> => {
    const response = await api.get(`/orders?role=${role}`);
    return response.data?.data ?? [];
  },

  getById: async (id: string): Promise<OrderRecord> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: OrderStatus) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
};