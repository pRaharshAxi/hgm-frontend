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

const notificationsSeed: NotificationRecord[] = [
  {
    id: 'notification-1',
    type: 'ORDER_PLACED',
    title: 'New order placed',
    body: 'A buyer requested your Organic Spinach Bundle for delivery today.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isRead: false,
    metadata: { orderId: 'order-001' },
  },
  {
    id: 'notification-2',
    type: 'STATUS',
    title: 'Order confirmed',
    body: 'Your order has been sent to the supplier for confirmation.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isRead: false,
    metadata: { orderId: 'order-002' },
  },
  {
    id: 'notification-3',
    type: 'HARVEST',
    title: 'Fresh harvest is ready',
    body: 'The latest harvest batch for your nearby produce list is now available.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    isRead: true,
  },
  {
    id: 'notification-4',
    type: 'PAYMENT_FAILED',
    title: 'Payment issue detected',
    body: 'The checkout attempt was declined and needs your attention.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: true,
  },
  {
    id: 'notification-5',
    type: 'STATUS',
    title: 'Delivery update',
    body: 'Your order is on the way and should arrive soon.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    isRead: false,
    metadata: { orderId: 'order-003' },
  },
  {
    id: 'notification-6',
    type: 'ORDER_PLACED',
    title: 'Order placed',
    body: 'A buyer has placed an order for Berry Fresh Crate.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(),
    isRead: false,
    metadata: { orderId: 'order-004' },
  },
];

export const notificationsApi = {
  getUnreadCount: async () => notificationsSeed.filter((notification) => !notification.isRead).length,
  getMany: async (limit = 5) => notificationsSeed.slice(0, limit),
  getAll: async () => notificationsSeed,
  markRead: async (id: string) => {
    const notification = notificationsSeed.find((item) => item.id === id);
    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.isRead = true;
    return notification;
  },
  markAllRead: async () => {
    notificationsSeed.forEach((notification) => {
      notification.isRead = true;
    });
    return notificationsSeed;
  },
};
