export type NearbySupplier = {
  id: string;
  name: string;
  distance: number;
  categories: string[];
  lat: number;
  lng: number;
};

const sampleNearby: NearbySupplier[] = [
  {
    id: 'supplier-1',
    name: 'Green Harvest Co-op',
    distance: 2.4,
    categories: ['Leafy Greens', 'Produce'],
    lat: 13.076,
    lng: 80.261,
  },
  {
    id: 'supplier-2',
    name: 'Riverside Farm',
    distance: 5.2,
    categories: ['Produce', 'Fruit'],
    lat: 13.078,
    lng: 80.266,
  },
  {
    id: 'supplier-3',
    name: 'Maple Grove Produce',
    distance: 7.8,
    categories: ['Fruit'],
    lat: 13.081,
    lng: 80.269,
  },
];

export const geoApi = {
  nearby: async (_lat: number, _lng: number, radius = 10) => {
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    return sampleNearby.filter((supplier) => supplier.distance <= radius);
  },
};
