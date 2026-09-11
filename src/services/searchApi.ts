import apiB from './ApiB';
import type { Listing } from './listingsApi';

export const searchApi = {
  search: async (query: string): Promise<Listing[]> => {
    const response = await apiB.get('/search', { params: { q: query } });
    const results = response.data?.results ?? [];
    return results.map((r: any) => ({
      id: r.id,
      title: r.title,
      category: r.category,
      price: r.price,
      quantity: r.quantity,
      unit: r.unit,
      supplierId: r.supplierId,
      supplierName: r.supplierName,
      images: r.images ?? [],
      description: r.description,
      latitude: r.latitude,
      longitude: r.longitude,
      isActive: r.isActive,
    }));
  },
};