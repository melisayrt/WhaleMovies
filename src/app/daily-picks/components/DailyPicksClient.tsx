'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AppShell from '../../discover/components/AppShell';
import MovieDetailModal from '../../discover/components/MovieDetailModal';
import { Movie, CollectionMovie } from '@/types';
import { Star, RefreshCw, BrainCircuit, Play } from 'lucide-react';
import { toast } from 'sonner';

export default function DailyPicksClient() {
  const [collection, setCollection] = useState<CollectionMovie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [picks, setPicks] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // POSTER SORUNUNU ÇÖZEN GELİŞMİŞ FONKSİYON
  const getFullPosterUrl = (movie: any) => {
    // Hem backdrop hem poster path'i kontrol et
    const path = movie.backdrop_path || movie.poster_path;
    
    if (!path || path === "" || path === "null") {
      // Eğer ikisi de yoksa şık bir yer tutucu görsel dön
      return "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000";
    }
    // TMDB URL'ini başına ekle
    return `https://image.tmdb.org/t/p/w780${path}`;
  };

  const getBackupPicks = () => [
    { id: 101, title: "Interstellar", vote_average: 8.7, backdrop_path: "/gEU2QniE6EzuVksvYp7vfx7pCua.jpg" },
    { id: 102, title: "Inception", vote_average: 8.8, backdrop_path: "/8Z99v_6ndG0s1bsA987L9mGOb9L.jpg" },
    { id: 103, title: "The Dark Knight", vote_average: 9.0, backdrop_path: "/nMK96oIuSfc5u06CHvS99V9mZPT.jpg" },
    { id: 104, title: "Arrival", vote_average: 7.5, backdrop_path: "/668fE7SIn977997o8vOQpCHXpUu.jpg" }
  ];

  const fetchDailyPicks = useCallback(async (currentLib: CollectionMovie[]) => {
    setLoading(true);
    try {
      const res = await fetch('http://10.0.2.2:8000/daily-picks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ library: currentLib }),
      });
      
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPicks(data);
      } else {
        setPicks(getBackupPicks());
      }
    } catch (error) {
      console.log("Bağlantı kurulamadı, yedek veriler yükleniyor...");
      setPicks(getBackupPicks());
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  useEffect(() => {
    const savedLib = localStorage.getItem('whale_library');
    const parsedLib = savedLib ? JSON.parse(savedLib) : [];
    setCollection(parsedLib);
    fetchDailyPicks(parsedLib);
  }, [fetchDailyPicks]);

  const collectionIds = new Set(collection.map((m) => m.id));

  return (
    <AppShell collection={collection} collectionCount={collection.length}>
      <div className="flex-1 overflow-y-auto bg-[#0d1117] p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 lg:mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-white/5 pb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#2ea043] font-mono text-[10px] lg:text-xs mb-2">
                <BrainCircuit size={16} className={loading ? "animate-spin" : ""} />
                AI-POWERED RECOMMENDATIONS
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-white italic uppercase tracking-tighter">
                Daily <span className="text-[#2ea043]">AI</span> Picks
              </h1>
            </div>
            <button 
              onClick={() => fetchDailyPicks(collection)}
              className="w-full lg:w-auto bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#2ea043] hover:text-white transition-all text-sm"
            >
              <RefreshCw size={18} /> REGENERATE
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {loading ? (
              [1,2,3,4].map(i => <div key={i} className="h-64 lg:h-80 bg-white/5 rounded-[2rem] lg:rounded-[2.5rem] animate-pulse" />)
            ) : (
              picks.map((movie) => (
                <div key={movie.id} className="group bg-[#161b22] border border-white/5 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden hover:border-[#2ea043]/50 transition-all duration-500">
                  <div className="aspect-video relative overflow-hidden cursor-pointer" onClick={() => setSelectedMovie(movie as Movie)}>
                    <img 
                      src={getFullPosterUrl(movie)} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      alt={movie.title}
                      onError={(e) => {
                        // Resim yüklenemezse placeholder'a çek
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-yellow-500 text-xs font-bold border border-white/10">
                      <Star size={12} fill="currentColor" /> {movie.vote_average?.toFixed(1) || "8.5"}
                    </div>
                  </div>
                  <div className="p-6 lg:p-8">
                    <h2 className="text-xl lg:text-2xl font-bold text-white mb-4 line-clamp-1">{movie.title}</h2>
                    <button 
                      onClick={() => setSelectedMovie(movie as Movie)}
                      className="w-full py-3 lg:py-4 bg-white/5 hover:bg-white hover:text-black rounded-xl lg:rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-sm lg:text-base"
                    >
                      <Play size={16} fill="currentColor" /> AI ANALYSIS & DETAILS
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          isInCollection={collectionIds.has(selectedMovie.id)}
          onAdd={() => {}} 
          onRemove={() => {}}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </AppShell>
  );
}