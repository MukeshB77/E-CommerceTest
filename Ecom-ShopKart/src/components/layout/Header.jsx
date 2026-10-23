import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { selectTotalItems } from '../../features/cart/cartSlice';
import { toggleTheme } from '../../features/theme/themeSlice';

export default function Header() {
  const totalItems = useSelector(selectTotalItems);
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
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
        <Link to="/" className="brand" aria-label="HollowKart home">Hollow<span>Kart</span></Link>
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
          <button
            className="theme-toggle"
            type="button"
            onClick={() => dispatch(toggleTheme())}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-pressed={theme === 'dark'}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span aria-hidden="true">{theme === 'light' ? '☾' : '☼'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
