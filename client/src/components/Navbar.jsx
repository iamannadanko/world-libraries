import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlus, FaHome, FaChartBar, FaMapMarkedAlt, FaHeart, FaMoon, FaSun, FaSignInAlt, FaUserCircle, FaShieldAlt } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const { isAuthenticated, isAdmin, user } = useAuth();

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || '';

  const navItems = [
    { path: '/', icon: <FaHome />, label: 'Головна' },
    { path: '/statistics', icon: <FaChartBar />, label: 'Статистика' },
    { path: '/map', icon: <FaMapMarkedAlt />, label: 'Карта' },
    { path: '/favorites', icon: <FaHeart />, label: 'Обрані', badge: favorites.length, authOnly: true },
    { path: '/add', icon: <FaPlus />, label: 'Додати', authOnly: true },
    { path: '/admin', icon: <FaShieldAlt />, label: 'Адмін', adminOnly: true },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-navbar sticky-top shadow">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
          <span className="brand-icon">📚</span>
          <span>Бібліотеки Світу</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-1 align-items-center">
            {navItems.map((item) => {
              // Сховати adminOnly пункти для не-адмінів
              if (item.adminOnly && !isAdmin) return null;
              // Сховати authOnly пункти для неавторизованих
              if (item.authOnly && !isAuthenticated) return null;
              return (
                <li className="nav-item" key={item.path}>
                  <Link
                    className={`nav-link d-flex align-items-center gap-1 ${location.pathname === item.path ? 'active' : ''}`}
                    to={item.path}
                  >
                    {item.icon} {item.label}
                    {item.badge > 0 && (
                      <span className="badge bg-danger rounded-pill ms-1" style={{ fontSize: '0.7rem' }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}

            {/* Separator */}
            <li className="nav-item ms-1 d-none d-lg-block">
              <span className="nav-link px-0 opacity-25">|</span>
            </li>

            {/* Theme toggle */}
            <li className="nav-item">
              <button
                className="btn btn-sm theme-toggle-btn rounded-pill"
                onClick={toggleTheme}
                title={darkMode ? 'Світла тема' : 'Темна тема'}
              >
                {darkMode ? <FaSun className="text-warning" /> : <FaMoon className="text-light" />}
              </button>
            </li>

            {/* Auth button */}
            <li className="nav-item ms-1">
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className={`nav-link d-flex align-items-center gap-1 ${location.pathname === '/profile' ? 'active' : ''}`}
                  title={displayName}
                >
                  <span className="nav-avatar">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                  <span className="d-none d-xl-inline">{displayName}</span>
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className={`nav-link d-flex align-items-center gap-1 ${location.pathname === '/auth' ? 'active' : ''}`}
                >
                  <FaSignInAlt /> Увійти
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
