import { type FormEvent, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../../services/ordersApi';
import { paymentsApi } from '../../services/paymentsApi';
import { useAuthStore } from '../../services/authStore';
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
      // Group cart items by supplier — backend requires one supplier per order
      const groupedBySupplier = items.reduce<Record<string, typeof items>>((acc, item) => {
        if (!acc[item.supplierId]) {
          acc[item.supplierId] = [];
        }
        acc[item.supplierId].push(item);
        return acc;
      }, {});
  
      const supplierGroups = Object.values(groupedBySupplier);
  
      const createdOrders = [];
      for (const group of supplierGroups) {
        const order = await ordersApi.place({
          items: group.map((item) => ({
            listingId: item.id,
            quantity: item.quantity,
          })),
          deliveryAddress: `${streetAddress}, ${city}, ${postalCode}`,
          notes,
        });
        createdOrders.push(order);
      }
  
      setIsSubmitting(false);
      setIsRedirecting(true);
  
      if (createdOrders.length > 1) {
        toast.success(`${createdOrders.length} separate orders placed (one per supplier).`);
      }
  
      // Create a payment session per order; redirect to the first for now
      const session = await paymentsApi.createSession({
        orderId: createdOrders[0].id,
        amount: createdOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0),
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
              <strong>Rs.{Number(item.price * item.quantity).toFixed(2)}</strong>
            </div>
          ))}
          <hr />
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>Rs.{Number(total).toFixed(2)}</strong>
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
