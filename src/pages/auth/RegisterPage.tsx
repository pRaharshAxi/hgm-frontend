import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/axios.instance';
import { useAuthStore } from '../../services/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'BUYER',
    address: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // Client-side length check to match DTO @MinLength(6)
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      // Build clean payload: omit empty optional strings so DTO accepts them as undefined
      const payload: Record<string, any> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      };

      if (formData.phone.trim()) {
        payload.phone = formData.phone.trim();
      }
      if (formData.address.trim()) {
        payload.address = formData.address.trim();
      }

      const response = await api.post('/auth/register', payload);
      const { accessToken, refreshToken } = response.data;

      if (login) {
        login(accessToken, {
          email: formData.email,
          name: formData.name,
          role: formData.role.toLowerCase(),
        });
      }

      localStorage.setItem('refreshToken', refreshToken);
      navigate(formData.role === 'ADMIN' ? '/admin/users' : '/shop');
    } catch (err: any) {
      const serverMessage = err.response?.data?.message;
      if (Array.isArray(serverMessage)) {
        setError(serverMessage.join(', '));
      } else {
        setError(serverMessage || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0fdf4', padding: '2rem 1rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '520px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 10px 25px -5px rgba(22, 101, 52, 0.08), 0 8px 10px -6px rgba(22, 101, 52, 0.05)', border: '1px solid #dcfce7' }}>
        
        {/* Organic Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '50%', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
            🌱
          </div>
          <h1 style={{ margin: 0, color: '#14532d', fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.025em' }}>Create Account</h1>
          <p style={{ margin: '0.375rem 0 0', color: '#15803d', fontSize: '0.875rem' }}>Join our fresh & organic community today</p>
        </div>

        {error && (
          <div style={{ color: '#b91c1c', marginBottom: '1.5rem', padding: '0.875rem 1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', color: '#166534', fontWeight: 600, fontSize: '0.875rem' }}>
              Full Name
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Buyer"
                required
                style={{ padding: '0.75rem 0.875rem', borderRadius: '8px', border: '1px solid #bbf7d0', backgroundColor: '#f8fafc', color: '#0f172a', outline: 'none' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', color: '#166534', fontWeight: 600, fontSize: '0.875rem' }}>
              Email Address
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                required
                style={{ padding: '0.75rem 0.875rem', borderRadius: '8px', border: '1px solid #bbf7d0', backgroundColor: '#f8fafc', color: '#0f172a', outline: 'none' }}
              />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', color: '#166534', fontWeight: 600, fontSize: '0.875rem' }}>
              Password
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={{ padding: '0.75rem 0.875rem', borderRadius: '8px', border: '1px solid #bbf7d0', backgroundColor: '#f8fafc', color: '#0f172a', outline: 'none' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', color: '#166534', fontWeight: 600, fontSize: '0.875rem' }}>
              Phone Number
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0771234567"
                style={{ padding: '0.75rem 0.875rem', borderRadius: '8px', border: '1px solid #bbf7d0', backgroundColor: '#f8fafc', color: '#0f172a', outline: 'none' }}
              />
            </label>
          </div>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', color: '#166534', fontWeight: 600, fontSize: '0.875rem' }}>
            Account Role
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{ padding: '0.75rem 0.875rem', borderRadius: '8px', border: '1px solid #bbf7d0', backgroundColor: '#f8fafc', color: '#0f172a', outline: 'none', cursor: 'pointer' }}
            >
              <option value="BUYER">Buyer (Purchase fresh produce)</option>
              <option value="SUPPLIER">Supplier (Sell organic products)</option>
              <option value="ADMIN">Admin (Manage portal)</option>
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', color: '#166534', fontWeight: 600, fontSize: '0.875rem' }}>
            Delivery Address
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="No 12, Main St, Colombo"
              style={{ padding: '0.75rem 0.875rem', borderRadius: '8px', border: '1px solid #bbf7d0', backgroundColor: '#f8fafc', color: '#0f172a', outline: 'none' }}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '0.875rem', borderRadius: '8px', backgroundColor: loading ? '#86efac' : '#16a34a', color: '#ffffff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '1rem', marginTop: '0.5rem', transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.2)' }}
          >
            {loading ? 'Creating Account...' : 'Register Now'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Already registered? </span>
            <Link to="/login" style={{ color: '#15803d', fontWeight: 700, textDecoration: 'none', fontSize: '0.875rem' }}>
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}