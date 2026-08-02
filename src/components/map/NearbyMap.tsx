import { useEffect, useState } from 'react';
import { Circle, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { geoApi, type NearbySupplier } from '../../services/geoApi';

type NearbyMapProps = {
  center: { lat: number; lng: number };
  radius?: number;
};

export function NearbyMap({ center, radius = 10 }: NearbyMapProps) {
  const [suppliers, setSuppliers] = useState<NearbySupplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadSuppliers = async () => {
      setLoading(true);
      try {
        const nearby = await geoApi.nearby(center.lat, center.lng, radius);
        if (isMounted) {
          setSuppliers(nearby);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSuppliers();
    return () => {
      isMounted = false;
    };
  }, [center, radius]);

  return (
    <div className="map-shell">
      {loading ? (
        <div className="map-loading">Loading nearby suppliers…</div>
      ) : null}
      <MapContainer center={[center.lat, center.lng]} zoom={12} scrollWheelZoom className="map-container">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle center={[center.lat, center.lng]} radius={radius * 1000} pathOptions={{ color: 'green', fillColor: 'green', fillOpacity: 0.15 }} />
        {suppliers.map((supplier) => (
          <Marker key={supplier.id} position={[supplier.lat, supplier.lng]}>
            <Popup>
              <div>
                <strong>{supplier.name}</strong>
                <div>{supplier.distance.toFixed(1)} km away</div>
                <div>{supplier.categories.join(', ')}</div>
                <a href="/shop">View listings</a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
