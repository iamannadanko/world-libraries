import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBook, FaPlus, FaHome } from 'react-icons/fa';

function Navbar() {
  const location = useLocation();

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
          <ul className="navbar-nav ms-auto gap-1">
            <li className="nav-item">
              <Link
                className={`nav-link d-flex align-items-center gap-1 ${location.pathname === '/' ? 'active' : ''}`}
                to="/"
              >
                <FaHome /> Головна
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link d-flex align-items-center gap-1 ${location.pathname === '/add' ? 'active' : ''}`}
                to="/add"
              >
                <FaPlus /> Додати
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
