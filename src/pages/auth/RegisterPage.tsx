import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../services/systemA.api';
import { useAuthStore } from '../../store/auth.store';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'Buyer' as 'Buyer' | 'Supplier',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const next: Record<string, string> = {};

    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!emailRegex.test(form.email)) next.email = 'Enter a valid email';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 8) next.password = 'Password must be at least 8 characters';
    if (!form.phone.trim()) next.phone = 'Phone is required';
    if (!form.role) next.role = 'Role is required';

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
      const response = await authApi.register(form);
      const token = response.token ?? response.accessToken;
      if (!token) throw new Error('Missing auth token');
      login(token, { name: form.name, email: form.email, role: form.role });
      navigate('/');
    } catch (error: any) {
      setApiError(error?.response?.data?.message || error.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <h1>Register</h1>
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <label>
          Name
          <input
            value={form.name}
            onChange={(event) => handleChange('name', event.target.value)}
            type="text"
            name="name"
            autoComplete="name"
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>

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
            autoComplete="new-password"
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>

        <label>
          Phone
          <input
            value={form.phone}
            onChange={(event) => handleChange('phone', event.target.value)}
            type="tel"
            name="phone"
            autoComplete="tel"
          />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </label>

        <fieldset className="auth-fieldset">
          <legend>Role</legend>
          <label>
            <input
              type="radio"
              name="role"
              value="Buyer"
              checked={form.role === 'Buyer'}
              onChange={() => handleChange('role', 'Buyer')}
            />
            Buyer
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="Supplier"
              checked={form.role === 'Supplier'}
              onChange={() => handleChange('role', 'Supplier')}
            />
            Supplier
          </label>
          {errors.role && <span className="field-error">{errors.role}</span>}
        </fieldset>

        {apiError && <div className="api-error">{apiError}</div>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Register'}
        </button>
      </form>
    </div>
  );
}
