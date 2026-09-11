import apiB from './ApiB';

export type NotificationType = 'ORDER_PLACED' | 'STATUS' | 'HARVEST' | 'PAYMENT_FAILED';

export type NotificationRecord = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
  metadata?: {
    orderId?: string;
  };
};

// Backend sends its own type strings; map them to the frontend's icon-friendly type
const mapType = (backendType: string): NotificationType => {
  if (backendType === 'ORDER_PLACED') return 'ORDER_PLACED';
  if (backendType === 'ORDER_STATUS_UPDATED') return 'STATUS';
  if (backendType === 'HARVEST_ALERT') return 'HARVEST';
  if (backendType === 'PAYMENT_FAILED') return 'PAYMENT_FAILED';
  return 'STATUS';
};

const normalize = (doc: any): NotificationRecord => ({
  id: doc._id ?? doc.id,
  type: mapType(doc.type),
  title: doc.title,
  body: doc.body,
  createdAt: doc.createdAt,
  isRead: doc.isRead,
  metadata: doc.metadata,
});

export const notificationsApi = {
  getUnreadCount: async (): Promise<number> => {
    const response = await apiB.get('/notifications/unread-count');
    return response.data?.unreadCount ?? 0;
  },

  getMany: async (limit = 5): Promise<NotificationRecord[]> => {
    const response = await apiB.get(`/notifications?limit=${limit}`);
    const items = response.data?.items ?? [];
    return items.map(normalize);
  },

  getAll: async (): Promise<NotificationRecord[]> => {
    const response = await apiB.get('/notifications?limit=100');
    const items = response.data?.items ?? [];
    return items.map(normalize);
  },

  markRead: async (id: string) => {
    const response = await apiB.patch(`/notifications/${id}/read`);
    return normalize(response.data);
  },

  markAllRead: async () => {
    const response = await apiB.patch('/notifications/read-all');
    return response.data;
  },
};