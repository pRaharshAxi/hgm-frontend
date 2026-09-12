import { Link, useLocation, useNavigate } from 'react-router-dom';
import NotifBell from '../notifications/NotifBell';
import { useAuthStore } from '../../services/authStore';
import { useCartStore } from '../../store/cart.store';

export default function Navbar() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useCartStore((state) =>
    state.items.reduce((count, item) => count + item.quantity, 0)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className={location.pathname === '/' ? 'site-navbar home-navbar' : 'site-navbar'}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              boxShadow: '0 2px 4px rgba(22, 163, 74, 0.25)',
            }}
          >
            🌿
          </div>
          <span
            style={{
              fontSize: '1.375rem',
              fontWeight: 800,
              color: '#14532d',
              letterSpacing: '-0.025em',
            }}
          >
            GardenLink
          </span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link
            to="/"
            style={{ color: '#334155', textDecoration: 'none', fontWeight: 600, fontSize: '0.938rem' }}
          >
            Home
          </Link>

          {user?.role !== 'SUPPLIER' && (
            <Link
              to="/search"
              style={{ color: '#334155', textDecoration: 'none', fontWeight: 600, fontSize: '0.938rem' }}
            >
              Shop
            </Link>
          )}

          <a href="#about" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 500, fontSize: '0.938rem' }}>
            About Us
          </a>
          <a href="#services" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 500, fontSize: '0.938rem' }}>
            Services
          </a>
          <a href="#contact" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 500, fontSize: '0.938rem' }}>
            Contact
          </a>
        </div>

        {/* Actions & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {token ? (
            <>
              {user?.role === 'SUPPLIER' && (
                <Link
                  to="/dashboard"
                  style={{
                    color: '#166534',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    backgroundColor: '#f0fdf4',
                  }}
                >
                  Dashboard
                </Link>
              )}
              <Link
                to="/orders"
                style={{
                  color: '#334155',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              >
                Orders
              </Link>
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin/users"
                  style={{
                    color: '#dc2626',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                  }}
                >
                  Admin
                </Link>
              )}
              <NotifBell />
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 0.875rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  color: '#166534',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.938rem',
                  padding: '0.5rem 0.875rem',
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                style={{
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  padding: '0.563rem 1.125rem',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(22, 163, 74, 0.2)',
                }}
              >
                Get Started
              </Link>
            </>
          )}

          {/* Cart — only for non-suppliers */}
          {user?.role !== 'SUPPLIER' && (
            <Link
              to="/cart"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#f0fdf4',
                color: '#166534',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                padding: '0.563rem 1rem',
                borderRadius: '8px',
                border: '1px solid #bbf7d0',
                marginLeft: '0.25rem',
              }}
            >
              <span>🛒</span>
              <span>Cart</span>
              <span
                style={{
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  borderRadius: '9999px',
                  padding: '0.125rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  minWidth: '1.25rem',
                  textAlign: 'center',
                }}
              >
                {cartCount}
              </span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}