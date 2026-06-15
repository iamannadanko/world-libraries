import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaBookOpen,
  FaGlobe,
  FaLightbulb,
  FaTrash,
  FaSpinner,
  FaLandmark,
  FaGem,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaExpand,
  FaCheck,
  FaExclamationTriangle
} from 'react-icons/fa';

function formatNumber(num) {
  return num?.toLocaleString('uk-UA') || '—';
}

/* ───────── Lightbox gallery ───────── */
function GalleryLightbox({ images, initialIndex, onClose }) {
  const [idx, setIdx] = useState(initialIndex);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [images.length, onClose]);

  return (
    <div className="gallery-lightbox" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}><FaTimes /></button>
        <button className="lightbox-prev" onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}>
          <FaChevronLeft />
        </button>
        <img src={images[idx]} alt={`Фото ${idx + 1}`} />
        <button className="lightbox-next" onClick={() => setIdx((i) => (i + 1) % images.length)}>
          <FaChevronRight />
        </button>
        <div className="lightbox-counter">{idx + 1} / {images.length}</div>
      </div>
    </div>
  );
}

function LibraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, getToken } = useAuth();
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [deleteRequested, setDeleteRequested] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [showDeleteForm, setShowDeleteForm] = useState(false);

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

  // Адмін — видаляє напряму
  const handleAdminDelete = async () => {
    if (!window.confirm('Видалити цю бібліотеку назавжди?')) return;
    try {
      const token = await getToken();
      await fetch(`/api/libraries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/');
    } catch (err) {
      alert('Помилка при видаленні');
    }
  };

  // Користувач — надсилає запит на видалення
  const handleDeleteRequest = async () => {
    try {
      const token = await getToken();
      const res = await fetch('/api/delete-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ library_id: parseInt(id), reason: deleteReason })
      });
      if (res.ok) {
        setDeleteRequested(true);
        setShowDeleteForm(false);
      }
    } catch (err) {
      alert('Помилка при надсиланні запиту');
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

  // All images: main + gallery
  const allImages = [library.image_url, ...(library.gallery_urls || [])].filter(Boolean);

  return (
    <section className="library-detail py-4">
      <div className="container">
        {/* Back button */}
        <Link to="/" className="btn btn-outline-secondary rounded-pill mb-4">
          <FaArrowLeft className="me-2" /> Назад
        </Link>

        {/* Pending badge */}
        {library.status === 'pending' && (
          <div className="alert alert-warning d-flex align-items-center gap-2 rounded-3 mb-4">
            <FaExclamationTriangle />
            <span>Ця бібліотека очікує підтвердження адміністратором</span>
          </div>
        )}

        <div className="row g-4">
          {/* Image */}
          <div className="col-lg-6">
            <div
              className="detail-image-wrapper rounded-4 overflow-hidden shadow position-relative"
              style={{ cursor: 'pointer' }}
              onClick={() => { setLightboxIndex(0); setLightboxOpen(true); }}
            >
              <img
                src={library.image_url}
                alt={library.name}
                className="w-100 h-100 object-fit-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800';
                }}
              />
              {allImages.length > 1 && (
                <div className="expand-hint">
                  <FaExpand className="me-1" /> {allImages.length} фото
                </div>
              )}
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
              <div className="fun-fact-card p-3 rounded-3 mb-3">
                <div className="d-flex align-items-start gap-2">
                  <FaLightbulb className="text-warning fs-5 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="d-block mb-1">Цікавий факт</strong>
                    <span className="text-muted">{library.fun_fact}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Architecture */}
            {library.architecture && (
              <div className="info-card p-3 rounded-3 mb-3">
                <div className="d-flex align-items-start gap-2">
                  <FaLandmark className="text-accent fs-5 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="d-block mb-1">Архітектура</strong>
                    <span className="text-muted">{library.architecture}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Notable items */}
            {library.notable_items && (
              <div className="info-card p-3 rounded-3 mb-3">
                <div className="d-flex align-items-start gap-2">
                  <FaGem className="text-accent fs-5 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="d-block mb-1">Визначні експонати</strong>
                    <span className="text-muted">{library.notable_items}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions — тільки для авторизованих */}
            {isAuthenticated && (
              <div className="mt-3">
                {isAdmin ? (
                  /* Адмін — видаляє напряму */
                  <button
                    onClick={handleAdminDelete}
                    className="btn btn-outline-danger rounded-pill"
                  >
                    <FaTrash className="me-2" /> Видалити (адмін)
                  </button>
                ) : deleteRequested ? (
                  /* Запит вже надіслано */
                  <div className="alert alert-success d-inline-flex align-items-center gap-2 rounded-pill px-4 py-2 mb-0">
                    <FaCheck /> Запит на видалення надіслано адміністратору
                  </div>
                ) : showDeleteForm ? (
                  /* Форма причини видалення */
                  <div className="card border-0 shadow-sm p-3 rounded-3">
                    <p className="fw-semibold mb-2">Причина видалення (необов'язково):</p>
                    <textarea
                      className="form-control mb-2"
                      rows="2"
                      value={deleteReason}
                      onChange={(e) => setDeleteReason(e.target.value)}
                      placeholder="Наприклад: дублікат, неактуальна інформація..."
                    />
                    <div className="d-flex gap-2">
                      <button
                        onClick={handleDeleteRequest}
                        className="btn btn-outline-danger rounded-pill btn-sm"
                      >
                        <FaTrash className="me-1" /> Надіслати запит
                      </button>
                      <button
                        onClick={() => setShowDeleteForm(false)}
                        className="btn btn-outline-secondary rounded-pill btn-sm"
                      >
                        Скасувати
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Кнопка для звичайного користувача */
                  <button
                    onClick={() => setShowDeleteForm(true)}
                    className="btn btn-outline-danger rounded-pill"
                  >
                    <FaTrash className="me-2" /> Запит на видалення
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ──── Photo Gallery ──── */}
        {allImages.length > 1 && (
          <div className="gallery-section mt-5">
            <h3 className="fw-bold mb-4">
              <span className="text-accent">📸</span> Фотогалерея
            </h3>
            <div className="gallery-grid">
              {allImages.map((url, i) => (
                <div
                  key={i}
                  className="gallery-item rounded-3 overflow-hidden shadow-sm"
                  onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                >
                  <img
                    src={url}
                    alt={`${library.name} — фото ${i + 1}`}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400';
                    }}
                  />
                  <div className="gallery-overlay">
                    <FaExpand />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <GalleryLightbox
          images={allImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}

export default LibraryDetail;
