import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import LibraryCard from './LibraryCard';
import {
  FaUser, FaEnvelope, FaCalendarAlt, FaSignOutAlt,
  FaHeart, FaBookOpen, FaSpinner
} from 'react-icons/fa';

function Profile() {
  const { user, signOut } = useAuth();
  const { favorites } = useFavorites();
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetch('/api/libraries')
      .then((r) => r.json())
      .then((data) => { setLibraries(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (!user) return null;

  const displayName = user.user_metadata?.display_name || user.email?.split('@')[0] || 'Користувач';
  const createdAt = new Date(user.created_at).toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const favoriteLibs = libraries.filter((l) => favorites.includes(l.id));

  return (
    <section className="py-5">
      <div className="container">
        <div className="row g-4">
          {/* Profile card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 profile-card">
              <div className="profile-header text-center text-white p-4">
                <div className="profile-avatar mx-auto mb-3">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <h4 className="fw-bold mb-1">{displayName}</h4>
              </div>
              <div className="card-body p-4">
                <div className="profile-info">
                  <div className="profile-info-item d-flex align-items-center gap-3 mb-3">
                    <FaEnvelope className="text-accent" />
                    <div>
                      <small className="text-muted d-block">Email</small>
                      <span className="fw-semibold">{user.email}</span>
                    </div>
                  </div>
                  <div className="profile-info-item d-flex align-items-center gap-3 mb-3">
                    <FaCalendarAlt className="text-accent" />
                    <div>
                      <small className="text-muted d-block">Зареєстрований</small>
                      <span className="fw-semibold">{createdAt}</span>
                    </div>
                  </div>
                  <div className="profile-info-item d-flex align-items-center gap-3 mb-3">
                    <FaHeart className="text-danger" />
                    <div>
                      <small className="text-muted d-block">В обраному</small>
                      <span className="fw-semibold">{favorites.length} бібліотек</span>
                    </div>
                  </div>
                </div>

                <hr />

                <button
                  className="btn btn-outline-danger w-100 rounded-pill"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="me-2" /> Вийти
                </button>
              </div>
            </div>
          </div>

          {/* Favorites section */}
          <div className="col-lg-8">
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h3 className="fw-bold mb-0">
                <FaHeart className="text-danger me-2" />
                Мої обрані
              </h3>
              <span className="badge bg-accent rounded-pill fs-6 px-3 py-2">
                {favorites.length}
              </span>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <FaSpinner className="fa-spin fs-1 text-accent" />
              </div>
            ) : favoriteLibs.length > 0 ? (
              <div className="row g-3 library-grid">
                {favoriteLibs.map((lib, idx) => (
                  <LibraryCard key={lib.id} library={lib} index={idx} />
                ))}
              </div>
            ) : (
              <div className="text-center py-5 card border-0 shadow-sm rounded-4">
                <div className="card-body">
                  <div className="fs-1 mb-3">📚</div>
                  <h5 className="text-muted mb-3">Поки що нічого в обраному</h5>
                  <p className="text-muted mb-4">
                    Натискайте ❤️ на бібліотеках, щоб зберегти їх тут
                  </p>
                  <Link to="/" className="btn btn-accent rounded-pill px-4">
                    <FaBookOpen className="me-2" /> Переглянути бібліотеки
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
