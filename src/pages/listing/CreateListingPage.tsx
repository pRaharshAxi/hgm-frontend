import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { listingsApi } from '../../services/listingsApi';
import api from '../../services/Api';

const CATEGORIES = ['FRUITS', 'VEGETABLES', 'HERBS', 'SPICES', 'LEAFY_GREENS', 'OTHER'];
const UNITS = ['kg', 'g', 'piece', 'bunch', 'litre'];

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGetLocation = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
        }));
        setLocating(false);
        toast.success('Location captured!');
      },
      () => {
        setLocating(false);
        toast.error('Could not get location. Enter manually.');
      }
    );
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxFiles = 5;
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    const validFiles = Array.from(files).slice(0, maxFiles);

    for (const file of validFiles) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported format (JPG, PNG, WEBP only)`);
        return;
      }
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return;
      }
    }

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of validFiles) {
        // Step 1: Get presigned URL from System A
        const presignedResponse = await api.get('/listings/presigned-url', {
          params: { filename: file.name, contentType: file.type },
        });

        const { url, key } = presignedResponse.data;

        // Step 2: Upload directly to MinIO using presigned URL
        // Replace internal Docker hostname with localhost for browser access
        await fetch(url, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type },
          });

        
        // Step 3: Build the public URL for the uploaded image
        const publicUrl = `http://localhost:9000/hgm-images/${key}`;
        uploadedUrls.push(publicUrl);
      }

      setUploadedImageUrls((prev) => [...prev, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
    } catch (err) {
      toast.error('Image upload failed. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.latitude || !form.longitude) {
      toast.error('Please provide your location.');
      return;
    }
    setLoading(true);
    try {
      await listingsApi.create({
        title: form.title,
        description: form.description,
        category: form.category,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
        unit: form.unit,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        images: uploadedImageUrls,
      });
      toast.success('Listing created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Failed to create listing';
      toast.error(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '0 1.5rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ color: '#14532d', fontWeight: 800, marginBottom: '1.5rem' }}>Add New Listing</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Title */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontWeight: 600, color: '#166534' }}>
          Title *
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="e.g. Fresh Alphonso Mangoes"
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.95rem' }}
          />
        </label>

        {/* Description */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontWeight: 600, color: '#166534' }}>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe your produce..."
            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.95rem', resize: 'vertical' }}
          />
        </label>

        {/* Category + Unit */}
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

        {/* Price + Quantity */}
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
              placeholder="e.g. 350"
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
              placeholder="e.g. 50"
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.95rem' }}
            />
          </label>
        </div>

        {/* Image Upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <span style={{ fontWeight: 600, color: '#166534' }}>Product Images (max 5)</span>

          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              borderRadius: '8px',
              border: '2px dashed #bbf7d0',
              backgroundColor: '#f0fdf4',
              cursor: uploadingImages ? 'not-allowed' : 'pointer',
              gap: '0.5rem',
            }}
          >
            <span style={{ fontSize: '2rem' }}>📷</span>
            <span style={{ color: '#166534', fontWeight: 600 }}>
              {uploadingImages ? 'Uploading...' : 'Click to upload images'}
            </span>
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>JPG, PNG, WEBP — max 5MB each</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageUpload}
              disabled={uploadingImages}
              style={{ display: 'none' }}
            />
          </label>

          {/* Image Previews */}
          {uploadedImageUrls.length > 0 && (
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {uploadedImageUrls.map((url, index) => (
                <div key={url} style={{ position: 'relative' }}>
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #bbf7d0' }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#dc2626',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Location */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <span style={{ fontWeight: 600, color: '#166534' }}>Location *</span>
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={locating}
            style={{
              padding: '0.75rem',
              borderRadius: '8px',
              backgroundColor: locating ? '#86efac' : '#dcfce7',
              border: '1px solid #bbf7d0',
              color: '#166534',
              fontWeight: 600,
              cursor: locating ? 'not-allowed' : 'pointer',
              fontSize: '0.95rem',
            }}
          >
            {locating ? 'Getting location...' : '📍 Use My Current Location'}
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontWeight: 500, color: '#166534', fontSize: '0.875rem' }}>
              Latitude
              <input
                name="latitude"
                type="number"
                step="any"
                value={form.latitude}
                onChange={handleChange}
                placeholder="e.g. 6.9271"
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
                placeholder="e.g. 79.8612"
                style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.95rem' }}
              />
            </label>
          </div>

          {form.latitude && form.longitude && (
            <p style={{ color: '#16a34a', fontSize: '0.875rem', margin: 0 }}>
              ✓ Location set: {parseFloat(form.latitude).toFixed(4)}, {parseFloat(form.longitude).toFixed(4)}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || uploadingImages}
          style={{
            padding: '0.875rem',
            borderRadius: '8px',
            backgroundColor: loading ? '#86efac' : '#16a34a',
            color: '#ffffff',
            border: 'none',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '0.5rem',
          }}
        >
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}