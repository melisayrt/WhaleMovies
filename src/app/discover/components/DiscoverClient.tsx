'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AppShell from './AppShell';
import SearchBar from './SearchBar';
import BrowseTabs from './BrowseTabs';
import MovieDetailModal from './MovieDetailModal';
import AIPicks from './AIPicks';
import { Movie, CollectionMovie } from '../../../types';

const INITIAL_COLLECTION: CollectionMovie[] = [
  { id: 157336, title: 'Interstellar', poster_path: '/gEU2QniL6E8AHtMY4kOD08WDT2q.jpg', vote_average: 8.4, genre_ids: [12, 18, 878], release_date: '2014-11-07' },
  { id: 299534, title: 'Avengers: Endgame', poster_path: '/or06FN3Dka5tukK1e9sl16pB3iy.jpg', vote_average: 8.3, genre_ids: [28, 12, 878], release_date: '2019-04-26' },
  { id: 238, title: 'The Godfather', poster_path: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', vote_average: 8.7, genre_ids: [18, 80], release_date: '1972-03-24' },
  { id: 550, title: 'Fight Club', poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', vote_average: 8.4, genre_ids: [18, 53], release_date: '1999-10-15' },
];

export default function DiscoverClient() {
  const [collection, setCollection] = useState<CollectionMovie[]>(INITIAL_COLLECTION);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('whale_library');
    if (saved) setCollection(JSON.parse(saved));
    else localStorage.setItem('whale_library', JSON.stringify(INITIAL_COLLECTION));
  }, []);

  const collectionIds = new Set(collection.map(m => m.id));

  const handleAdd = useCallback((movie: Movie) => {
    const mini: CollectionMovie = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      genre_ids: movie.genre_ids ?? [],
      release_date: movie.release_date ?? '',
    };
    setCollection(prev => {
      const updated = [...prev, mini];
      localStorage.setItem('whale_library', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleRemove = useCallback((id: number) => {
    setCollection(prev => {
      const updated = prev.filter(m => m.id !== id);
      localStorage.setItem('whale_library', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleViewDetail = useCallback((movie: Movie) => setSelectedMovie(movie), []);
  const handleCloseDetail = useCallback(() => setSelectedMovie(null), []);

  return (
    <AppShell collection={collection} collectionCount={collection.length}>
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 max-w-screen-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#e6edf3] mb-1">Discover</h1>
            <p className="text-sm text-[#8b949e]">Explore trending films, top-rated classics, and what&apos;s in theaters now</p>
          </div>

          <SearchBar
            query={searchQuery}
            onQueryChange={setSearchQuery}
            collectionIds={collectionIds}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onViewDetail={handleViewDetail}
          />

          {!searchQuery && (
            <>
              <BrowseTabs
                collectionIds={collectionIds}
                onAdd={handleAdd}
                onRemove={handleRemove}
                onViewDetail={handleViewDetail}
              />
              <AIPicks
                collectionIds={collectionIds}
                onAdd={handleAdd}
                onRemove={handleRemove}
                onViewDetail={handleViewDetail}
              />
            </>
          )}
        </div>
      </div>

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          isInCollection={collectionIds.has(selectedMovie.id)}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onClose={handleCloseDetail}
        />
      )}
    </AppShell>
  );
}