import api from './axios.instance';

export type ListingCategory = 'FRUITS' | 'VEGETABLES' | 'HERBS' | 'SPICES' | 'LEAFY_GREENS' | 'OTHER';
export type ListingUnit = 'kg' | 'g' | 'piece' | 'bunch' | 'litre';

export type CreateListingPayload = {
  title: string;
  description?: string;
  category: ListingCategory;
  price: number;
  quantity: number;
  unit: ListingUnit;
  images?: string[];
  latitude: number;
  longitude: number;
};

export const listingsApi = {
  getPresignedUrl: (filename: string, contentType: string) =>
    api.get<{ uploadUrl: string; fileUrl: string }>('/listings/presigned-url', {
      params: { filename, contentType },
    }),
  create: (payload: CreateListingPayload) => api.post('/listings', payload),
};
