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

export type OrderStatus = 'PLACED' | 'CONFIRMED' | 'FULFILLED' | 'COMPLETED' | 'CANCELLED';

export type OrderItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

export type OrderRecord = {
  id: string;
  status: OrderStatus;
  createdAt: string;
  totalAmount: number;
  items: OrderItem[];
  deliveryAddress: string;
  notes?: string;
  buyerName: string;
  supplierName: string;
  buyerId: string;
  supplierId: string;
  timeSincePlacedMinutes: number;
};

const orders: OrderRecord[] = [
  {
    id: 'order-001',
    status: 'PLACED',
    createdAt: '2026-08-01T10:00:00.000Z',
    totalAmount: 7.0,
    items: [
      { id: 'item-1', title: 'Organic Spinach Bundle', price: 3.5, quantity: 2 },
    ],
    deliveryAddress: '12 Market Road, Downtown, 600001',
    notes: 'Please ring the bell',
    buyerName: 'Demo Buyer',
    supplierName: 'Green Harvest Co-op',
    buyerId: 'user-1',
    supplierId: 'supplier-1',
    timeSincePlacedMinutes: 15,
  },
  {
    id: 'order-002',
    status: 'CONFIRMED',
    createdAt: '2026-08-01T09:00:00.000Z',
    totalAmount: 12.5,
    items: [
      { id: 'item-2', title: 'Sunrise Tomato Box', price: 4.25, quantity: 2 },
      { id: 'item-3', title: 'Berry Fresh Crate', price: 5.75, quantity: 1 },
    ],
    deliveryAddress: '44 River Lane, Northside, 600002',
    notes: 'Leave at the gate',
    buyerName: 'Demo Buyer',
    supplierName: 'Riverside Farm',
    buyerId: 'user-1',
    supplierId: 'supplier-2',
    timeSincePlacedMinutes: 45,
  },
  {
    id: 'order-003',
    status: 'COMPLETED',
    createdAt: '2026-07-30T08:00:00.000Z',
    totalAmount: 16.5,
    items: [
      { id: 'item-4', title: 'Berry Fresh Crate', price: 5.75, quantity: 2 },
      { id: 'item-5', title: 'Organic Spinach Bundle', price: 3.5, quantity: 3 },
    ],
    deliveryAddress: '5 Orchard Avenue, East End, 600003',
    notes: 'No extra notes',
    buyerName: 'Demo Buyer',
    supplierName: 'Maple Grove Produce',
    buyerId: 'user-1',
    supplierId: 'supplier-3',
    timeSincePlacedMinutes: 120,
  },
];

export type OrderPayload = {
  items: Array<{
    listingId: string;
    quantity: number;
  }>;
  deliveryAddress: string;
  notes?: string;
};

export type OrderResponse = {
  id: string;
  totalAmount: number;
  status: OrderStatus;
};

export const ordersApi = {
  place: async (payload: OrderPayload) => {
    try {
      const response = await api.post<OrderResponse>('/orders', payload);
      return response.data;
    } catch {
      const createdAt = Date.now();
      return {
        id: `order-${createdAt}`,
        totalAmount: payload.items.reduce((sum, item) => sum + item.quantity * 3.5, 0),
        status: 'PLACED' as OrderStatus,
      };
    }
  },
  getHistory: async (role: 'buyer' | 'supplier') => {
    if (role === 'buyer') {
      return orders.filter((order) => order.buyerId === 'user-1');
    }

    return orders.filter((order) => order.supplierId === 'supplier-1');
  },
  getById: async (id: string) => {
    const order = orders.find((entry) => entry.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  },
  updateStatus: async (id: string, status: OrderStatus) => {
    const order = orders.find((entry) => entry.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    order.status = status;
    return order;
  },
};
