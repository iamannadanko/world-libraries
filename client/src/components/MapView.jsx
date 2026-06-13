import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaSpinner, FaMapMarkerAlt, FaBookOpen } from 'react-icons/fa';

// Fix default marker icon (Leaflet + bundler issue)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom golden marker
const goldIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(0) + ' млн';
  if (num >= 1000) return (num / 1000).toFixed(0) + ' тис';
  return num?.toString() || '—';
}

function MapView() {
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

  const withCoords = libraries.filter((l) => l.latitude && l.longitude);

  return (
    <section className="py-5 map-section">
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="fw-bold section-title">
            <FaMapMarkerAlt className="text-accent me-2" />
            Карта бібліотек
          </h2>
          <p className="text-muted mt-3">Натисніть на маркер, щоб дізнатися більше</p>
        </div>

        <div className="map-wrapper rounded-4 overflow-hidden shadow">
          <MapContainer
            center={[30, 10]}
            zoom={2}
            minZoom={2}
            scrollWheelZoom={true}
            style={{ height: '550px', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {withCoords.map((lib) => (
              <Marker
                key={lib.id}
                position={[lib.latitude, lib.longitude]}
                icon={goldIcon}
              >
                <Popup>
                  <div className="map-popup">
                    <img
                      src={lib.image_url}
                      alt={lib.name}
                      className="map-popup-img"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=300';
                      }}
                    />
                    <h6 className="fw-bold mt-2 mb-1">{lib.name}</h6>
                    <p className="small text-muted mb-1">
                      📍 {lib.city}, {lib.country}
                    </p>
                    <p className="small text-muted mb-2">
                      <FaBookOpen className="me-1" />
                      {formatNumber(lib.collection_size)} одиниць
                    </p>
                    <Link
                      to={`/library/${lib.id}`}
                      className="btn btn-sm btn-accent rounded-pill w-100"
                    >
                      Детальніше →
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
}

export default MapView;
