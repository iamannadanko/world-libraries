import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaSpinner, FaLock, FaSignInAlt, FaCheck, FaClock } from 'react-icons/fa';

function AddLibrary() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    name_en: '',
    country: '',
    city: '',
    founded: '',
    collection_size: '',
    description: '',
    image_url: '',
    website: '',
    fun_fact: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const token = await getToken();
      const body = {
        ...form,
        founded: parseInt(form.founded) || null,
        collection_size: parseInt(form.collection_size) || null
      };
      const res = await fetch('/api/libraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Помилка при збереженні');

      if (isAdmin) {
        // Адмін — одразу додається, переходимо на головну
        navigate('/');
      } else {
        // Звичайний користувач — показуємо повідомлення про модерацію
        setSubmitted(true);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Показати блокування, якщо не авторизований
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
                  Щоб додавати нові бібліотеки, потрібно увійти або зареєструватися
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

  // Успішно надіслано на модерацію
  if (submitted) {
    return (
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <div className="card border-0 shadow-sm rounded-4 p-5">
                <FaClock className="fs-1 text-warning mb-3" />
                <h3 className="fw-bold mb-3">Запит надіслано!</h3>
                <p className="text-muted mb-4">
                  Вашу бібліотеку надіслано на перевірку. Адміністратор розгляне її та підтвердить або відхилить.
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <Link to="/" className="btn btn-accent rounded-pill px-4">
                    На головну
                  </Link>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: '', name_en: '', country: '', city: '',
                        founded: '', collection_size: '', description: '',
                        image_url: '', website: '', fun_fact: ''
                      });
                    }}
                    className="btn btn-outline-secondary rounded-pill px-4"
                  >
                    <FaPlus className="me-1" /> Додати ще
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="fw-bold mb-4 text-center section-title">Додати бібліотеку</h2>

            {!isAdmin && (
              <div className="alert alert-info d-flex align-items-center gap-2 rounded-3 mb-4">
                <FaClock />
                <span>Після додавання бібліотека буде надіслана на перевірку адміністратору</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4 rounded-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Назва (укр) *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Назва (англ)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name_en"
                    value={form.name_en}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Країна *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Місто *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Рік заснування</label>
                  <input
                    type="number"
                    className="form-control"
                    name="founded"
                    value={form.founded}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Розмір колекції</label>
                  <input
                    type="number"
                    className="form-control"
                    name="collection_size"
                    value={form.collection_size}
                    onChange={handleChange}
                    placeholder="Кількість одиниць зберігання"
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Опис *</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="4"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">URL зображення</label>
                  <input
                    type="url"
                    className="form-control"
                    name="image_url"
                    value={form.image_url}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Веб-сайт</label>
                  <input
                    type="url"
                    className="form-control"
                    name="website"
                    value={form.website}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">Цікавий факт</label>
                  <input
                    type="text"
                    className="form-control"
                    name="fun_fact"
                    value={form.fun_fact}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 text-center mt-4">
                  <button
                    type="submit"
                    className="btn btn-accent btn-lg px-5 rounded-pill"
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="fa-spin me-2" />
                    ) : (
                      <FaPlus className="me-2" />
                    )}
                    {loading ? 'Збереження...' : (isAdmin ? 'Додати бібліотеку' : 'Надіслати на перевірку')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddLibrary;
