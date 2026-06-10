import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LibraryList from './components/LibraryList';
import LibraryDetail from './components/LibraryDetail';
import AddLibrary from './components/AddLibrary';
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
  return (
    <div className="app d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/library/:id" element={<LibraryDetail />} />
          <Route path="/add" element={<AddLibrary />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
