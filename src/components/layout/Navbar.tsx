import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

export default function Navbar() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

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
        <a href="#about">About Us</a>
        <a href="#services">Services</a>
        <a href="#pages">Pages</a>
        <a href="#contact">Contact Us</a>
      </div>
      <div className="navbar-actions">
        {token ? (
          <>
            <div className="navbar-user-pill">
              <span className="navbar-avatar">{(user?.name || user?.email || 'U').charAt(0).toUpperCase()}</span>
              <span>{user?.name || user?.email || 'User'}</span>
            </div>
            <Link className="navbar-link" to="/dashboard">
              Dashboard
            </Link>
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
              Register
            </Link>
          </>
        )}
        <Link className="navbar-button store" to="/shop">
          Online Store
        </Link>
        <Link className="navbar-cart" to="/cart" aria-label="View cart">
          🛒
          <span className="navbar-cart-badge">0</span>
        </Link>
      </div>
    </nav>
  );
}
