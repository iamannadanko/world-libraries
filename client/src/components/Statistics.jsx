import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { FaSpinner, FaChartBar, FaGlobeEurope, FaClock, FaBookOpen } from 'react-icons/fa';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, ArcElement,
  PointElement, LineElement, Title, Tooltip, Legend, Filler
);

/* ───── Color palettes ───── */
const COLORS = [
  '#c8a96e', '#5b8fb9', '#e07a5f', '#81b29a', '#f2cc8f',
  '#3d405b', '#e4c1f9', '#a8dadc', '#ff6b6b', '#48cae4'
];
const COLORS_ALPHA = COLORS.map(c => c + '99');

function Statistics() {
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/libraries')
      .then((r) => r.json())
      .then((data) => { setLibraries(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-5 text-center">
        <FaSpinner className="fa-spin fs-1 text-accent" />
      </section>
    );
  }

  const sorted = [...libraries].sort((a, b) => (b.collection_size || 0) - (a.collection_size || 0));
  const totalItems = libraries.reduce((s, l) => s + (l.collection_size || 0), 0);
  const avgYear = Math.round(libraries.reduce((s, l) => s + (l.founded || 0), 0) / libraries.length);
  const oldest = [...libraries].sort((a, b) => (a.founded || 9999) - (b.founded || 9999))[0];

  /* ── Bar chart: Collection sizes ── */
  const barData = {
    labels: sorted.map((l) => l.name.length > 20 ? l.name.substring(0, 18) + '…' : l.name),
    datasets: [{
      label: 'Млн одиниць',
      data: sorted.map((l) => Math.round((l.collection_size || 0) / 1000000)),
      backgroundColor: COLORS_ALPHA,
      borderColor: COLORS,
      borderWidth: 2,
      borderRadius: 8
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (v) => v + ' млн' },
        grid: { color: 'rgba(128,128,128,0.1)' }
      },
      x: {
        ticks: { maxRotation: 45, minRotation: 25, font: { size: 11 } },
        grid: { display: false }
      }
    }
  };

  /* ── Doughnut chart: By country ── */
  const countryCounts = {};
  libraries.forEach((l) => {
    countryCounts[l.country] = (countryCounts[l.country] || 0) + 1;
  });

  const doughnutData = {
    labels: Object.keys(countryCounts),
    datasets: [{
      data: Object.values(countryCounts),
      backgroundColor: COLORS.slice(0, Object.keys(countryCounts).length),
      borderWidth: 2,
      borderColor: '#fff',
      hoverOffset: 8
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { padding: 16, font: { size: 13 } } }
    }
  };

  /* ── Timeline chart: Founded years ── */
  const timeline = [...libraries].sort((a, b) => (a.founded || 0) - (b.founded || 0));

  const lineData = {
    labels: timeline.map((l) => l.founded?.toString() || '—'),
    datasets: [{
      label: 'Бібліотеки за роком заснування',
      data: timeline.map((l) => Math.round((l.collection_size || 0) / 1000000)),
      borderColor: '#c8a96e',
      backgroundColor: 'rgba(200, 169, 110, 0.15)',
      pointBackgroundColor: COLORS,
      pointRadius: 8,
      pointHoverRadius: 12,
      borderWidth: 3,
      tension: 0.3,
      fill: true
    }]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => {
            const idx = items[0].dataIndex;
            return `${timeline[idx].name} (${timeline[idx].founded})`;
          },
          label: (item) => `${item.raw} млн одиниць`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (v) => v + ' млн' },
        grid: { color: 'rgba(128,128,128,0.1)' }
      },
      x: { grid: { display: false } }
    }
  };

  return (
    <section className="py-5 statistics-section">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="fw-bold section-title">Статистика</h2>
          <p className="text-muted mt-3">Аналітика найбільших бібліотек світу в цифрах</p>
        </div>

        {/* ── Summary cards ── */}
        <div className="row g-3 mb-5">
          <div className="col-6 col-md-3">
            <div className="stat-summary-card text-center p-3 rounded-4 shadow-sm">
              <FaBookOpen className="fs-2 text-accent mb-2" />
              <div className="fs-4 fw-bold">{libraries.length}</div>
              <small className="text-muted">Бібліотек</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-summary-card text-center p-3 rounded-4 shadow-sm">
              <FaChartBar className="fs-2 text-accent mb-2" />
              <div className="fs-4 fw-bold">{(totalItems / 1000000000).toFixed(1)} млрд</div>
              <small className="text-muted">Одиниць разом</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-summary-card text-center p-3 rounded-4 shadow-sm">
              <FaGlobeEurope className="fs-2 text-accent mb-2" />
              <div className="fs-4 fw-bold">{Object.keys(countryCounts).length}</div>
              <small className="text-muted">Країн</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-summary-card text-center p-3 rounded-4 shadow-sm">
              <FaClock className="fs-2 text-accent mb-2" />
              <div className="fs-4 fw-bold">{oldest?.founded || '—'}</div>
              <small className="text-muted">Найстаріша</small>
            </div>
          </div>
        </div>

        {/* ── Bar chart ── */}
        <div className="chart-card rounded-4 shadow-sm p-4 mb-4">
          <h5 className="fw-bold mb-3">
            <FaChartBar className="text-accent me-2" />
            Розмір колекцій (млн одиниць)
          </h5>
          <div style={{ height: '350px' }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        <div className="row g-4">
          {/* ── Doughnut chart ── */}
          <div className="col-lg-5">
            <div className="chart-card rounded-4 shadow-sm p-4 h-100">
              <h5 className="fw-bold mb-3">
                <FaGlobeEurope className="text-accent me-2" />
                Розподіл за країнами
              </h5>
              <div style={{ height: '300px' }}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>

          {/* ── Timeline chart ── */}
          <div className="col-lg-7">
            <div className="chart-card rounded-4 shadow-sm p-4 h-100">
              <h5 className="fw-bold mb-3">
                <FaClock className="text-accent me-2" />
                Хронологія заснування
              </h5>
              <div style={{ height: '300px' }}>
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Statistics;
