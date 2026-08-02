import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCartStore } from '../../store/cart.store';

export default function OrderConfirmPage() {
  const [searchParams] = useSearchParams();
  const clearCart = useCartStore((state) => state.clearCart);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="page-shell confirmation-shell">
      <div className="confirmation-card">
        <div className="confirmation-icon">✓</div>
        <h1>Order Confirmed!</h1>
        <p>Payment successful{sessionId ? ` for session ${sessionId}` : ''}.</p>
        <div className="action-buttons">
          <Link className="btn btn-primary" to="/orders">
            Track My Order
          </Link>
          <Link className="btn btn-secondary" to="/search">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
