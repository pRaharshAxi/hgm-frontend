import { StarRating } from './StarRating';

type ReviewCardProps = {
  buyerName: string;
  createdAt: string;
  rating: number;
  comment: string;
};

const maskName = (name: string) => {
  const [first, ...rest] = name.split(' ');
  const lastName = rest.at(-1) ?? '';
  const maskedLast = lastName ? `${lastName[0]}***` : '';
  return `${first[0] ?? ''}*** ${maskedLast}`.trim();
};

export function ReviewCard({ buyerName, createdAt, rating, comment }: ReviewCardProps) {
  return (
    <article className="review-card">
      <div className="review-header">
        <div>
          <strong>{maskName(buyerName)}</strong>
          <div className="review-date">{new Date(createdAt).toLocaleDateString()}</div>
        </div>
        <StarRating value={rating} />
      </div>
      <p className="review-comment">{comment}</p>
    </article>
  );
}
