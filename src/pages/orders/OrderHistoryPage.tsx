import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import { ordersApi, type OrderRecord } from '../../services/ordersApi';
import { useAuthStore } from '../../services/authStore';

export default function OrderHistoryPage() {
  const user = useAuthStore((state) => state.user);
  const [activeRole, setActiveRole] = useState<'buyer' | 'supplier'>('buyer');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const roles = useMemo(
    () => (user?.role === 'SUPPLIER' ? ['buyer', 'supplier'] : ['buyer']),
    [user?.role],
  );

  const { data: orders = [] } = useQuery({
    queryKey: ['orders', activeRole],
    queryFn: () => ordersApi.getHistory(activeRole),
  });

  const selectedOrder = orders.find((order) => order.id === selectedOrderId) ?? orders[0];

  return (
    <div className={`page-shell${user?.role === 'SUPPLIER' ? ' supplier-orders-page' : ' buyer-orders-page'}`}>
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

      <div className="buyer-order-layout">
        <div className="order-list-grid">
          {orders.map((order: OrderRecord) => (
          <article
            key={order.id}
            className={`order-card${selectedOrder?.id === order.id ? ' selected' : ''}`}
            onClick={() => setSelectedOrderId(order.id)}
          >
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
        {user?.role !== 'SUPPLIER' && selectedOrder ? (
          <aside className="buyer-order-detail">
          <div className="buyer-order-detail-heading">
            <span>Order details</span>
            <strong>#{selectedOrder.id.slice(0, 8)}</strong>
          </div>
          {selectedOrder.items.map((item) => (
            <div className="buyer-order-item" key={item.id}>
              <span className="buyer-order-item-icon" aria-hidden="true">🌿</span>
              <div>
                <strong>{item.listingTitle}</strong>
                <span>{item.quantity} × Rs.{Number(item.unitPrice).toFixed(2)}</span>
              </div>
              <strong>Rs.{Number(item.subtotal).toFixed(2)}</strong>
            </div>
          ))}
          <div className="buyer-order-total">
            <span>Total</span>
            <strong>Rs.{Number(selectedOrder.totalAmount).toFixed(2)}</strong>
          </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}