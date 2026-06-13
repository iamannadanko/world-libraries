import React, { useState, useEffect } from 'react';
import LibraryCard from './LibraryCard';
import { FaSpinner, FaExclamationTriangle, FaSearch, FaSortAmountDown, FaSortAmountUp, FaFilter } from 'react-icons/fa';

const SORT_OPTIONS = [
  { key: 'collection_desc', label: 'Колекція ↓', field: 'collection_size', dir: 'desc' },
  { key: 'collection_asc', label: 'Колекція ↑', field: 'collection_size', dir: 'asc' },
  { key: 'founded_asc', label: 'Найстаріші', field: 'founded', dir: 'asc' },
  { key: 'founded_desc', label: 'Наймолодші', field: 'founded', dir: 'desc' },
  { key: 'name_asc', label: 'А → Я', field: 'name', dir: 'asc' },
  { key: 'name_desc', label: 'Я → А', field: 'name', dir: 'desc' },
];

function LibraryList() {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState('collection_desc');
  const [countryFilter, setCountryFilter] = useState('');

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

  // Get unique countries for filter
  const countries = [...new Set(libraries.map((l) => l.country))].sort();

  // Filter
  let filtered = libraries.filter((lib) => {
    const matchesSearch =
      lib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lib.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lib.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = !countryFilter || lib.country === countryFilter;
    return matchesSearch && matchesCountry;
  });

  // Sort
  const sortOption = SORT_OPTIONS.find((o) => o.key === sortKey);
  if (sortOption) {
    filtered = [...filtered].sort((a, b) => {
      let valA = a[sortOption.field];
      let valB = b[sortOption.field];
      if (sortOption.field === 'name') {
        valA = valA || '';
        valB = valB || '';
        return sortOption.dir === 'asc' ? valA.localeCompare(valB, 'uk') : valB.localeCompare(valA, 'uk');
      }
      valA = valA || 0;
      valB = valB || 0;
      return sortOption.dir === 'asc' ? valA - valB : valB - valA;
    });
  }

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
        <div className="row justify-content-center mb-4">
          <div className="col-lg-6 text-center">
            <h2 className="fw-bold section-title mb-3">Колекція бібліотек</h2>
            <p className="text-muted">
              Найбільші бібліотеки світу
            </p>
          </div>
        </div>

        {/* Controls row: Search + Sort + Filter */}
        <div className="controls-row row g-3 justify-content-center mb-4">
          {/* Search */}
          <div className="col-md-4">
            <div className="input-group search-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <FaSearch className="text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Пошук..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Sort */}
          <div className="col-md-4 col-lg-3">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <FaSortAmountDown className="text-muted" />
              </span>
              <select
                className="form-select border-start-0"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Country filter */}
          <div className="col-md-4 col-lg-3">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <FaFilter className="text-muted" />
              </span>
              <select
                className="form-select border-start-0"
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
              >
                <option value="">Всі країни</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-muted text-center mb-4 small">
          Знайдено: {filtered.length} з {libraries.length}
        </p>

        {/* Grid of cards */}
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
