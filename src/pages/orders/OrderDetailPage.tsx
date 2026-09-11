import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import OrderStatusBadge from '../../components/order/OrderStatusBadge';
import ReviewForm from '../../components/reviews/ReviewForm';
import { ordersApi, type OrderStatus } from '../../services/ordersApi';
import { reviewsApi } from '../../services/reviewsApi';
import { useAuthStore } from '../../services/authStore';

const STATUS_STEPS: OrderStatus[] = ['PLACED', 'CONFIRMED', 'FULFILLED', 'COMPLETED'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getById(id ?? ''),
    enabled: Boolean(id),
  });

  const { data: review } = useQuery({
    queryKey: ['review', order?.id],
    queryFn: () => reviewsApi.getByOrder(order?.id ?? ''),
    enabled: Boolean(order?.id),
  });

  const mutation = useMutation({
    mutationFn: ({ nextStatus }: { nextStatus: OrderStatus }) => ordersApi.updateStatus(id ?? '', nextStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      toast.success('Order status updated.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const statusIndex = useMemo(() => STATUS_STEPS.indexOf(order?.status ?? 'PLACED'), [order?.status]);
  const canCancel = order?.status === 'CONFIRMED' && user?.role === 'BUYER' && (order.timeSincePlacedMinutes ??0) <= 60;

  const handleAction = (nextStatus: OrderStatus) => {
    mutation.mutate({ nextStatus });
  };

  if (isLoading || !order) {
    return <div className="page-shell">Loading order…</div>;
  }

  return (
    <div className="page-shell">
      <div className="summary-row">
        <h1>Order #{order.id.slice(0, 8)}</h1>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="timeline-row">
        {STATUS_STEPS.map((status, index) => (
          <div key={status} className={`timeline-step ${index <= statusIndex ? 'active' : ''}`}>
            <span>{status}</span>
          </div>
        ))}
      </div>

      <div className="order-detail-grid">
        <section className="checkout-card">
          <h2>Items</h2>
          <table className="order-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.listingTitle}</td>
                  <td>{item.quantity}</td>
                  <td>Rs.{Number(item.unitPrice).toFixed(2)}</td>
                  <td>Rs.{Number(item.subtotal).toFixed(2)}</td>
              </tr>
                ))}

              
            </tbody>
          </table>
        </section>

        <aside className="checkout-card">
          <h2>Details</h2>
          <div className="summary-row">
            <span>Delivery address</span>
            <strong>{order.deliveryAddress}</strong>
          </div>
          <div className="summary-row">
            <span>Notes</span>
            <strong>{order.notes || '—'}</strong>
          </div>
          <div className="summary-row">
            <span>Total</span>
            <strong>Rs.{Number(order.totalAmount).toFixed(2)}</strong>
          </div>
          <div className="action-buttons stacked">
            {user?.role === 'SUPPLIER' && order.status === 'PLACED' ? (
              <button type="button" className="btn btn-primary" onClick={() => handleAction('CONFIRMED')}>
                Confirm Order
              </button>
            ) : null}
            {user?.role === 'SUPPLIER' && order.status === 'CONFIRMED' ? (
              <button type="button" className="btn btn-primary" onClick={() => handleAction('FULFILLED')}>
                Mark as Fulfilled
              </button>
            ) : null}
            {canCancel ? (
              <button type="button" className="btn btn-secondary" onClick={() => handleAction('CANCELLED')}>
                Cancel Order
              </button>
            ) : null}
            {user?.role === 'BUYER' && order.status === 'FULFILLED' ? (
              <button type="button" className="btn btn-primary" onClick={() => handleAction('COMPLETED')}>
                Mark as Completed
              </button>
            ) : null}
          </div>
        </aside>
      </div>

      {order.status === 'COMPLETED' && !review && !reviewSubmitted && user?.role === 'BUYER' ? (
       <ReviewForm orderId={order.id} onSubmitted={() => setReviewSubmitted(true)} />
      ) : null}
    </div>
  );
}
