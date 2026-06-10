import React from 'react';
import { FaSearch } from 'react-icons/fa';

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      <div className="container position-relative z-1">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center text-white">
            <h1 className="hero-title display-3 fw-bold mb-3">
              Найбільші бібліотеки <span className="text-accent">Світу</span>
            </h1>
            <p className="hero-subtitle lead mb-4">
              Відкрийте для себе найвеличніші сховища знань людства — від
              стародавніх архівів до сучасних цифрових колекцій
            </p>
            <a href="#libraries" className="btn btn-accent btn-lg px-5 py-3 rounded-pill shadow">
              <FaSearch className="me-2" />
              Дослідити
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
