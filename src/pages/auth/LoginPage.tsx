import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../services/systemA.api';
import { useAuthStore } from '../../store/auth.store';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const next: Record<string, string> = {};

    if (!form.email.trim()) next.email = 'Email is required';
    if (!form.password) next.password = 'Password is required';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setApiError('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    try {
      const response = await authApi.login(form);
      const token = response.token ?? response.accessToken;
      if (!token) throw new Error('Missing auth token');
      login(token, { email: form.email });
      navigate('/dashboard');
    } catch (error: any) {
      setApiError(error?.response?.data?.message || error.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <h1>Login</h1>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label>
          Email
          <input
            value={form.email}
            onChange={(event) => handleChange('email', event.target.value)}
            type="email"
            name="email"
            autoComplete="email"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>

        <label>
          Password
          <input
            value={form.password}
            onChange={(event) => handleChange('password', event.target.value)}
            type="password"
            name="password"
            autoComplete="current-password"
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>

        <div className="auth-footer">
          <Link to="/forgot-password" className="auth-link">
            Forgot password?
          </Link>
          <button type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Login'}
          </button>
        </div>

        {apiError && <div className="api-error">{apiError}</div>}
      </form>
    </div>
  );
}
