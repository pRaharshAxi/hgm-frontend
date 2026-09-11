import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import { ordersApi, type OrderRecord } from '../../services/ordersApi';
import { useAuthStore } from '../../services/authStore';

export default function OrderHistoryPage() {
  const user = useAuthStore((state) => state.user);
  const [activeRole, setActiveRole] = useState<'buyer' | 'supplier'>('buyer');

  const roles = useMemo(
    () => (user?.role === 'SUPPLIER' ? ['buyer', 'supplier'] : ['buyer']),
    [user?.role],
  );

  const { data: orders = [] } = useQuery({
    queryKey: ['orders', activeRole],
    queryFn: () => ordersApi.getHistory(activeRole),
  });

  return (
    <div className="page-shell">
      <h1>Orders</h1>
      {roles.length > 1 ? (
        <div className="tab-row">
          <button type="button" className={`tab-button ${activeRole === 'buyer' ? 'active' : ''}`} onClick={() => setActiveRole('buyer')}>
            My Purchases
          </button>
          <button type="button" className={`tab-button ${activeRole === 'supplier' ? 'active' : ''}`} onClick={() => setActiveRole('supplier')}>
            My Sales
          </button>
        </div>
      ) : null}

      <div className="order-list-grid">
        {orders.map((order: OrderRecord) => (
          <article key={order.id} className="order-card">
            <div className="order-card-head">
              <div>
                <div className="order-id">#{order.id.slice(0, 8)}</div>
                <div className="muted-text">{new Date(order.createdAt).toLocaleDateString()}</div>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="summary-row">
              <span>Total</span>
              <strong>Rs.{Number(order.totalAmount).toFixed(2)}</strong>
            </div>
            <div className="summary-row">
              <span>{activeRole === 'buyer' ? 'Supplier' : 'Buyer'}</span>
              <strong>{activeRole === 'buyer' ? order.supplier?.name : order.buyer?.name}</strong>
            </div>
            <Link className="btn btn-secondary" to={`/orders/${order.id}`}>
              View Details
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}