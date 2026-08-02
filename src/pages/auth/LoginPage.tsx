import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState('buyer@example.com');
  const [password, setPassword] = useState('password');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const role = email.includes('admin') ? 'admin' : email.includes('supplier') ? 'supplier' : 'buyer';
    const displayName = role === 'admin' ? 'Demo Admin' : role === 'supplier' ? 'Demo Supplier' : 'Demo Buyer';

    login('demo-token', { id: 'user-1', email, name: displayName, role });
    navigate(role === 'admin' ? '/admin/users' : '/shop');
  };

  return (
    <div className="page-shell auth-card">
      <h1>Login</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Email
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button type="submit" className="btn btn-primary">Login</button>
        <Link to="/register">Need an account? Register</Link>
      </form>
    </div>
  );
}
