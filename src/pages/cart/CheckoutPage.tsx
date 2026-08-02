import { type FormEvent, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../../services/ordersApi';
import { paymentsApi } from '../../services/paymentsApi';
import { useAuthStore } from '../../store/auth.store';
import { useCartStore } from '../../store/cart.store';

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const total = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!streetAddress.trim() || !city.trim() || !postalCode.trim()) {
      toast.error('Please complete all delivery fields before placing the order.');
      return;
    }

    if (!items.length) {
      toast.error('Your cart is empty.');
      navigate('/search');
      return;
    }

    if (!user?.email) {
      toast.error('Please login before checkout.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await ordersApi.place({
        items: items.map((item) => ({
          listingId: item.id,
          quantity: item.quantity,
        })),
        deliveryAddress: `${streetAddress}, ${city}, ${postalCode}`,
        notes,
      });

      setIsSubmitting(false);
      setIsRedirecting(true);

      const session = await paymentsApi.createSession({
        orderId: order.id,
        amount: order.totalAmount,
        currency: 'LKR',
        buyerEmail: user.email,
      });

      window.location.href = session.checkoutUrl;
    } catch (error: unknown) {
      setIsSubmitting(false);
      setIsRedirecting(false);
      const message = error instanceof Error ? error.message : 'Unable to place order right now.';
      toast.error(message);
    }
  };

  return (
    <div className="page-shell">
      <h1>Checkout</h1>
      <form className="checkout-layout" onSubmit={submitOrder}>
        <section className="checkout-card">
          <h2>Delivery details</h2>
          <div className="checkout-form-grid">
            <label>
              Street Address
              <input value={streetAddress} onChange={(event) => setStreetAddress(event.target.value)} required />
            </label>
            <label>
              City
              <input value={city} onChange={(event) => setCity(event.target.value)} required />
            </label>
            <label>
              Postal Code
              <input value={postalCode} onChange={(event) => setPostalCode(event.target.value)} required />
            </label>
          </div>

          <label>
            Order Notes
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={5} />
          </label>
        </section>

        <aside className="checkout-card">
          <h2>Order summary</h2>
          {items.map((item) => (
            <div key={item.id} className="summary-row">
              <span>
                {item.title} × {item.quantity}
              </span>
              <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
            </div>
          ))}
          <hr />
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹{total.toFixed(2)}</strong>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <strong>Local pickup</strong>
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting || isRedirecting || !items.length}>
            {isSubmitting ? 'Placing order...' : isRedirecting ? 'Redirecting to payment...' : 'Place Order & Pay'}
          </button>
        </aside>
      </form>
    </div>
  );
}
