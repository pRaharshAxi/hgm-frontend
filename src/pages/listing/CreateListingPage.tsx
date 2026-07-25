import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/listing/ImageUpload';
import { listingsApi, type ListingCategory, type ListingUnit } from '../../services/listings.api';
import { useAuthStore } from '../../store/auth.store';

const categories: ListingCategory[] = ['FRUITS', 'VEGETABLES', 'HERBS', 'SPICES', 'LEAFY_GREENS', 'OTHER'];
const units: ListingUnit[] = ['kg', 'g', 'piece', 'bunch', 'litre'];

export default function CreateListingPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'FRUITS' as ListingCategory,
    price: '',
    quantity: '',
    unit: 'kg' as ListingUnit,
    latitude: '',
    longitude: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [manualLocation, setManualLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isSupplier = useMemo(() => user?.role === 'Supplier' || user?.role === 'SUPPLIER', [user]);

  if (!token || !isSupplier) {
    return <div className="p-8 text-center text-red-600">Supplier access required.</div>;
  }

  const handleChange = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported in this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
        }));
        toast.success('Location captured.');
      },
      () => {
        toast.error('Location permission was denied.');
      },
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await listingsApi.create({
        title: form.title,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity),
        unit: form.unit,
        images,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      });
      toast.success('Listing created!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Unable to create listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-6 text-3xl font-semibold text-gray-900">Create Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Title
            <input required value={form.title} onChange={(event) => handleChange('title', event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Category
            <select value={form.category} onChange={(event) => handleChange('category', event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2">
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
          Description
          <textarea value={form.description} onChange={(event) => handleChange('description', event.target.value)} className="min-h-24 rounded-lg border border-gray-300 px-3 py-2" />
        </label>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Price
            <input type="number" min="0.01" step="0.01" required value={form.price} onChange={(event) => handleChange('price', event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Quantity
            <input type="number" min="1" required value={form.quantity} onChange={(event) => handleChange('quantity', event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
            Unit
            <select value={form.unit} onChange={(event) => handleChange('unit', event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2">
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <button type="button" onClick={useCurrentLocation} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white">
              Use my current location
            </button>
            <button type="button" onClick={() => setManualLocation(true)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">
              Enter manually
            </button>
          </div>
          {manualLocation && (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Latitude
                <input value={form.latitude} onChange={(event) => handleChange('latitude', event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2" />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                Longitude
                <input value={form.longitude} onChange={(event) => handleChange('longitude', event.target.value)} className="rounded-lg border border-gray-300 px-3 py-2" />
              </label>
            </div>
          )}
        </div>

        <ImageUpload onImagesChange={setImages} maxImages={5} />

        <button type="submit" disabled={submitting} className="rounded-lg bg-green-700 px-4 py-2 font-semibold text-white">
          {submitting ? 'Creating listing...' : 'Create listing'}
        </button>
      </form>
    </div>
  );
}
