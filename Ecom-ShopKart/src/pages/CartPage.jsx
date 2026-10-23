import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, decrease, increase, removeFromCart, selectTotalItems, selectTotalPrice } from '../features/cart/cartSlice';
import QuantityStepper from '../components/common/QuantityStepper';
import { formatPrice, prettyCategory } from '../components/products/ProductCard';

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const totalItems = useSelector(selectTotalItems);
  const subtotal = useSelector(selectTotalPrice);
  const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 5;
  const total = subtotal + shipping;

  return (
    <section className="page-container cart-page">
      <div className="cart-heading-row">
        <h1>Your cart <span>({totalItems} {totalItems === 1 ? 'item' : 'items'})</span></h1>
        {items.length > 0 && <Link to="/" className="continue-shopping">Continue shopping</Link>}
      </div>

      {items.length === 0 ? (
        <div className="empty-cart-panel">
          <div className="empty-cart-icon" aria-hidden="true">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet. Browse the<br className="desktop-break" /> products and add your favourites.</p>
          <Link to="/" className="button button-primary empty-browse-button">Browse products</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items-panel">
            <div className="cart-items-header"><span>PRODUCT</span><button className="button button-outline clear-button" onClick={() => dispatch(clearCart())}>Clear cart</button></div>
            {items.map((item) => (
              <article className="cart-item-row" key={item.id}>
                <Link to={`/product/${item.id}`} className={`cart-item-image tint-${(item.id - 1) % 8}`}><img src={item.image} alt={item.title} /></Link>
                <div className="cart-item-description">
                  <Link to={`/product/${item.id}`} className="cart-item-title">{item.title}</Link>
                  <span className="category-label">{prettyCategory(item.category)}</span>
                  <span className="each-price">{formatPrice(item.price)} each</span>
                </div>
                <QuantityStepper quantity={item.quantity} onDecrease={() => dispatch(decrease(item.id))} onIncrease={() => dispatch(increase(item.id))} label={`${item.title} quantity`} />
                <strong className="line-total">{formatPrice(item.price * item.quantity)}</strong>
                <button className="remove-button" onClick={() => dispatch(removeFromCart(item.id))} aria-label={`Remove ${item.title}`}>♜</button>
              </article>
            ))}
          </section>

          <aside className="order-summary">
            <h2>Order summary</h2>
            <div className="summary-row"><span>Items</span><span>{totalItems}</span></div>
            <div className="summary-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="summary-row"><span>Shipping</span><strong className={shipping === 0 ? 'free-shipping' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</strong></div>
            <div className="summary-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
            <button className="button button-primary checkout-button" onClick={() => window.alert('Checkout is not part of this task.')}>Proceed to checkout</button>
            <p className="persist-note">Cart is saved with redux-persist. Refresh and it stays.</p>
          </aside>
        </div>
      )}
    </section>
  );
}