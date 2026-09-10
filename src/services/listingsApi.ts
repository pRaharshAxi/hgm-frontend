import api from './Api';

export type Listing = {
  id: string;
  title: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  supplierId: string;
  supplierName: string;
  images: string[];
  description?: string;
  latitude?: number;
  longitude?: number;
  isActive?: boolean;
};

export type CreateListingDto = {
  title: string;
  description?: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
  images?: string[];
  latitude: number;
  longitude: number;
};

export const listingsApi = {
  getOne: async (id: string): Promise<Listing> => {
    const response = await api.get(`/listings/${id}`);
    return response.data;
  },

  getMany: async (): Promise<Listing[]> => {
    const response = await api.get('/listings/my');
    return response.data;
  },

  getAll: async (params?: {
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<Listing[]> => {
    const response = await api.get('/listings', { params });
    return response.data?.items ?? response.data;
  },

  create: async (data: CreateListingDto): Promise<Listing> => {
    const response = await api.post('/listings', data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateListingDto>): Promise<Listing> => {
    const response = await api.put(`/listings/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/listings/${id}`);
  },

  getPresignedUrl: async (filename: string, contentType: string) => {
    const response = await api.get('/listings/presigned-url', {
      params: { filename, contentType },
    });
    return response.data;
  },
};