type StarRatingProps = {
  value: number;
  onChange?: (nextValue: number) => void;
};

function valueToNumber(value: number) {
  return Math.max(0, Math.min(5, value));
}

export function StarRating({ value, onChange }: StarRatingProps) {
  return (
    <div className="star-rating" aria-label={`Rated ${value} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => {
        const active = index < Math.round(valueToNumber(value));
        const star = active ? '★' : '☆';
        return (
          <button
            key={index}
            type="button"
            className={`star-button ${active ? 'active' : ''}`}
            onClick={() => onChange?.(index + 1)}
            disabled={!onChange}
            aria-label={`Rate ${index + 1} star${index === 0 ? '' : 's'}`}
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}
