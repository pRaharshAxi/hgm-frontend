export type Review = {
  id: string;
  buyerName: string;
  createdAt: string;
  rating: number;
  comment: string;
  sellerId: string;
  orderId: string;
};

const reviews: Review[] = [
  {
    id: 'r1',
    buyerName: 'Kylie Parker',
    createdAt: '2026-01-12',
    rating: 5,
    comment: 'Excellent quality and always arrives crisp and fresh. The supplier messaging was quick and helpful.',
    sellerId: 'supplier-1',
    orderId: 'order-001',
  },
  {
    id: 'r2',
    buyerName: 'Liam Carter',
    createdAt: '2026-01-28',
    rating: 4,
    comment: 'Very reliable delivery schedule and the produce looked beautiful when it arrived.',
    sellerId: 'supplier-1',
    orderId: 'order-002',
  },
  {
    id: 'r3',
    buyerName: 'Maya Singh',
    createdAt: '2026-02-04',
    rating: 5,
    comment: 'Loved the packaging and freshness. This is now my go-to supplier for weekly orders.',
    sellerId: 'supplier-1',
    orderId: 'order-003',
  },
  {
    id: 'r4',
    buyerName: 'Owen Price',
    createdAt: '2026-02-17',
    rating: 4,
    comment: 'Good color, scent, and texture. I just wish the bundle was a little larger for the price.',
    sellerId: 'supplier-1',
    orderId: 'order-004',
  },
  {
    id: 'r5',
    buyerName: 'Isla Reyes',
    createdAt: '2026-03-02',
    rating: 5,
    comment: 'Everything looked farm-fresh and professionally handled. Definitely recommend it.',
    sellerId: 'supplier-1',
    orderId: 'order-005',
  },
  {
    id: 'r6',
    buyerName: 'Hugo Baker',
    createdAt: '2026-03-09',
    rating: 5,
    comment: 'Very consistent quality on every order. Highly recommended for repeat buyers.',
    sellerId: 'supplier-2',
    orderId: 'order-006',
  },
  {
    id: 'r7',
    buyerName: 'Ella Fisher',
    createdAt: '2026-03-11',
    rating: 4,
    comment: 'Reliable staff and excellent produce selection.',
    sellerId: 'supplier-2',
    orderId: 'order-007',
  },
  {
    id: 'r8',
    buyerName: 'Noah Young',
    createdAt: '2026-03-15',
    rating: 5,
    comment: 'The produce has a great shelf life once delivered. Very impressive.',
    sellerId: 'supplier-2',
    orderId: 'order-008',
  },
];

export const reviewsApi = {
  getBySeller: async (sellerId: string) => reviews.filter((review) => review.sellerId === sellerId),
  getByOrder: async (orderId: string) => reviews.find((review) => review.orderId === orderId) ?? null,
  create: async (payload: { orderId: string; rating: number; comment: string }) => {
    const createdReview: Review = {
      id: `r-${Date.now()}`,
      buyerName: 'Demo Buyer',
      createdAt: new Date().toISOString(),
      rating: payload.rating,
      comment: payload.comment,
      sellerId: 'supplier-1',
      orderId: payload.orderId,
    };

    reviews.push(createdReview);
    return createdReview;
  },
};
