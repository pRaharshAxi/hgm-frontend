import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { NearbyMap } from '../../components/map/NearbyMap';
import { listingsApi, type Listing } from '../../services/listingsApi';
import { searchApi } from '../../services/searchApi';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [nearby, setNearby] = useState(() => searchParams.get('nearby') === 'true');
  const [latLng, setLatLng] = useState<{ lat: number; lng: number }>({ lat: 13.08, lng: 80.27 });

  // Load all listings on mount (default browse view)
  useEffect(() => {
    listingsApi.getAll().then(setListings).catch(() => setListings([]));
  }, []);

  // Debounced search — runs 300ms after typing stops
  useEffect(() => {
    if (!query.trim()) {
      listingsApi.getAll().then(setListings).catch(() => setListings([]));
      return;
    }

    const timeoutId = setTimeout(() => {
      searchApi.search(query.trim()).then(setListings).catch(() => setListings([]));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  useEffect(() => {
    if (!nearby) {
      return;
    }

    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLatLng({ lat: coords.latitude, lng: coords.longitude });
      },
      () => {
        setLatLng({ lat: 13.08, lng: 80.27 });
      },
    );
  }, [nearby]);

  const categories = [
    { name: 'All', icon: '✦' },
    { name: 'Vegetables', icon: '🥕' },
    { name: 'Fruits', icon: '🍎' },
    { name: 'Spices', icon: '🌶️' },
    { name: 'Leafy greens', icon: '🥬' },
    { name: 'Herbs', icon: '🌿' },
  ];

  const visibleListings = useMemo(() => {
    if (selectedCategory === 'All') {
      return listings;
    }

    return listings.filter((listing) =>
      listing.category.toLowerCase().replace(/\s/g, '').includes(selectedCategory.toLowerCase().replace(/\s/g, '')),
    );
  }, [listings, selectedCategory]);

  return (
    <div className="page-shell">
      <section className="shop-hero">
        <div className="shop-hero-copy">
          <span className="shop-hero-eyebrow">Fresh from</span>
          <h1>
            Local hands
          </h1>
          <p>
            Discover fresh, organic vegetables, fruits, spices, leafy greens,
            and herbs from trusted local growers and home producers.
          </p>
          <strong>Good food, grown with care.</strong>
          <button
            type="button"
            className="shop-hero-button"
            onClick={() => {
              const nextNearby = !nearby;
              setNearby(nextNearby);
              setSearchParams(nextNearby ? { nearby: 'true' } : {});
            }}
          >
            {nearby ? 'Hide Nearby' : 'Search your area'} <span aria-hidden="true">→</span>
          </button>
        </div>
        <div className="shop-feature-box">
          <div className="shop-feature">
            <span className="shop-feature-icon" aria-hidden="true">⌖</span>
            <div>
              <strong>Grown around you</strong>
              <p>Fresh produce from trusted local growers.</p>
            </div>
          </div>
          <div className="shop-feature">
            <span className="shop-feature-icon" aria-hidden="true">▣</span>
            <div>
              <strong>Order in a few taps</strong>
              <p>Find your favourites and shop with ease.</p>
            </div>
          </div>
          <div className="shop-feature">
            <span className="shop-feature-icon" aria-hidden="true">⌁</span>
            <div>
              <strong>Tracked delivery</strong>
              <p>Follow your order from farm to front door.</p>
            </div>
          </div>
          <div className="shop-feature">
            <span className="shop-feature-icon" aria-hidden="true">$</span>
            <div>
              <strong>Something for everyone</strong>
              <p>Seasonal choices for every kitchen.</p>
            </div>
          </div>
        </div>
      </section>

      {nearby ? (
        <section className="map-section">
          <NearbyMap center={latLng} radius={10} />
        </section>
      ) : null}

      <section className="search-bar-card">
        <span className="search-field-icon" aria-hidden="true">⌕</span>
        <input
          className="search-input"
          placeholder="What are you looking for?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <span className="search-shortcut" aria-hidden="true">
          <kbd>⌘</kbd><b>+</b><kbd>/</kbd>
        </span>
      </section>

      <section className="category-section" aria-labelledby="category-heading">
        <div className="category-section-heading">
          <div>
            <span>Explore fresh produce</span>
            <h2 id="category-heading">What are you craving?</h2>
          </div>
          <span className="category-count">{visibleListings.length} products</span>
        </div>
        <div className="category-list">
          {categories.map((category) => (
            <button
              type="button"
              key={category.name}
              className={`category-chip${selectedCategory === category.name ? ' selected' : ''}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <span className="category-icon" aria-hidden="true">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="listings-section">
        <div className="listings-section-heading">
          <div>
            <span>Curated selections</span>
            <h2>Popular near you</h2>
          </div>
          <span>Fresh from local growers</span>
        </div>
        <div className="product-grid">
        {visibleListings.map((listing) => (
          <article key={listing.id} className="product-card">
            {listing.images?.[0] ? (
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="product-image"
                onError={(event) => {
                  event.currentTarget.hidden = true;
                  event.currentTarget.nextElementSibling?.removeAttribute('hidden');
                }}
              />
            ) : null}
            <div className="product-image-fallback" hidden={Boolean(listing.images?.[0])}>
              <span>🌿</span>
            </div>
            <div className="product-content">
              <div className="product-meta-row">
                <span className="badge">{listing.category}</span>
              </div>
              <h2>{listing.title}</h2>
              <p>{listing.description}</p>
              <span className="product-quantity">
                {listing.quantity} {listing.unit}
              </span>
              <div className="product-footer">
                <strong>Rs.{Number(listing.price).toFixed(2)}</strong>
                <Link className="btn btn-primary" to={`/listing/${listing.id}`}>
                  View Details
                </Link>
              </div>
            </div>
          </article>
        ))}
        {visibleListings.length === 0 ? (
          <p className="empty-listings">
            No produce found in this category. Try another category or search term.
          </p>
        ) : null}
        </div>
      </section>
    </div>
  );
}