export default function Rating({ rating, count }) {
  const score = Number(rating) || 0;
  return (
    <div className="rating" aria-label={`${score.toFixed(1)} out of 5, ${count ?? 0} reviews`}>
      <span className="rating-star">★</span>
      <strong>{score.toFixed(1)}</strong>
      <span className="review-count">({count ?? 0} reviews)</span>
    </div>
  );
}