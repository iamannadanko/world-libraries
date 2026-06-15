import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaShieldAlt,
  FaCheck,
  FaTimes,
  FaTrash,
  FaSpinner,
  FaBookOpen,
  FaUsers,
  FaClock,
  FaExclamationTriangle,
  FaLock
} from 'react-icons/fa';

function AdminPanel() {
  const { isAuthenticated, isAdmin, getToken } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingLibraries, setPendingLibraries] = useState([]);
  const [deleteRequests, setDeleteRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [statsRes, pendingRes, deletesRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/pending-libraries', { headers }),
        fetch('/api/admin/delete-requests', { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (pendingRes.ok) setPendingLibraries(await pendingRes.json());
      if (deletesRes.ok) setDeleteRequests(await deletesRes.json());
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (url, id) => {
    setActionLoading(id);
    try {
      const token = await getToken();
      await fetch(url, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadData();
    } catch (err) {
      alert('Помилка: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Не авторизований
  if (!isAuthenticated || !isAdmin) {
    return (
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="card border-0 shadow-sm rounded-4 p-5">
                <FaLock className="fs-1 text-muted mb-3" />
                <h3 className="fw-bold mb-3">Доступ заборонено</h3>
                <p className="text-muted mb-4">
                  Ця сторінка доступна тільки для адміністратора
                </p>
                <Link to="/" className="btn btn-accent rounded-pill px-4">
                  На головну
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

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="fw-bold mb-4 text-center section-title">
          <FaShieldAlt className="me-2 text-accent" />
          Адмін-панель
        </h2>

        {/* Stats cards */}
        {stats && (
          <div className="row g-3 mb-5">
            <div className="col-md-3 col-6">
              <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
                <FaBookOpen className="fs-3 text-accent mb-2" />
                <div className="fs-2 fw-bold">{stats.totalLibraries}</div>
                <small className="text-muted">Бібліотек</small>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
                <FaClock className="fs-3 text-warning mb-2" />
                <div className="fs-2 fw-bold">{stats.pendingLibraries}</div>
                <small className="text-muted">Очікують додавання</small>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
                <FaTrash className="fs-3 text-danger mb-2" />
                <div className="fs-2 fw-bold">{stats.pendingDeletes}</div>
                <small className="text-muted">Запити на видалення</small>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
                <FaUsers className="fs-3 text-accent mb-2" />
                <div className="fs-2 fw-bold">{stats.totalUsers}</div>
                <small className="text-muted">Користувачів</small>
              </div>
            </div>
          </div>
        )}

        {/* Pending libraries */}
        <div className="mb-5">
          <h4 className="fw-bold mb-3">
            <FaClock className="me-2 text-warning" />
            Бібліотеки на модерації ({pendingLibraries.length})
          </h4>

          {pendingLibraries.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center text-muted">
              Немає бібліотек на модерації ✨
            </div>
          ) : (
            <div className="row g-3">
              {pendingLibraries.map((lib) => (
                <div key={lib.id} className="col-12">
                  <div className="card border-0 shadow-sm rounded-4 p-4">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                      <div className="flex-grow-1">
                        <h5 className="fw-bold mb-1">{lib.name}</h5>
                        {lib.name_en && <small className="text-muted fst-italic">{lib.name_en}</small>}
                        <p className="text-muted mb-1 mt-2">
                          📍 {lib.city}, {lib.country} • 📅 {lib.founded} р.
                        </p>
                        {lib.description && (
                          <p className="text-muted mb-1" style={{ maxHeight: '60px', overflow: 'hidden' }}>
                            {lib.description}
                          </p>
                        )}
                        <small className="text-muted">
                          Додав: {lib.submitted_by || '—'} • {new Date(lib.created_at).toLocaleDateString('uk-UA')}
                        </small>
                      </div>
                      <div className="d-flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleAction(`/api/admin/approve-library/${lib.id}`, `approve-${lib.id}`)}
                          className="btn btn-success rounded-pill btn-sm px-3"
                          disabled={actionLoading === `approve-${lib.id}`}
                        >
                          {actionLoading === `approve-${lib.id}` ? <FaSpinner className="fa-spin" /> : <FaCheck className="me-1" />}
                          Підтвердити
                        </button>
                        <button
                          onClick={() => handleAction(`/api/admin/reject-library/${lib.id}`, `reject-${lib.id}`)}
                          className="btn btn-outline-danger rounded-pill btn-sm px-3"
                          disabled={actionLoading === `reject-${lib.id}`}
                        >
                          {actionLoading === `reject-${lib.id}` ? <FaSpinner className="fa-spin" /> : <FaTimes className="me-1" />}
                          Відхилити
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete requests */}
        <div className="mb-5">
          <h4 className="fw-bold mb-3">
            <FaExclamationTriangle className="me-2 text-danger" />
            Запити на видалення ({deleteRequests.length})
          </h4>

          {deleteRequests.length === 0 ? (
            <div className="card border-0 shadow-sm rounded-4 p-4 text-center text-muted">
              Немає запитів на видалення ✨
            </div>
          ) : (
            <div className="row g-3">
              {deleteRequests.map((req) => (
                <div key={req.id} className="col-12">
                  <div className="card border-0 shadow-sm rounded-4 p-4">
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                      <div className="flex-grow-1">
                        <h5 className="fw-bold mb-1">
                          <FaTrash className="me-2 text-danger" />
                          {req.library?.name || 'Невідома бібліотека'}
                        </h5>
                        <p className="text-muted mb-1">
                          📍 {req.library?.city}, {req.library?.country}
                        </p>
                        {req.reason && (
                          <p className="mb-1">
                            <strong>Причина:</strong> {req.reason}
                          </p>
                        )}
                        <small className="text-muted">
                          Від: {req.user_email || '—'} • {new Date(req.created_at).toLocaleDateString('uk-UA')}
                        </small>
                      </div>
                      <div className="d-flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            if (window.confirm(`Видалити бібліотеку "${req.library?.name}" назавжди?`)) {
                              handleAction(`/api/admin/approve-delete/${req.id}`, `del-approve-${req.id}`);
                            }
                          }}
                          className="btn btn-danger rounded-pill btn-sm px-3"
                          disabled={actionLoading === `del-approve-${req.id}`}
                        >
                          {actionLoading === `del-approve-${req.id}` ? <FaSpinner className="fa-spin" /> : <FaTrash className="me-1" />}
                          Видалити
                        </button>
                        <button
                          onClick={() => handleAction(`/api/admin/reject-delete/${req.id}`, `del-reject-${req.id}`)}
                          className="btn btn-outline-secondary rounded-pill btn-sm px-3"
                          disabled={actionLoading === `del-reject-${req.id}`}
                        >
                          {actionLoading === `del-reject-${req.id}` ? <FaSpinner className="fa-spin" /> : <FaTimes className="me-1" />}
                          Відхилити
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default AdminPanel;
