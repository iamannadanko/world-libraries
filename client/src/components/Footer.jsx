import React from 'react';
import { FaHeart, FaGithub } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer-section py-4 mt-auto">
      <div className="container">
        <div className="row align-items-center gy-3">
          <div className="col-md-6 text-center text-md-start">
            <span className="text-muted">
              © {new Date().getFullYear()} Найбільші бібліотеки світу
            </span>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <span className="text-muted">
              Зроблено з <FaHeart className="text-danger mx-1" /> React + Node.js + Supabase
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
