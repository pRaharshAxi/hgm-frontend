  import { useEffect, useMemo, useState } from 'react';
  import { Link, useSearchParams } from 'react-router-dom';
  import { NearbyMap } from '../../components/map/NearbyMap';
  import { listingsApi, type Listing } from '../../services/listingsApi';

  export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [listings, setListings] = useState<Listing[]>([]);
    const [nearby, setNearby] = useState(() => searchParams.get('nearby') === 'true');
    const [latLng, setLatLng] = useState<{ lat: number; lng: number }>({ lat: 13.08, lng: 80.27 });

   

    useEffect(() => {
      listingsApi.getAll().then(setListings).catch(() => setListings([]));
    }, []);

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

    const visibleListings = useMemo(() => listings, [listings]);

    return (
      <div className="page-shell">
        <section className="search-header">
          <div>
            <h1>Search listings</h1>
            <p>Find fresh produce and nearby suppliers close to you.</p>
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              const nextNearby = !nearby;
              setNearby(nextNearby);
              setSearchParams(nextNearby ? { nearby: 'true' } : {});
            }}
          >
            {nearby ? 'Hide Nearby' : 'Browse Nearby'}
          </button>
        </section>

        <section className="search-bar-card">
          <input className="search-input" placeholder="Search produce, category, or supplier" />
        </section>

        {nearby && latLng ? (
          <section className="map-section">
            <NearbyMap center={latLng} radius={10} />
          </section>
        ) : null}

        <section className="product-grid">
          {visibleListings.map((listing) => (
            <article key={listing.id} className="product-card">
              <img src={listing.images[0]} alt={listing.title} className="product-image" />
              <div className="product-content">
                <div className="product-meta-row">
                  <span className="badge">{listing.category}</span>
                  
                </div>
                <h2>{listing.title}</h2>
                <p>{listing.description}</p>
                <div className="product-footer">
                  <strong>Rs.{Number(listing.price).toFixed(2)}</strong>
                  <Link className="btn btn-primary" to={`/listing/${listing.id}`}>
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    );
  }
