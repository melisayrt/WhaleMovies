'use client';

import React, { useState, useEffect, useCallback } from 'react';
import AppShell from '../discover/components/AppShell';
import MovieCard from '../discover/components/MovieCard';
import MovieDetailModal from '../discover/components/MovieDetailModal';
import { BrainCircuit, Sparkles, Send, Loader2 } from 'lucide-react';
import { Movie, CollectionMovie } from '@/types';
import { toast } from 'sonner';

export default function AIBrainPage() {
  const [mood, setMood] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [collection, setCollection] = useState<CollectionMovie[]>([]);

  useEffect(() => {
    const savedLib = localStorage.getItem('whale_library');
    if (savedLib) setCollection(JSON.parse(savedLib));
  }, []);

  const collectionIds = new Set(collection.map((m) => m.id));

  const handleAnalyze = async () => {
    if (!mood.trim()) return toast.error("Nasıl hissettiğini yazmalısın!");
    
    setLoading(true);
    setResults([]); // Önceki sonuçları temizle ki eskiler kalmasın
    
    try {
      // BURASI KRİTİK: Sadece ve sadece Python API'sine gidiyor
      const res = await fetch('http://192.168.1.184:8000/analyze-mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: mood }),
      });

      if (!res.ok) throw new Error("API Bağlantı Hatası");

      const data = await res.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setResults(data); // API'den ne gelirse o!
        toast.success("AI zihnini okudu! ✨");
      } else {
        toast.error("API'den sonuç dönmedi, lütfen mood'u değiştir.");
      }

    } catch (err) {
      console.error("API Error:", err);
      toast.error("Backend'e ulaşılamıyor. Terminalin açık olduğundan ve IP adresinin (192.168.1.184) doğruluğundan emin ol!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell collection={collection} collectionCount={collection.length}>
      <div className="flex-1 overflow-y-auto bg-[#0d1117] p-4 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12">
          
          <div className="text-center space-y-4 pt-4">
            <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl bg-[#2ea043]/10 border border-[#2ea043]/20 text-[#2ea043] mb-2 shadow-[0_0_30px_rgba(46,160,67,0.1)]">
              <BrainCircuit size={loading ? 32 : 40} className={loading ? "animate-spin" : ""} />
            </div>
            <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase italic">AI BRAIN</h1>
            <p className="text-[#8b949e] text-sm lg:text-lg max-w-lg mx-auto italic leading-relaxed px-4">
              "Tell me your mood, I'll scan the cinema universe."
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto group px-2">
            <textarea
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              placeholder="Ex: I want a dark, mind-bending thriller..."
              className="w-full h-32 lg:h-44 bg-[#161b22] border-2 border-[#30363d] rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-10 text-white placeholder-[#484f58] outline-none focus:border-[#2ea043] transition-all resize-none text-base lg:text-xl shadow-2xl group-hover:border-[#484f58]"
            />
            <button 
              onClick={handleAnalyze}
              disabled={loading}
              className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 bg-[#2ea043] hover:bg-[#3dd68c] text-white p-3 lg:p-5 rounded-xl lg:rounded-2xl shadow-xl transition-all active:scale-90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
            </button>
          </div>

          {results.length > 0 && (
            <div className="animate-fadeInUp pt-6 lg:pt-10 border-t border-[#30363d]">
              <div className="flex items-center gap-3 mb-6 lg:mb-10">
                <div className="w-1.5 h-6 lg:h-8 bg-[#2ea043] rounded-full shadow-[0_0_15px_rgba(46,160,67,0.5)]" />
                <h2 className="text-lg lg:text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
                  Neural Matches <Sparkles className="text-yellow-500" size={18} />
                </h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 pb-10">
                {results.map((movie) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    isInCollection={collectionIds.has(movie.id)} 
                    onAdd={(m) => {
                      const updated = [...collection, m as any];
                      setCollection(updated);
                      localStorage.setItem('whale_library', JSON.stringify(updated));
                    }} 
                    onRemove={(id) => {
                      const updated = collection.filter(m => m.id !== id);
                      setCollection(updated);
                      localStorage.setItem('whale_library', JSON.stringify(updated));
                    }} 
                    onViewDetail={setSelectedMovie}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}