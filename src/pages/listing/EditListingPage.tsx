import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { listingsApi } from '../../services/listingsApi';

const CATEGORIES = ['FRUITS', 'VEGETABLES', 'HERBS', 'SPICES', 'LEAFY_GREENS', 'OTHER'];
const UNITS = ['kg', 'g', 'piece', 'bunch', 'litre'];

export default function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'FRUITS',
    price: '',
    quantity: '',
    unit: 'kg',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    if (!id) return;
    listingsApi.getOne(id)
      .then((listing) => {
        setForm({
          title: listing.title,
          description: listing.description ?? '',
          category: listing.category,
          price: String(listing.price),
          quantity: String(listing.quantity),
          unit: listing.unit,
          latitude: String(listing.latitude ?? ''),
          longitude: String(listing.longitude ?? ''),
        });
      })
      .catch(() => toast.error('Failed to load listing'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    try {
      await listingsApi.update(id, {
        title: form.title,
        description: form.description,
        category: form.category,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
        unit: form.unit,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
      });
      toast.success('Listing updated successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Failed to update listing';
      toast.error(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '0 1.5rem', fontFamily: 'system-ui, sans-serif' }}>
        <p style={{ color: '#166534' }}>Loading listing...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '0 1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ color: '#14532d', fontWeight: 800, marginBottom: '1.5rem' }}>Edit Listing</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontWeight: 600, color: '#166534' }}>
          Title *
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.95rem' }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontWeight: 600, color: '#166534' }}>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.95rem', resize: 'vertical' }}
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontWeight: 600, color: '#166534' }}>
            Category *
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.95rem' }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontWeight: 600, color: '#166534' }}>
            Unit *
            <select
              name="unit"
              value={form.unit}
              onChange={handleChange}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.95rem' }}
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontWeight: 600, color: '#166534' }}>
            Price (LKR) *
            <input
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.95rem' }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontWeight: 600, color: '#166534' }}>
            Quantity *
            <input
              name="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={handleChange}
              required
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.95rem' }}
            />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontWeight: 500, color: '#166534', fontSize: '0.875rem' }}>
            Latitude
            <input
              name="latitude"
              type="number"
              step="any"
              value={form.latitude}
              onChange={handleChange}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.95rem' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontWeight: 500, color: '#166534', fontSize: '0.875rem' }}>
            Longitude
            <input
              name="longitude"
              type="number"
              step="any"
              value={form.longitude}
              onChange={handleChange}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.95rem' }}
            />
          </label>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              flex: 1,
              padding: '0.875rem',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              color: '#475569',
              border: '1px solid #cbd5e1',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 2,
              padding: '0.875rem',
              borderRadius: '8px',
              backgroundColor: loading ? '#86efac' : '#16a34a',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}