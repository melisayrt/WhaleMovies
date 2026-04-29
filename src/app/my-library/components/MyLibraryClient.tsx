'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AppShell from '../../discover/components/AppShell';
import MovieGrid from '../../discover/components/MovieGrid';
import MovieDetailModal from '../../discover/components/MovieDetailModal';
import { Movie, CollectionMovie } from '../../../../types';
import { Bookmark, Search } from 'lucide-react';

export default function MyLibraryClient() {
  const [collection, setCollection] = useState<CollectionMovie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // Sayfa yüklendiğinde LocalStorage'dan verileri çek
  useEffect(() => {
    const savedLib = localStorage.getItem('whale_library');
    if (savedLib) {
      setCollection(JSON.parse(savedLib));
    }
  }, []);

  const collectionIds = new Set(collection.map((m) => m.id));

  // Kütüphaneden silme fonksiyonu (LocalStorage'ı da günceller)
  const handleRemove = useCallback((id: number) => {
    setCollection((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      localStorage.setItem('whale_library', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleAdd = useCallback((movie: Movie) => {
    // Kütüphane sayfasında zaten ekli filmler olduğu için burası genelde modal üzerinden çalışır
    setCollection((prev) => {
      const mini = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        genre_ids: movie.genre_ids ?? [],
        release_date: movie.release_date ?? '',
      };
      const updated = [...prev, mini];
      localStorage.setItem('whale_library', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AppShell collection={collection} collectionCount={collection.length}>
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 max-w-screen-2xl mx-auto">
          
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#e6edf3] mb-1">My Library</h1>
              <p className="text-[#8b949e] text-sm">You have {collection.length} movies saved for later.</p>
            </div>
          </div>

          {collection.length > 0 ? (
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-2xl animate-fadeIn">
              <MovieGrid
                movies={collection as any}
                collectionIds={collectionIds}
                onAdd={handleAdd}
                onRemove={handleRemove}
                onViewDetail={(m) => setSelectedMovie(m)}
                context="library"
              />
            </div>
          ) : (
            // Boş Kütüphane Görünümü - Pro Tasarım
            <div className="flex flex-col items-center justify-center py-32 text-center bg-[#161b22] border border-[#30363d] border-dashed rounded-3xl">
              <div className="w-20 h-20 bg-[#21262d] rounded-full flex items-center justify-center mb-6 text-[#484f58]">
                <Bookmark size={40} />
              </div>
              <h2 className="text-xl font-bold text-[#e6edf3] mb-2">Your library is empty</h2>
              <p className="text-[#8b949e] max-w-xs mb-8 text-sm leading-relaxed">
                You haven't saved any movies yet. Go to the Discover page to find something amazing!
              </p>
              <a 
                href="/discover" 
                className="flex items-center gap-2 bg-[#2ea043] hover:bg-[#3dd68c] text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95"
              >
                <Search size={18} />
                Explore Movies
              </a>
            </div>
          )}
        </div>
      </div>

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          isInCollection={collectionIds.has(selectedMovie.id)}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </AppShell>
  );
}