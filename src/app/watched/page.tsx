'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AppShell from '../discover/components/AppShell';
import MovieGrid from '../discover/components/MovieGrid';
import MovieDetailModal from '../discover/components/MovieDetailModal';
import { Movie, CollectionMovie } from '../../../types';
import { Loader2 } from 'lucide-react'; 

const TMDB_API_KEY = '0b7f712ac44c8fc46b0b4a421108e7b3'; // Discover'daki anahtarın aynısı
const TMDB_BASE_URL = 'https://api.themoviedb.org/3/';

export default function WatchedMoviesPage() {
  const [collection, setCollection] = useState<CollectionMovie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // 138 eşsiz film ve yüklenme durumu için stateler
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const collectionIds = new Set(collection.map((m) => m.id));

  // API'den birbirinden farklı 138 film çekme işlemi
  useEffect(() => {
    const fetchWatchedFilms = async () => {
      try {
        setLoading(true);
        let allMovies: Movie[] = [];
        
        // TMDB her sayfada 20 film verir. 138 film için ilk 7 sayfayı çekiyoruz (7x20=140 film)
        for (let i = 1; i <= 7; i++) {
          const res = await fetch(`${TMDB_BASE_URL}movie/popular?api_key=${TMDB_API_KEY}&page=${i}`);
          if (res.ok) {
            const data = await res.json();
            // Görüntü bozulmasın diye sadece posteri olan filmleri filtreliyoruz
            const validMovies = data.results.filter((m: Movie) => m.poster_path);
            allMovies = [...allMovies, ...validMovies];
          }
        }
        
        // Tam 138 tanesini kesip alıyoruz
        setWatchedMovies(allMovies.slice(0, 138));
      } catch (error) {
        console.error('Filmler çekilirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchedFilms();
  }, []);

  // Kütüphaneye ekleme/çıkarma ve modal fonksiyonları (Discover ile birebir aynı)
  const handleAdd = useCallback((movie: Movie) => {
    const mini: CollectionMovie = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      genre_ids: movie.genre_ids ?? [],
      release_date: movie.release_date ?? '',
    };
    setCollection((prev) => [...prev, mini]);
  }, []);

  const handleRemove = useCallback((id: number) => {
    setCollection((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const handleViewDetail = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  return (
    <AppShell collection={collection} collectionCount={collection.length}>
      <div className="flex-1 overflow-y-auto relative">
        <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 max-w-screen-2xl mx-auto">
          
          <div className="flex items-center gap-3 mb-8 animate-fadeInUp">
            <div className="w-1.5 h-8 bg-[#2ea043] rounded-full shadow-[0_0_10px_rgba(46,160,67,0.5)]" />
            <div>
              <h1 className="text-3xl font-bold text-[#e6edf3]">Watched Films</h1>
              <p className="text-[#8b949e] text-sm mt-1">
                You have watched {watchedMovies.length} films in total. What a cinematic journey!
              </p>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-2xl animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            {loading ? (
              // Veriler API'den gelirken ekranda şık bir yükleme animasyonu dönecek
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 size={40} className="animate-spin text-[#2ea043] mb-4" />
                <p className="text-[#8b949e]">Fetching your 138 unique movies from TMDB...</p>
              </div>
            ) : (
              // Veriler geldiğinde efsanevi MovieGrid devreye girecek
              <MovieGrid
                movies={watchedMovies}
                collectionIds={collectionIds}
                onAdd={handleAdd}
                onRemove={handleRemove}
                onViewDetail={handleViewDetail}
                context="watched"
              />
            )}
          </div>

        </div>
      </div>

      {/* Film detaylarını gösteren Modal Pop-up */}
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