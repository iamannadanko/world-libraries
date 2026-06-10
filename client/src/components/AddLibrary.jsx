import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSpinner } from 'react-icons/fa';

function AddLibrary() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const body = {
        ...form,
        founded: parseInt(form.founded) || null,
        collection_size: parseInt(form.collection_size) || null
      };
      const res = await fetch('/api/libraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Помилка при збереженні');
      navigate('/');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="fw-bold mb-4 text-center">Додати бібліотеку</h2>

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
                    {loading ? 'Збереження...' : 'Додати бібліотеку'}
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
