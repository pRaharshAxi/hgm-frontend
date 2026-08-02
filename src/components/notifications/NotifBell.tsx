import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '../../services/notificationsApi';
import NotifDropdown from './NotifDropdown';

export default function NotifBell() {
  const [isOpen, setIsOpen] = useState(false);

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: notificationsApi.getUnreadCount,
    refetchInterval: 30000,
  });

  return (
    <div className="notification-bell-wrap">
      <button type="button" className="notification-bell" onClick={() => setIsOpen((open) => !open)}>
        <span aria-hidden="true">🔔</span>
        {unreadCount > 0 ? <span className="notification-badge">{unreadCount}</span> : null}
      </button>

      {isOpen ? <NotifDropdown onClose={() => setIsOpen(false)} /> : null}
    </div>
  );
}
