import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ReviewCard } from '../../components/reviews/ReviewCard';
import { StarRating } from '../../components/reviews/StarRating';
import { listingsApi } from '../../services/listingsApi';
import { reviewsApi } from '../../services/reviewsApi';
import { useAuthStore } from '../../store/auth.store';
import { useCartStore } from '../../store/cart.store';

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const addItem = useCartStore((state) => state.addItem);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: listing, isLoading: listingLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingsApi.getOne(id ?? ''),
    enabled: Boolean(id),
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', listing?.supplierId],
    queryFn: () => reviewsApi.getBySeller(listing?.supplierId ?? ''),
    enabled: Boolean(listing?.supplierId),
  });

  const averageRating = useMemo(() => {
    if (!reviews.length) {
      return 0;
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  }, [reviews]);

  const reviewPage = reviews.slice((page - 1) * 5, page * 5);
  const totalPages = Math.max(1, Math.ceil(reviews.length / 5));

  if (listingLoading || !listing) {
    return <div className="page-shell">Loading listing…</div>;
  }

  const galleryImages = listing.images.length ? listing.images : ['https://placehold.co/600x400'];
  const safeSelectedImage = selectedImage ?? galleryImages[0];

  const addToCart = () => {
    addItem({
      id: listing.id,
      title: listing.title,
      price: listing.price,
      quantity: Math.max(1, Math.min(selectedQuantity, listing.quantity)),
      image: listing.images[0],
      supplierId: listing.supplierId,
      supplierName: listing.supplierName,
      available: listing.quantity,
    });
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    addToCart();
    navigate('/cart');
  };

  return (
    <div className="page-shell">
      <div className="listing-layout">
        <section className="gallery-column">
          <img src={safeSelectedImage} alt={listing.title} className="listing-main-image" />
          <div className="thumbnail-row">
            {galleryImages.map((image) => (
              <button key={image} type="button" className="thumbnail-button" onClick={() => setSelectedImage(image)}>
                <img src={image} alt="Product thumbnail" className="listing-thumb" />
              </button>
            ))}
          </div>
        </section>

        <section className="details-column">
          <span className="badge">{listing.category}</span>
          <h1 className="detail-title">{listing.title}</h1>
          <div className="price-line">Rs.{Number(listing.price).toFixed(2)} / unit</div>
          <p className={`availability ${listing.quantity < 5 ? 'warning' : ''}`}>
            {listing.quantity} units available {listing.quantity < 5 ? '(Low stock)' : ''}
          </p>

          

          <div className="supplier-card">
            <div>
              <strong>{listing.supplierName}</strong>
              <div className="supplier-meta">
                <StarRating value={averageRating} />
                <span>{averageRating.toFixed(1)} ({reviews.length} reviews)</span>
              </div>
            </div>
          </div>

          <div className="quantity-row">
            <button
              type="button"
              className="qty-button"
              onClick={() => setSelectedQuantity((value) => Math.max(1, value - 1))}
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={listing.quantity}
              value={selectedQuantity}
              onChange={(event) => setSelectedQuantity(Math.max(1, Math.min(listing.quantity, Number(event.target.value) || 1)))}
              className="qty-input"
            />
            <button
              type="button"
              className="qty-button"
              onClick={() => setSelectedQuantity((value) => Math.min(listing.quantity, value + 1))}
            >
              +
            </button>
          </div>

          {token ? (
            <div className="action-buttons">
              <button type="button" className="btn btn-primary" onClick={addToCart}>
                Add to Cart
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          ) : (
            <div className="login-prompt">
              <Link to="/login">Login to purchase</Link>
            </div>
          )}
        </section>
      </div>

      <section className="reviews-section">
        <div className="reviews-summary">
          <div>
            <div className="avg-score">{averageRating.toFixed(1)}</div>
            <StarRating value={averageRating} />
          </div>
          <div>{reviews.length} reviews</div>
        </div>

        <div className="review-list">
          {reviewPage.map((review) => (
            <ReviewCard
              key={review.id}
              buyerName={review.buyerName}
              createdAt={review.createdAt}
              rating={review.rating}
              comment={review.comment}
            />
          ))}
        </div>

        <div className="pagination-row">
          <button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button type="button" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>
            Next
          </button>
        </div>
      </section>
    </div>
  );
}
