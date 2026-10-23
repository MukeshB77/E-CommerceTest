import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
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
    // The reference design displays the first eight Fake Store API products.
    let result = [...items].slice(0, 8);
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
        <div className="product-grid">
          {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="no-results"><h2>No products found</h2><p>Try another search or category.</p></div>
      )}
    </section>
  );
}