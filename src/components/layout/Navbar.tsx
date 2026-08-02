import { Link, useNavigate } from 'react-router-dom';
import NotifBell from '../notifications/NotifBell';
import { useAuthStore } from '../../store/auth.store';
import { useCartStore } from '../../store/cart.store';

export default function Navbar() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const cartCount = useCartStore((state) => state.items.reduce((count, item) => count + item.quantity, 0));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo-icon">🌿</span>
        <span>GardenLink</span>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/search">Shop</Link>
        <a href="#about">About Us</a>
        <a href="#services">Services</a>
        <a href="#contact">Contact Us</a>
      </div>
      <div className="navbar-actions">
        {token ? (
          <>
            <Link className="navbar-link" to="/dashboard">
              Dashboard
            </Link>
            <Link className="navbar-link" to="/orders">
              Orders
            </Link>
            {user?.role === 'admin' ? (
              <Link className="navbar-link" to="/admin/users">
                Admin
              </Link>
            ) : null}
            <NotifBell />
            <button className="navbar-button secondary" type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="navbar-link" to="/login">
              Login
            </Link>
            <Link className="navbar-button primary" to="/register">
              Get Started
            </Link>
          </>
        )}
        <Link className="navbar-button store cart-link" to="/cart">
          Cart
          <span className="cart-badge">{cartCount}</span>
        </Link>
      </div>
    </nav>
  );
}
