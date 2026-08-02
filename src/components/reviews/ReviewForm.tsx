import { useState } from 'react';
import toast from 'react-hot-toast';
import { reviewsApi } from '../../services/reviewsApi';
import { StarRating } from './StarRating';

type ReviewFormProps = {
  orderId: string;
  onSubmitted: () => void;
};

export default function ReviewForm({ orderId, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a star rating.');
      return;
    }

    if (comment.trim().length < 10 || comment.trim().length > 500) {
      toast.error('Please write a review comment between 10 and 500 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await reviewsApi.create({ orderId, rating, comment: comment.trim() });
      toast.success('Review submitted!');
      setSubmitted(true);
      onSubmitted();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <p className="muted-text">Review submitted.</p>;
  }

  return (
    <div className="review-form-card">
      <h3>Leave a Review</h3>
      <div className="review-form-row">
        <label>Rating</label>
        <StarRating value={rating} onChange={setRating} />
      </div>
      <label>
        Comment
        <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={4} minLength={10} maxLength={500} />
      </label>
      <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  );
}
