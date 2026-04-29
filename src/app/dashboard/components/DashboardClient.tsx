'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AppShell from '../../discover/components/AppShell';
import MovieGrid from '../../discover/components/MovieGrid';
import MovieDetailModal from '../../discover/components/MovieDetailModal';
import { Film, Star, Clock, Trophy, PlayCircle } from 'lucide-react';
import { Movie, CollectionMovie } from '../../../../types';
import { toast } from 'sonner';

// Kütüphane tamamen boşken ekran çirkin durmasın diye gösterilecek öneriler
const SUGGESTED_MOVIES: Movie[] = [
  { id: 157336, title: 'Interstellar', poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', vote_average: 8.4, vote_count: 32412, release_date: '2014-11-07', genre_ids: [12, 18, 878] },
  { id: 550, title: 'Fight Club', poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', vote_average: 8.4, vote_count: 26000, release_date: '1999-10-15', genre_ids: [18, 53] },
  { id: 1022789, title: 'Inside Out 2', poster_path: '/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg', vote_average: 7.8, vote_count: 5432, release_date: '2024-06-14', genre_ids: [16, 10751, 12] },
  { id: 653346, title: 'Kingdom of the Planet of the Apes', poster_path: '/gKkl37BQuKTanygYQG1pyYgLVgf.jpg', vote_average: 7.3, vote_count: 1987, release_date: '2024-05-10', genre_ids: [878, 28, 12] }
];

export default function DashboardClient() {
  const [collection, setCollection] = useState<CollectionMovie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const savedLib = localStorage.getItem('whale_library');
    if (savedLib) {
      setCollection(JSON.parse(savedLib));
    }
  }, []);

  const collectionIds = new Set(collection.map((m) => m.id));

  const handleAdd = useCallback((movie: Movie) => {
    const mini: CollectionMovie = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      genre_ids: movie.genre_ids ?? [],
      release_date: movie.release_date ?? '',
    };
    
    setCollection((prev) => {
      const updated = [...prev, mini];
      localStorage.setItem('whale_library', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleRemove = useCallback((id: number) => {
    setCollection((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      localStorage.setItem('whale_library', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleViewDetail = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  const handleContinueWatching = () => {
    const toastId = toast.loading('Resuming Interstellar...');
    setTimeout(() => {
      toast.dismiss(toastId);
      setSelectedMovie(SUGGESTED_MOVIES[0]); 
    }, 500);
  };

  const StatCard = ({ title, value, icon: Icon, color, bg, href, onClick }: any) => {
    const content = (
      <div 
        onClick={onClick}
        className={`bg-[#161b22] border border-[#30363d] p-6 rounded-2xl transition-all duration-300 shadow-lg relative overflow-hidden group ${href || onClick ? 'cursor-pointer hover:border-[#484f58] hover:-translate-y-1' : ''}`}
      >
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-[0.02] rounded-full group-hover:scale-150 transition-transform duration-500" />
        <div className="flex items-center justify-between mb-4 relative z-10">
          <span className="text-[#8b949e] text-xs font-bold tracking-wider uppercase">{title}</span>
          <div className={`p-2.5 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={20} />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-[#e6edf3] relative z-10">{value}</div>
      </div>
    );

    if (href) {
      return <Link href={href} className="block">{content}</Link>;
    }
    return content;
  };

  // İŞTE SİHİRLİ KISIM BURASI: Kütüphanende film varsa son 6 tanesini ters çevirip (en yeniler başta) gösterir.
  const hasCollection = collection.length > 0;
  const displayedMovies = hasCollection ? [...collection].reverse().slice(0, 6) : SUGGESTED_MOVIES;
  const sectionTitle = hasCollection ? "Recently Added to Your Library" : "Suggested Films to Start";

  return (
    <AppShell collection={collection} collectionCount={collection.length}>
      <div className="flex-1 overflow-y-auto relative">
        <div className="px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 max-w-screen-2xl mx-auto">

          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fadeInUp">
            <div>
              <h1 className="text-3xl font-bold text-[#e6edf3] mb-2 tracking-tight">Welcome, Melisa! 🐋</h1>
              <p className="text-[#8b949e] text-base">Here is your cinematic overview and recently added films.</p>
            </div>
            <button 
              onClick={handleContinueWatching}
              className="flex items-center justify-center gap-2 bg-[#2ea043] hover:bg-[#3dd68c] text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-[#2ea043]/20 active:scale-95"
            >
              <PlayCircle size={18} />
              Continue Watching
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <StatCard title="Watched Films" value="138" icon={Film} color="text-blue-400" bg="bg-blue-400/10" href="/watched" />
            <StatCard title="Library" value={collection.length.toString()} icon={Star} color="text-yellow-400" bg="bg-yellow-400/10" href="/my-library" />
            <StatCard title="Total Hours" value="342" icon={Clock} color="text-purple-400" bg="bg-purple-400/10" />
            <StatCard title="Favorite Genre" value="Sci-Fi" icon={Trophy} color="text-[#2ea043]" bg="bg-[#2ea043]/10" />
          </div>

          <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-[#2ea043] rounded-full shadow-[0_0_10px_rgba(46,160,67,0.5)]" />
              <h2 className="text-xl font-bold text-[#e6edf3]">{sectionTitle}</h2>
            </div>

            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-2xl">
              <MovieGrid
                movies={displayedMovies as any}
                collectionIds={collectionIds}
                onAdd={handleAdd}
                onRemove={handleRemove}
                onViewDetail={handleViewDetail}
                context="dashboard"
              />
            </div>
          </div>

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