import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decrease, increase } from '../../features/cart/cartSlice';
import QuantityStepper from '../common/QuantityStepper';
import Rating from '../common/Rating';

export function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

export function prettyCategory(category = '') {
  if (category === "men's clothing") return "MEN'S CLOTHING";
  if (category === "women's clothing") return "WOMEN'S CLOTHING";
  return category.toUpperCase();
}

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const cartItem = useSelector((state) => state.cart.items.find((item) => item.id === product.id));
  const quantity = cartItem?.quantity || 0;

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-link" aria-label={`View ${product.title}`}>
        <div className={`product-image-wrap tint-${(product.id - 1) % 8}`}>
          <img src={product.image} alt={product.title} loading="lazy" />
        </div>
      </Link>
      <div className="product-card-body">
        <span className="category-label">{prettyCategory(product.category)}</span>
        <Link to={`/product/${product.id}`} className="product-title">{product.title}</Link>
        <Rating rating={product.rating?.rate} count={product.rating?.count} />
        <div className="product-card-bottom">
          <strong className="product-price">{formatPrice(product.price)}</strong>
          {quantity > 0 ? (
            <QuantityStepper
              quantity={quantity}
              onDecrease={() => dispatch(decrease(product.id))}
              onIncrease={() => dispatch(increase(product.id))}
              label={`${product.title} quantity`}
            />
          ) : (
            <button className="button button-primary button-small" onClick={() => dispatch(addToCart({ ...product, quantity: 1 }))}>
              Add to cart
            </button>
          )}
        </div>
      </div>
    </article>
  );
}