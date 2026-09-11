import api from './Api';

export type Review = {
  id: string;
  buyerName?: string;
  buyer?: { name: string };
  createdAt: string;
  rating: number;
  comment: string;
  sellerId?: string;
  orderId?: string;
};

export const reviewsApi = {
  getBySeller: async (sellerId: string): Promise<Review[]> => {
    const response = await api.get(`/reviews/${sellerId}`);
    return response.data?.data ?? [];
  },

  getByOrder: async (orderId: string) => {
    return null;
  },

  create: async (payload: { orderId: string; rating: number; comment: string }) => {
    const response = await api.post('/reviews', payload);
    return response.data;
  },
};