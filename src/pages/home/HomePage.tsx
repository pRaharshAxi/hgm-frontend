import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { label: 'FRUITS', emoji: '🍎', value: 'FRUITS' },
  { label: 'VEGETABLES', emoji: '🥦', value: 'VEGETABLES' },
  { label: 'HERBS', emoji: '🌿', value: 'HERBS' },
  { label: 'SPICES', emoji: '🌶️', value: 'SPICES' },
  { label: 'LEAFY GREENS', emoji: '🥬', value: 'LEAFY_GREENS' },
  { label: 'ALL', emoji: '🧺', value: 'ALL' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const value = search.trim();
    navigate(value ? `/search?q=${encodeURIComponent(value)}` : '/search');
  };

  const browseNearby = () => {
    if (!navigator.geolocation) {
      navigate('/search?nearby=true');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => navigate('/search?nearby=true'),
      () => navigate('/search?nearby=true'),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-20 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <h1 className="text-4xl font-semibold sm:text-5xl">Fresh From Local Gardens</h1>
          <p className="mt-4 max-w-2xl text-lg text-green-50">
            Connect directly with home garden owners near you
          </p>
          <form onSubmit={handleSearch} className="mt-8 flex w-full max-w-2xl flex-col gap-3 rounded-2xl bg-white p-3 shadow-lg sm:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search fresh produce"
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-gray-800 outline-none"
            />
            <button type="submit" className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white">
              Search
            </button>
          </form>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={browseNearby} className="rounded-full border border-white/40 bg-white/10 px-5 py-2 font-semibold text-white">
              Browse Nearby
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-8 text-2xl font-semibold text-gray-900">Browse by category</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => navigate(`/search?category=${encodeURIComponent(category.value)}`)}
              className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1"
            >
              <span className="text-lg font-semibold text-gray-800">{category.label}</span>
              <span className="text-2xl">{category.emoji}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-8 text-2xl font-semibold text-gray-900">How it works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Find a Grower', 'Browse nearby growers and pick the produce you need.'],
            ['Place an Order', 'Reserve your items directly with the supplier.'],
            ['Receive Fresh Produce', 'Enjoy farm-fresh deliveries right to your door.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-2 font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
