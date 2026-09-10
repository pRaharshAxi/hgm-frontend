import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../services/authStore';
import api from '../../services/Api';

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken } = response.data;
      
      // Decode JWT payload to get user info (JWT is base64 encoded)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
  
      login(accessToken, user);
      setUser(user);
      navigate(user.role === 'ADMIN' ? '/admin/users' : 
        user.role === 'SUPPLIER' ? '/dashboard' :
        '/');
    } catch (err: any) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };


 

  

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0fdf4', padding: '2rem 1rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 10px 25px -5px rgba(22, 101, 52, 0.08)', border: '1px solid #dcfce7' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '50%', fontSize: '1.5rem', marginBottom: '0.75rem' }}>🍎</div>
          <h1 style={{ margin: 0, color: '#14532d', fontSize: '1.875rem', fontWeight: 800 }}>Welcome Back</h1>
          <p style={{ margin: '0.375rem 0 0', color: '#15803d', fontSize: '0.875rem' }}>Sign in to access fresh organic produce</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', color: '#166534', fontWeight: 600, fontSize: '0.875rem' }}>
            Email Address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{ padding: '0.75rem 0.875rem', borderRadius: '8px', border: '1px solid #bbf7d0', backgroundColor: '#f8fafc', color: '#0f172a', outline: 'none' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', color: '#166534', fontWeight: 600, fontSize: '0.875rem' }}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ padding: '0.75rem 0.875rem', borderRadius: '8px', border: '1px solid #bbf7d0', backgroundColor: '#f8fafc', color: '#0f172a', outline: 'none' }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '0.875rem', borderRadius: '8px', backgroundColor: loading ? '#86efac' : '#16a34a', color: '#ffffff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '1rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Need an account? </span>
            <Link to="/register" style={{ color: '#15803d', fontWeight: 700, textDecoration: 'none', fontSize: '0.875rem' }}>
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}