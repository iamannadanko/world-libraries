import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import LibraryCard from './LibraryCard';
import { FaHeart, FaSpinner, FaArrowLeft } from 'react-icons/fa';

function Favorites() {
  const { favorites } = useFavorites();
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/libraries')
      .then((r) => r.json())
      .then((data) => { setLibraries(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-5 text-center">
        <FaSpinner className="fa-spin fs-1 text-accent" />
      </section>
    );
  }

  const favoriteLibs = libraries.filter((l) => favorites.includes(l.id));

  return (
    <section className="py-5 bg-light-custom">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold section-title">
            <FaHeart className="text-danger me-2" />
            Мої обрані
          </h2>
          <p className="text-muted mt-3">
            {favoriteLibs.length > 0
              ? `${favoriteLibs.length} бібліотек у вашому списку`
              : 'Додайте бібліотеки в обране натиснувши ❤️ на картці'
            }
          </p>
        </div>

        {favoriteLibs.length > 0 ? (
          <div className="row g-4 library-grid">
            {favoriteLibs.map((lib, index) => (
              <LibraryCard key={lib.id} library={lib} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="fs-1 mb-3">💔</div>
            <h4 className="text-muted mb-4">Список обраних порожній</h4>
            <p className="text-muted mb-4">
              Перейдіть на головну та натисніть ❤️ на бібліотеках, які вам подобаються
            </p>
            <Link to="/" className="btn btn-accent rounded-pill px-4">
              <FaArrowLeft className="me-2" /> На головну
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default Favorites;
