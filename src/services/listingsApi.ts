export type Listing = {
  id: string;
  title: string;
  category: string;
  price: number;
  quantity: number;
  supplierId: string;
  supplierName: string;
  supplierAddress: string;
  rating: number;
  reviewsCount: number;
  images: string[];
  description: string;
};

const listings: Listing[] = [
  {
    id: '1',
    title: 'Organic Spinach Bundle',
    category: 'Leafy Greens',
    price: 3.5,
    quantity: 12,
    supplierId: 'supplier-1',
    supplierName: 'Green Harvest Co-op',
    supplierAddress: '12 Market Road, Downtown',
    rating: 4.8,
    reviewsCount: 24,
    images: [
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80',
    ],
    description: 'Freshly harvested spinach packed in a crisp, colorful bundle for home cooks and restaurants.',
  },
  {
    id: '2',
    title: 'Sunrise Tomato Box',
    category: 'Produce',
    price: 4.25,
    quantity: 9,
    supplierId: 'supplier-2',
    supplierName: 'Riverside Farm',
    supplierAddress: '44 River Lane, Northside',
    rating: 4.6,
    reviewsCount: 17,
    images: [
      'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1561136594-7f68413baa99?auto=format&fit=crop&w=600&q=80',
    ],
    description: 'A hand-picked selection of vibrant tomatoes from a supplier near the river basin.',
  },
  {
    id: '3',
    title: 'Berry Fresh Crate',
    category: 'Fruit',
    price: 5.75,
    quantity: 4,
    supplierId: 'supplier-3',
    supplierName: 'Maple Grove Produce',
    supplierAddress: '5 Orchard Avenue, East End',
    rating: 4.9,
    reviewsCount: 31,
    images: [
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
    ],
    description: 'An assorted berry basket with bright flavor and a ready-to-sell presentation.',
  },
];

export const listingsApi = {
  getOne: async (id: string) => {
    const listing = listings.find((entry) => entry.id === id);
    if (!listing) {
      throw new Error('Listing not found');
    }
    return listing;
  },
  getMany: async () => listings,
};
