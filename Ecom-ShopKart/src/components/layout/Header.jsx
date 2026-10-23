import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { selectTotalItems } from '../../features/cart/cartSlice';

export default function Header() {
  const totalItems = useSelector(selectTotalItems);
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  function submitSearch(event) {
    event.preventDefault();
    navigate('/', { state: { search: search.trim() } });
  }
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="HollowCart home">Hollow<span>Cart</span></Link>
        <form className="search-form" onSubmit={submitSearch}>
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            aria-label="Search products"
            placeholder="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          {search && <button className="search-clear" type="button" onClick={() => setSearch('')} aria-label="Clear search">×</button>}
        </form>
        <nav className="header-nav" aria-label="Main navigation">
          <NavLink to="/" className={({ isActive }) => `nav-products ${isActive && location.pathname === '/' ? 'active' : ''}`}>Products</NavLink>
          <Link to="/cart" className={`cart-link ${location.pathname === '/cart' ? 'active' : ''}`}>
            <span aria-hidden="true">🛒</span> Cart <span className={`cart-badge ${totalItems === 0 ? 'zero' : ''}`}>{totalItems}</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
