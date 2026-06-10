import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBookOpen,
  FaGlobe,
  FaLightbulb,
  FaTrash,
  FaSpinner
} from 'react-icons/fa';

function formatNumber(num) {
  return num?.toLocaleString('uk-UA') || '—';
}

function LibraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLibrary();
  }, [id]);

  const fetchLibrary = async () => {
    try {
      const res = await fetch(`/api/libraries/${id}`);
      if (!res.ok) throw new Error('Бібліотеку не знайдено');
      const data = await res.json();
      setLibrary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Видалити цю бібліотеку?')) return;
    try {
      await fetch(`/api/libraries/${id}`, { method: 'DELETE' });
      navigate('/');
    } catch (err) {
      alert('Помилка при видаленні');
    }
  };

  if (loading) {
    return (
      <section className="py-5 text-center">
        <FaSpinner className="fa-spin fs-1 text-accent" />
      </section>
    );
  }

  if (error || !library) {
    return (
      <section className="py-5">
        <div className="container text-center">
          <h3 className="text-muted mb-4">{error || 'Бібліотеку не знайдено'}</h3>
          <Link to="/" className="btn btn-accent rounded-pill">
            <FaArrowLeft className="me-2" /> На головну
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="library-detail py-4">
      <div className="container">
        {/* Back button */}
        <Link to="/" className="btn btn-outline-secondary rounded-pill mb-4">
          <FaArrowLeft className="me-2" /> Назад
        </Link>

        <div className="row g-4">
          {/* Image */}
          <div className="col-lg-6">
            <div className="detail-image-wrapper rounded-4 overflow-hidden shadow">
              <img
                src={library.image_url}
                alt={library.name}
                className="w-100 h-100 object-fit-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800';
                }}
              />
            </div>
          </div>

          {/* Info */}
          <div className="col-lg-6">
            <h1 className="fw-bold mb-1">{library.name}</h1>
            {library.name_en && (
              <p className="text-muted mb-3 fst-italic">{library.name_en}</p>
            )}

            {/* Stats grid */}
            <div className="stats-grid mb-4">
              <div className="stat-item">
                <FaMapMarkerAlt className="text-accent" />
                <div>
                  <small className="text-muted d-block">Місто</small>
                  <strong>{library.city}, {library.country}</strong>
                </div>
              </div>
              <div className="stat-item">
                <FaCalendarAlt className="text-accent" />
                <div>
                  <small className="text-muted d-block">Заснована</small>
                  <strong>{library.founded} рік</strong>
                </div>
              </div>
              <div className="stat-item">
                <FaBookOpen className="text-accent" />
                <div>
                  <small className="text-muted d-block">Колекція</small>
                  <strong>{formatNumber(library.collection_size)} од.</strong>
                </div>
              </div>
              <div className="stat-item">
                <FaGlobe className="text-accent" />
                <div>
                  <small className="text-muted d-block">Сайт</small>
                  <a
                    href={library.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent fw-bold text-decoration-none"
                  >
                    Відвідати →
                  </a>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted lh-lg">{library.description}</p>

            {/* Fun fact */}
            {library.fun_fact && (
              <div className="fun-fact-card p-3 rounded-3 mb-4">
                <div className="d-flex align-items-start gap-2">
                  <FaLightbulb className="text-warning fs-5 mt-1" />
                  <div>
                    <strong className="d-block mb-1">Цікавий факт</strong>
                    <span className="text-muted">{library.fun_fact}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <button
              onClick={handleDelete}
              className="btn btn-outline-danger rounded-pill"
            >
              <FaTrash className="me-2" /> Видалити
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LibraryDetail;
