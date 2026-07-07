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
      <div className="navbar-brand">Comidela</div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        {token ? <Link to="/dashboard">My Dashboard</Link> : null}
        {!token ? <Link to="/login">Login</Link> : null}
        {!token ? <Link to="/register">Register</Link> : null}
      </div>
      {token ? (
        <div className="navbar-user">
          <span className="navbar-avatar">{user?.name?.[0]?.toUpperCase() ?? 'U'}</span>
          <button className="navbar-button" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <Link className="navbar-button" to="/register">
          Get Started
        </Link>
      )}
    </nav>
  );
}
