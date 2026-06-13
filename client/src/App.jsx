import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LibraryList from './components/LibraryList';
import LibraryDetail from './components/LibraryDetail';
import AddLibrary from './components/AddLibrary';
import Statistics from './components/Statistics';
import MapView from './components/MapView';
import Favorites from './components/Favorites';
import Footer from './components/Footer';

function HomePage() {
  return (
    <>
      <Hero />
      <LibraryList />
    </>
  );
}

function App() {
  useEffect(() => {
    AOS.init({
      once: true,
      easing: 'ease-out-cubic'
    });
  }, []);

  return (
    <ThemeProvider>
      <FavoritesProvider>
        <div className="app d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/library/:id" element={<LibraryDetail />} />
              <Route path="/add" element={<AddLibrary />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
