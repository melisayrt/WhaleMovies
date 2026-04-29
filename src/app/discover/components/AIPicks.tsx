'use client';

import { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import { Movie } from '../../../types';

interface AIPicksProps {
  collectionIds: Set<number>;
  onAdd: (movie: Movie) => void;
  onRemove: (id: number) => void;
  onViewDetail: (movie: Movie) => void;
}

export default function AIPicks({ collectionIds, onAdd, onRemove, onViewDetail }: AIPicksProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/ai-picks')
      .then(res => {
        if (!res.ok) throw new Error('API yanıt vermedi');
        return res.json();
      })
      .then(data => {
        setMovies(Array.isArray(data) ? data : []);
        setError(false);
      })
      .catch(err => {
        console.error('AI Picks hatası:', err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mt-10 text-center text-[#8b949e] py-4">
        🤖 Yapay zeka önerileri hazırlanıyor...
      </div>
    );
  }

  if (error || movies.length === 0) {
    return null; // Hata olursa hiçbir şey gösterme
  }

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🧠</span>
        <h2 className="text-2xl font-bold text-[#e6edf3]">Yapay Zeka Seçtikleri</h2>
        <span className="text-xs bg-purple-600/50 text-purple-100 px-2 py-0.5 rounded-full">
          AI Picks
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isInCollection={collectionIds.has(movie.id)}
            onAdd={onAdd}
            onRemove={onRemove}
            onViewDetail={onViewDetail}
          />
        ))}
      </div>
    </section>
  );
}