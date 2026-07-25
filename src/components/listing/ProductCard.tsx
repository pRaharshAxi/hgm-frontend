import { useNavigate } from 'react-router-dom';

type Listing = {
  id: string;
  title: string;
  category?: string;
  price?: number;
  quantity?: number;
  unit?: string;
  images?: string[];
  supplierName?: string;
  rating?: number;
  description?: string;
};

type ProductCardProps = {
  listing: Listing;
  showDistance?: boolean;
  distanceKm?: number;
};

export default function ProductCard({ listing, showDistance = false, distanceKm }: ProductCardProps) {
  const navigate = useNavigate();
  const imageUrl = listing.images?.[0];
  const isLowStock = (listing.quantity ?? 0) < 5;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="aspect-[4/3] bg-gray-100">
        {imageUrl ? (
          <img src={imageUrl} alt={listing.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-green-100 to-green-200 text-4xl">🌱</div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-green-700">
            {listing.category || 'OTHER'}
          </span>
          <span className="text-sm text-gray-500">⭐ {listing.rating ?? 0}</span>
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">{listing.title}</h3>
        <p className="text-sm text-gray-500">{listing.supplierName || 'Local grower'}</p>
        {showDistance && distanceKm !== undefined && (
          <p className="text-sm text-green-600">{distanceKm.toFixed(1)} km away</p>
        )}
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-green-700">${Number(listing.price ?? 0).toFixed(2)}</p>
          <span className="text-sm text-gray-500">{listing.unit || 'unit'}</span>
        </div>
        <p className={`text-sm ${isLowStock ? 'text-red-600' : 'text-gray-500'}`}>
          {listing.quantity ?? 0} {listing.unit || 'unit'} available
        </p>
        <button onClick={() => navigate(`/listing/${listing.id}`)} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700">
          View Details
        </button>
      </div>
    </div>
  );
}
