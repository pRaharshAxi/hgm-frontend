import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
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

const PAGE_SIZE = 5;

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [page, setPage] = useState(1);

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', 'page'],
    queryFn: notificationsApi.getAll,
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter((notification) => !notification.isRead);
    }
    return notifications;
  }, [filter, notifications]);

  const totalPages = Math.max(1, Math.ceil(filteredNotifications.length / PAGE_SIZE));
  const visibleNotifications = filteredNotifications.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (nextFilter: 'all' | 'unread') => {
    setFilter(nextFilter);
    setPage(1);
  };

  return (
    <div className="page-shell">
      <div className="summary-row">
        <div>
          <h1>Notifications</h1>
          <p>Stay on top of order and listing updates.</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={() => markAllReadMutation.mutate()}>
          Mark all read
        </button>
      </div>

      <div className="notification-filter-tabs">
        <button
          type="button"
          className={filter === 'all' ? 'notification-tab active' : 'notification-tab'}
          onClick={() => handleFilterChange('all')}
        >
          All
        </button>
        <button
          type="button"
          className={filter === 'unread' ? 'notification-tab active' : 'notification-tab'}
          onClick={() => handleFilterChange('unread')}
        >
          Unread
        </button>
      </div>

      {visibleNotifications.length ? (
        <div className="notification-page-list">
          {visibleNotifications.map((notification) => (
            <article key={notification.id} className="notification-row">
              <span className="notification-read-dot" aria-hidden="true">
                {notification.isRead ? null : <span className="notification-read-dot-fill" />}
              </span>
              <span className="notification-icon" aria-hidden="true">
                {typeIcons[notification.type]}
              </span>
              <div className="notification-content wide">
                <div className="summary-row">
                  <span className="notification-title">{notification.title}</span>
                  <span className="notification-time">{formatTimeAgo(notification.createdAt)}</span>
                </div>
                <p className="notification-body">{notification.body}</p>
              </div>
              {notification.metadata?.orderId ? (
                <Link className="btn btn-secondary btn-small" to={`/orders/${notification.metadata.orderId}`}>
                  Open order
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">You're all caught up! 🎉</div>
      )}

      {filteredNotifications.length > PAGE_SIZE ? (
        <div className="pagination-row">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={page === totalPages}
            onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
