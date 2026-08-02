import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { notificationsApi, type NotificationRecord } from '../../services/notificationsApi';

const typeIcons: Record<NotificationRecord['type'], string> = {
  ORDER_PLACED: '📦',
  STATUS: '🔄',
  HARVEST: '🌱',
  PAYMENT_FAILED: '❌',
};

const formatTimeAgo = (timestamp: string) => {
  const ms = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.max(1, Math.floor(ms / 60000));

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
};

export default function NotifDropdown({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', 'dropdown'],
    queryFn: () => notificationsApi.getMany(5),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const recentNotifications = useMemo(() => notifications.slice(0, 5), [notifications]);

  const handleNotificationClick = (notification: NotificationRecord) => {
    if (!notification.isRead) {
      markReadMutation.mutate(notification.id);
    }

    onClose();

    if (notification.metadata?.orderId) {
      navigate(`/orders/${notification.metadata.orderId}`);
    }
  };

  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown-header">
        <strong>Notifications</strong>
        <button type="button" className="btn btn-secondary btn-small" onClick={() => markAllReadMutation.mutate()}>
          Mark all read
        </button>
      </div>

      <div className="notification-list">
        {recentNotifications.map((notification) => (
          <button
            key={notification.id}
            type="button"
            className="notification-item"
            onClick={() => handleNotificationClick(notification)}
          >
            <span className="notification-read-dot" aria-hidden="true">
              {notification.isRead ? null : <span className="notification-read-dot-fill" />}
            </span>
            <span className="notification-icon" aria-hidden="true">
              {typeIcons[notification.type]}
            </span>
            <span className="notification-content">
              <span className="notification-title">{notification.title}</span>
              <span className="notification-body">{notification.body}</span>
              <span className="notification-time">{formatTimeAgo(notification.createdAt)}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="notification-dropdown-footer">
        <Link to="/notifications" onClick={onClose}>
          View all notifications
        </Link>
      </div>
    </div>
  );
}
