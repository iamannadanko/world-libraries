import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import LibraryCard from './LibraryCard';
import { FaHeart, FaSpinner, FaArrowLeft, FaLock, FaSignInAlt } from 'react-icons/fa';

function Favorites() {
  const { favorites } = useFavorites();
  const { isAuthenticated } = useAuth();
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/libraries')
      .then((r) => r.json())
      .then((data) => { setLibraries(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Якщо не авторизований
  if (!isAuthenticated) {
    return (
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="card border-0 shadow-sm rounded-4 p-5">
                <FaLock className="fs-1 text-muted mb-3" />
                <h3 className="fw-bold mb-3">Потрібна авторизація</h3>
                <p className="text-muted mb-4">
                  Увійдіть, щоб зберігати бібліотеки в обране
                </p>
                <Link to="/auth" className="btn btn-accent rounded-pill px-4">
                  <FaSignInAlt className="me-2" /> Увійти
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
