import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cart.store';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="page-shell empty-cart-shell">
        <div className="empty-cart-card">
          <div className="empty-cart-emoji">🧺</div>
          <h1>Your cart is empty</h1>
          <Link className="btn btn-primary" to="/search">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell cart-page-layout">
      <section className="cart-items-column">
        {items.map((item) => (
          <article key={item.id} className="cart-item-card">
            <img src={item.image} alt={item.title} className="cart-thumb" />
            <div className="cart-item-details">
              <div className="cart-item-title-row">
                <div>
                  <h2>{item.title}</h2>
                  <div className="muted-text">{item.supplierName ?? 'Local supplier'}</div>
                </div>
                <button type="button" className="remove-item-button" onClick={() => removeItem(item.id)}>
                  ×
                </button>
              </div>
              <div className="cart-item-price">₹{item.price.toFixed(2)} each</div>
              <div className="cart-qty-row">
                <button type="button" className="qty-button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  −
                </button>
                <input type="number" className="qty-input" value={item.quantity} onChange={(event) => updateQuantity(item.id, Number(event.target.value) || 1)} />
                <button type="button" className="qty-button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  +
                </button>
              </div>
              <div className="cart-item-subtotal">Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</div>
            </div>
          </article>
        ))}
      </section>

      <aside className="summary-column">
        <div className="summary-card">
          <h2>Order summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹{subtotal.toFixed(2)}</strong>
          </div>
          <p className="muted-text">This is a local produce order.</p>
          <div className="summary-actions">
            <Link className="btn btn-primary" to="/checkout">
              Proceed to Checkout
            </Link>
            <Link className="btn btn-secondary" to="/search">
              Continue Shopping
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
