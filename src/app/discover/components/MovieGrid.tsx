'use client';

import React from 'react';
import { Movie } from '../../../types';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  collectionIds: Set<number>;
  onAdd: (movie: Movie) => void;
  onRemove: (id: number) => void;
  onViewDetail: (movie: Movie) => void;
  context: string;
}

export default function MovieGrid({
  movies,
  collectionIds,
  onAdd,
  onRemove,
  onViewDetail,
  context,
}: MovieGridProps) {
  if (movies.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-5">
      {movies.map((movie, index) => (
        <div
          key={`${context}-movie-${movie.id}`}
          className="opacity-0 animate-fadeInUp"
          style={{ animationDelay: `${index * 0.04}s`, animationFillMode: 'forwards' }}
        >
          <MovieCard
            movie={movie}
            isInCollection={collectionIds.has(movie.id)}
            onAdd={onAdd}
            onRemove={onRemove}
            onViewDetail={onViewDetail}
          />
        </div>
      ))}
    </div>
  );
}