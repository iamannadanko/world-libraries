import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const { user, getToken, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Завантажити обране з API
  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch('/api/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.map((f) => f.library_id));
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, getToken]);

  // Перезавантажити обране при зміні користувача
  useEffect(() => {
    fetchFavorites();
  }, [user, fetchFavorites]);

  // Додати / прибрати з обраного
  const toggleFavorite = async (libraryId) => {
    if (!isAuthenticated) return false;

    const token = await getToken();
    const isCurrentlyFav = favorites.includes(libraryId);

    // Оптимістичне оновлення
    if (isCurrentlyFav) {
      setFavorites((prev) => prev.filter((id) => id !== libraryId));
    } else {
      setFavorites((prev) => [...prev, libraryId]);
    }

    try {
      const res = await fetch(`/api/favorites/${libraryId}`, {
        method: isCurrentlyFav ? 'DELETE' : 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed');
    } catch (err) {
      // Відкатити при помилці
      if (isCurrentlyFav) {
        setFavorites((prev) => [...prev, libraryId]);
      } else {
        setFavorites((prev) => prev.filter((id) => id !== libraryId));
      }
      console.error('Error toggling favorite:', err);
    }
  };

  const isFavorite = (id) => favorites.includes(id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
