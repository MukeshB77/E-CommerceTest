import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { fetchProducts } from '../features/products/productsSlice';
import ProductCard from '../components/products/ProductCard';

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Jewelery', value: 'jewelery' },
  { label: "Men's clothing", value: "men's clothing" },
  { label: "Women's clothing", value: "women's clothing" },
];

export default function ProductListPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { items, status, error } = useSelector((state) => state.products);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [search, setSearch] = useState(location.state?.search || '');

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
  }, [dispatch, status]);

  useEffect(() => {
    if (location.state?.search !== undefined) setSearch(location.state.search);
  }, [location.state]);

  const visibleProducts = useMemo(() => {
    let result = [...items];
    if (category !== 'all') result = result.filter((product) => product.category === category);
    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((product) => `${product.title} ${product.category} ${product.description}`.toLowerCase().includes(query));
    }
    if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
    return result;
  }, [items, category, sort, search]);

  if (status === 'loading' || status === 'idle') {
    return <section className="page-container status-panel"><div className="loader" /><p>Loading products...</p></section>;
  }

  if (status === 'failed') {
    return (
      <section className="page-container status-panel">
        <h1>Products could not be loaded</h1>
        <p>{error}</p>
        <button className="button button-primary" onClick={() => dispatch(fetchProducts())}>Try again</button>
      </section>
    );
  }

  return (
    <section className="page-container listing-page">
      <section className="shop-hero" aria-labelledby="shop-hero-title">
        <div className="shop-hero-copy">
          <p className="shop-hero-eyebrow">
            {/* <span aria-hidden="true" /> */}
           The HollowKart collection</p>
          <h2 id="shop-hero-title">Find something you’ll love.</h2>
          <p className="shop-hero-description">Everyday essentials and little luxuries, all in one place.</p>
          <a className="button button-primary shop-hero-button" href="#product-grid">
            Browse products <span aria-hidden="true">→</span>
          </a>
        </div>
        {items[0] && (
          <Link
            className="shop-hero-featured"
            to={`/product/${items[0].id}`}
            aria-label={`Featured product: ${items[0].title}`}
          >
            <div className={`shop-hero-image tint-${(items[0].id - 1) % 8}`}>
              <img src={items[0].image} alt="" />
            </div>
            <div className="shop-hero-featured-copy">
              <span>Picked for you</span>
              <strong>{items[0].title}</strong>
            </div>
            <span className="shop-hero-featured-arrow" aria-hidden="true">↗</span>
          </Link>
        )}
      </section>

      <div className="page-heading-row">
        <div>
          <h1>All products</h1>
          <p className="subheading">Showing {visibleProducts.length} products</p>
        </div>
        <label className="sort-control">
          <span>Sort by</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </div>

      <div className="listing-toolbar">
        <div className="category-chips" aria-label="Filter by category">
          {categories.map((item) => (
            <button
              key={item.value}
              className={`category-chip ${category === item.value ? 'selected' : ''}`}
              onClick={() => setCategory(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <input className="mobile-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" aria-label="Search products" />
      </div>

      {visibleProducts.length ? (
        <div className="product-grid" id="product-grid">
          {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="no-results" id="product-grid"><h2>No products found</h2><p>Try another search or category.</p></div>
      )}
    </section>
  );
}