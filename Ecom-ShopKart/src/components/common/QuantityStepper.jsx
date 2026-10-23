export default function QuantityStepper({ quantity, onDecrease, onIncrease, label = 'Quantity' }) {
  return (
    <div className="quantity-control" aria-label={label}>
      <button type="button" onClick={onDecrease} aria-label="Decrease quantity">−</button>
      <span>{quantity}</span>
      <button type="button" onClick={onIncrease} aria-label="Increase quantity">+</button>
    </div>
  );
}