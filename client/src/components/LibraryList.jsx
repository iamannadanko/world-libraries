import React, { useState, useEffect } from 'react';
import LibraryCard from './LibraryCard';
import { FaSpinner, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

function LibraryList() {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLibraries();
  }, []);

  const fetchLibraries = async () => {
    try {
      const res = await fetch('/api/libraries');
      if (!res.ok) throw new Error('Не вдалося завантажити дані');
      const data = await res.json();
      setLibraries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = libraries.filter(lib =>
    lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lib.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lib.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <section className="py-5 text-center">
        <FaSpinner className="spinner-icon fa-spin fs-1 text-accent" />
        <p className="mt-3 text-muted">Завантаження бібліотек...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-5">
        <div className="container">
          <div className="alert alert-warning d-flex align-items-center gap-2" role="alert">
            <FaExclamationTriangle />
            <span>{error}. Перевірте підключення до Supabase.</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="libraries" className="py-5 bg-light-custom">
      <div className="container">
        {/* Section header */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-6 text-center">
            <h2 className="fw-bold section-title mb-3">Колекція бібліотек</h2>
            <p className="text-muted">
              Найбільші бібліотеки світу
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="row justify-content-center mb-4">
          <div className="col-md-6 col-lg-4">
            <div className="input-group search-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Пошук за назвою, містом, країною..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Grid of cards — using CSS Grid + Flexbox */}
        <div className="row g-4 library-grid">
          {filtered.length > 0 ? (
            filtered.map((lib, index) => (
              <LibraryCard key={lib.id} library={lib} index={index} />
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <p className="text-muted fs-5">Нічого не знайдено 🔍</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default LibraryList;
