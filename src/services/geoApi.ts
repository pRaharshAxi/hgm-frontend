import apiB from './ApiB';

export type NearbySupplier = {
  id: string;
  name: string;
  distance: number;
  categories: string[];
  lat: number;
  lng: number;
};

export const geoApi = {
  nearby: async (lat: number, lng: number, radius = 10): Promise<NearbySupplier[]> => {
    const response = await apiB.get('/geo/nearby', {
      params: { lat, lng, radius },
    });

    const results = response.data ?? [];
    return results.map((s: any) => ({
      id: s.supplierId,
      name: s.supplierName,
      distance: s.distanceKm,
      categories: s.categories ?? [],
      lat: s.latitude,
      lng: s.longitude,
    }));
  },
};