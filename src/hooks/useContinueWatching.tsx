import { useState, useEffect, useCallback } from 'react';

interface WatchProgress {
  movieId: string;
  title: string;
  image: string;
  progress: number; // 0-100 percentage
  timestamp: number;
  duration: string;
}

const STORAGE_KEY = 'a2s-continue-watching';
const MAX_ITEMS = 20;

export function useContinueWatching() {
  const [items, setItems] = useState<WatchProgress[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const updateProgress = useCallback((movie: { id: string; title: string; image: string; duration?: string }, progress: number) => {
    setItems(prev => {
      const filtered = prev.filter(i => i.movieId !== movie.id);
      // Don't save if finished (>95%)
      if (progress > 95) return filtered;

      const updated: WatchProgress[] = [
        {
          movieId: movie.id,
          title: movie.title,
          image: movie.image || '',
          progress,
          timestamp: Date.now(),
          duration: movie.duration || '',
        },
        ...filtered,
      ].slice(0, MAX_ITEMS);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeItem = useCallback((movieId: string) => {
    setItems(prev => {
      const updated = prev.filter(i => i.movieId !== movieId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { items, updateProgress, removeItem };
}
