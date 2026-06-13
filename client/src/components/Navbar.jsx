import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaPlus, FaHome, FaChartBar, FaMapMarkedAlt, FaHeart, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';

function Navbar() {
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const { favorites } = useFavorites();

  const navItems = [
    { path: '/', icon: <FaHome />, label: 'Головна' },
    { path: '/statistics', icon: <FaChartBar />, label: 'Статистика' },
    { path: '/map', icon: <FaMapMarkedAlt />, label: 'Карта' },
    { path: '/favorites', icon: <FaHeart />, label: 'Обрані', badge: favorites.length },
    { path: '/add', icon: <FaPlus />, label: 'Додати' },
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
            {navItems.map((item) => (
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
            ))}
            <li className="nav-item ms-2">
              <button
                className="btn btn-sm theme-toggle-btn rounded-pill"
                onClick={toggleTheme}
                title={darkMode ? 'Світла тема' : 'Темна тема'}
              >
                {darkMode ? <FaSun className="text-warning" /> : <FaMoon className="text-light" />}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
