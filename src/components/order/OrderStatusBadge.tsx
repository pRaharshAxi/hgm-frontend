type OrderStatus = 'PLACED' | 'CONFIRMED' | 'FULFILLED' | 'COMPLETED' | 'CANCELLED';

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

const variants: Record<OrderStatus, string> = {
  PLACED: 'badge-yellow',
  CONFIRMED: 'badge-blue',
  FULFILLED: 'badge-purple',
  COMPLETED: 'badge-green',
  CANCELLED: 'badge-red',
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return <span className={`order-status-badge ${variants[status]}`}>{status}</span>;
}
