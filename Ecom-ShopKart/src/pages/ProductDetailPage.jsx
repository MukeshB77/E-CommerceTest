import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, fetchProducts } from '../features/products/productsSlice';
import { addToCart } from '../features/cart/cartSlice';
import { formatPrice, prettyCategory } from '../components/products/ProductCard';
import ProductCard from '../components/products/ProductCard';
import Rating from '../components/common/Rating';
import QuantityStepper from '../components/common/QuantityStepper';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items, selectedProduct, selectedStatus, selectedError, status } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setQuantity(1);
    dispatch(fetchProductById(id));
    if (status === 'idle') dispatch(fetchProducts());
  }, [dispatch, id]);

  const product = selectedProduct && String(selectedProduct.id) === id ? selectedProduct : null;
  const related = items.filter((item) => item.id !== Number(id)).slice(0, 4);

  if (selectedStatus === 'loading' || selectedStatus === 'idle') {
    return <section className="page-container status-panel"><div className="loader" /><p>Loading products...</p></section>;
  }
  if (selectedStatus === 'failed' || !product) {
    return <section className="page-container status-panel"><h1>Product unavailable</h1><p>{selectedError || 'This product could not be found.'}</p><Link className="button button-primary" to="/">Browse products</Link></section>;
  }

  return (
    <section className="page-container detail-page">
      <div className="breadcrumbs"><Link to="/">Products</Link><span>/</span><span>{prettyCategory(product.category).toLowerCase()}</span><span>/</span><strong>{product.title}</strong></div>
      <div className="detail-panel">
        <div className="detail-gallery">
          <div className={`detail-main-image tint-${(product.id - 1) % 8}`}>
            <img src={product.image} alt={product.title} />
          </div>
          <div className="thumbnail-row">
            {[0, 1, 2, 3].map((index) => (
              <button key={index} className={`thumbnail tint-${(product.id - 1) % 8} ${activeImage === index ? 'active' : ''}`} onClick={() => setActiveImage(index)} aria-label={`Select product image ${index + 1}`}>
                <img src={product.image} alt="" />
              </button>
            ))}
          </div>
        </div>
        <div className="detail-info">
          <span className="category-pill">{prettyCategory(product.category)}</span>
          <h1>{product.title}</h1>
          <Rating rating={product.rating?.rate} count={product.rating?.count} />
          <div className="detail-price">{formatPrice(product.price)}</div>
          <p className="detail-description">{product.description}</p>
          <div className="detail-quantity-row"><span>Quantity</span><QuantityStepper quantity={quantity} onDecrease={() => setQuantity((value) => Math.max(1, value - 1))} onIncrease={() => setQuantity((value) => value + 1)} /></div>
          <div className="detail-actions">
            <button className="button button-primary" onClick={() => dispatch(addToCart({ ...product, quantity }))}>🛒 &nbsp; Add to cart</button>
            <Link className="button button-outline" to="/cart">Go to cart</Link>
          </div>
          <div className="service-notes"><p><span>▣</span> Free shipping on orders of $100 or more</p><p><span>↻</span> 30-day easy returns</p></div>
        </div>
      </div>
      <section className="related-section">
        <h2>You may also like</h2>
        <div className="related-grid">
          {related.map((item) => <ProductCard key={item.id} product={item} />)}
        </div>
      </section>
    </section>
  );
}