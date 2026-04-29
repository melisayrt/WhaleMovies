'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Movie } from '../../../types';
import MovieGrid from './MovieGrid';

const TMDB_API_KEY = '0b7f712ac44c8fc46b0b4a421108e7b3';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3/';

// Backend integration point: replace with internal search API
async function searchMovies(query: string): Promise<Movie[]> {
  try {
    const res = await fetch(
      `${TMDB_BASE_URL}search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}

interface SearchBarProps {
  query: string;
  onQueryChange: (q: string) => void;
  collectionIds: Set<number>;
  onAdd: (movie: Movie) => void;
  onRemove: (id: number) => void;
  onViewDetail: (movie: Movie) => void;
}

export default function SearchBar({
  query,
  onQueryChange,
  collectionIds,
  onAdd,
  onRemove,
  onViewDetail,
}: SearchBarProps) {
  const [results, setResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      const found = await searchMovies(query);
      setResults(found.slice(0, 12));
      setHasSearched(true);
      setIsSearching(false);
    }, 420);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div className="mb-8">
      {/* Search input */}
      <div className="relative max-w-2xl">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#484f58]">
          {isSearching ? (
            <Loader2 size={18} className="animate-spin text-[#2ea043]" />
          ) : (
            <Search size={18} />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by title, actor, or keyword…"
          className="w-full pl-12 pr-12 py-3.5 bg-[#161b22] border border-[#30363d] hover:border-[#484f58] focus:border-[#2ea043] focus:ring-2 focus:ring-[#2ea043]/20 rounded-2xl text-sm text-[#e6edf3] placeholder-[#484f58] outline-none transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => onQueryChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#484f58] hover:text-[#8b949e] transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search results */}
      {query && (
        <div className="mt-6">
          {isSearching && !hasSearched && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`search-skel-${i + 1}`} className="space-y-3">
                  <div className="skeleton w-full aspect-[2/3] rounded-xl" />
                  <div className="skeleton h-3 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              ))}
            </div>
          )}

          {hasSearched && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-center text-3xl mb-4">
                🔍
              </div>
              <h3 className="text-base font-semibold text-[#e6edf3] mb-2">
                No movies found for &quot;{query}&quot;
              </h3>
              <p className="text-sm text-[#484f58] max-w-xs">
                Try a different title, actor name, or keyword. Our catalog covers over 850,000 films.
              </p>
            </div>
          )}

          {hasSearched && results.length > 0 && (
            <>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-[#e6edf3]">
                  {results.length} results for &quot;{query}&quot;
                </h2>
              </div>
              <MovieGrid
                movies={results}
                collectionIds={collectionIds}
                onAdd={onAdd}
                onRemove={onRemove}
                onViewDetail={onViewDetail}
                context="search"
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}