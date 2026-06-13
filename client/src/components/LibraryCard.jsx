import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaBookOpen, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useFavorites } from '../context/FavoritesContext';

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + ' млн';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + ' тис';
  }
  return num?.toString() || '—';
}

function LibraryCard({ library, index }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = isFavorite(library.id);

  return (
    <div
      className="col-12 col-sm-6 col-lg-4 col-xl-3 d-flex"
      data-aos="fade-up"
      data-aos-delay={index * 80}
      data-aos-duration="600"
    >
      <div className="card library-card h-100 border-0 shadow-sm">
        <div className="card-img-wrapper">
          <img
            src={library.image_url}
            className="card-img-top"
            alt={library.name}
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600';
            }}
          />
          <div className="card-img-overlay-badge">
            <span className="badge bg-accent rounded-pill">
              <FaBookOpen className="me-1" />
              {formatNumber(library.collection_size)}
            </span>
          </div>
          {/* Favorite button */}
          <button
            className={`favorite-btn ${liked ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); toggleFavorite(library.id); }}
            title={liked ? 'Прибрати з обраного' : 'Додати в обране'}
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
          </button>
        </div>
        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-bold mb-2">{library.name}</h5>
          <div className="card-meta d-flex flex-wrap gap-3 mb-3 text-muted small">
            <span className="d-flex align-items-center gap-1">
              <FaMapMarkerAlt className="text-accent" />
              {library.city}, {library.country}
            </span>
            <span className="d-flex align-items-center gap-1">
              <FaCalendarAlt className="text-accent" />
              {library.founded} р.
            </span>
          </div>
          <p className="card-text text-muted small flex-grow-1">
            {library.description?.substring(0, 120)}...
          </p>
          <Link
            to={`/library/${library.id}`}
            className="btn btn-outline-accent mt-auto rounded-pill"
          >
            Детальніше →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LibraryCard;
