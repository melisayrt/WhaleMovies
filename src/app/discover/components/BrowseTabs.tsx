'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Star, Clapperboard } from 'lucide-react';
import { Movie } from '../../../types';
import MovieGrid from './MovieGrid';

const TMDB_API_KEY = '0b7f712ac44c8fc46b0b4a421108e7b3';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3/';

// Backend integration point: replace with internal movie catalog API
async function fetchMovies(endpoint: string, params: Record<string, string> = {}): Promise<Movie[]> {
  try {
    const searchParams = new URLSearchParams({ api_key: TMDB_API_KEY, ...params });
    const res = await fetch(`${TMDB_BASE_URL}${endpoint}?${searchParams}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}

type TabId = 'trending' | 'top-rated' | 'now-playing';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  endpoint: string;
  params?: Record<string, string>;
}

const TABS: Tab[] = [
  {
    id: 'trending',
    label: 'Trending This Week',
    icon: <TrendingUp size={15} />,
    endpoint: 'trending/movie/week',
  },
  {
    id: 'top-rated',
    label: 'Top Rated',
    icon: <Star size={15} />,
    endpoint: 'movie/top_rated',
    params: { page: '1' },
  },
  {
    id: 'now-playing',
    label: 'In Theaters Now',
    icon: <Clapperboard size={15} />,
    endpoint: 'movie/now_playing',
    params: { page: '1' },
  },
];

// Fallback mock data for when TMDB is unavailable
const MOCK_MOVIES: Movie[] = [
  { id: 1011985, title: 'Kung Fu Panda 4', poster_path: '/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg', vote_average: 6.8, vote_count: 2841, release_date: '2024-03-08', genre_ids: [16, 35, 28, 10751] },
  { id: 823464, title: 'Godzilla x Kong: The New Empire', poster_path: '/z1p34vh7dEOnLDmyCrlUVLuoDzd.jpg', vote_average: 7.1, vote_count: 3102, release_date: '2024-03-27', genre_ids: [28, 878, 12] },
  { id: 653346, title: 'Kingdom of the Planet of the Apes', poster_path: '/gKkl37BQuKTanygYQG1pyYgLVgf.jpg', vote_average: 7.3, vote_count: 1987, release_date: '2024-05-10', genre_ids: [878, 28, 12] },
  { id: 519182, title: 'Despicable Me 4', poster_path: '/3w84hCFJATpiCO5g8hpdWVPBbmq.jpg', vote_average: 7.1, vote_count: 3241, release_date: '2024-07-03', genre_ids: [16, 35, 10751] },
  { id: 573435, title: 'Bad Boys: Ride or Die', poster_path: '/nP6RliHjxsz4irTKsxe8uRr3Nrz.jpg', vote_average: 7.2, vote_count: 2109, release_date: '2024-06-07', genre_ids: [28, 35, 80] },
  { id: 1022789, title: 'Inside Out 2', poster_path: '/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg', vote_average: 7.8, vote_count: 5432, release_date: '2024-06-14', genre_ids: [16, 10751, 12] },
  { id: 786892, title: 'Furiosa: A Mad Max Saga', poster_path: '/iADOJ8Zymht2JPMoy3R7xceZprc.jpg', vote_average: 7.7, vote_count: 2876, release_date: '2024-05-24', genre_ids: [28, 12, 878] },
  { id: 748783, title: 'The Garfield Movie', poster_path: '/xYduFGuch84r0QITGOmMj2iNnkG.jpg', vote_average: 6.8, vote_count: 1654, release_date: '2024-05-24', genre_ids: [16, 35, 10751] },
  { id: 940551, title: 'Migration', poster_path: '/ldfCF9RhR40mppkzmftxapaHeTo.jpg', vote_average: 7.5, vote_count: 2341, release_date: '2023-12-22', genre_ids: [16, 35, 10751] },
  { id: 866398, title: 'The Beekeeper', poster_path: '/A7EByudX0eOzlkQ2FIbogzyazm2.jpg', vote_average: 7.4, vote_count: 3012, release_date: '2024-01-12', genre_ids: [28, 53] },
  { id: 848538, title: 'Argylle', poster_path: '/95gMDCQTPlgQrIXnvvqZtFnwpMD.jpg', vote_average: 6.3, vote_count: 2109, release_date: '2024-02-02', genre_ids: [28, 35, 9648] },
  { id: 1096197, title: "Anyone But You", poster_path: '/lurEK87kukWNaHd0zYnsi3yzJrs.jpg', vote_average: 7.0, vote_count: 2567, release_date: '2023-12-22', genre_ids: [35, 10749] },
];

interface BrowseTabsProps {
  collectionIds: Set<number>;
  onAdd: (movie: Movie) => void;
  onRemove: (id: number) => void;
  onViewDetail: (movie: Movie) => void;
}

export default function BrowseTabs({ collectionIds, onAdd, onRemove, onViewDetail }: BrowseTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('trending');
  const [movies, setMovies] = useState<Record<TabId, Movie[]>>({
    trending: [],
    'top-rated': [],
    'now-playing': [],
  });
  const [loading, setLoading] = useState<Record<TabId, boolean>>({
    trending: true,
    'top-rated': false,
    'now-playing': false,
  });
  const [loaded, setLoaded] = useState<Set<TabId>>(new Set());

  const loadTab = async (tabId: TabId) => {
    if (loaded.has(tabId)) return;
    const tab = TABS.find((t) => t.id === tabId);
    if (!tab) return;

    setLoading((prev) => ({ ...prev, [tabId]: true }));
    const results = await fetchMovies(tab.endpoint, tab.params);
    const finalMovies = results.length > 0 ? results.slice(0, 12) : MOCK_MOVIES.slice(0, 12);
    setMovies((prev) => ({ ...prev, [tabId]: finalMovies }));
    setLoading((prev) => ({ ...prev, [tabId]: false }));
    setLoaded((prev) => new Set(prev).add(tabId));
  };

  useEffect(() => {
    loadTab('trending');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    loadTab(tabId);
  };

  const activeTabData = TABS.find((t) => t.id === activeTab);

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-[#161b22] border border-[#30363d] rounded-2xl p-1.5 mb-7 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-[#2ea043] text-white shadow-md shadow-[#2ea043]/20'
                : 'text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d]'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-6 bg-[#2ea043] rounded-full" />
          <h2 className="text-lg font-semibold text-[#e6edf3]">
            {activeTabData?.label}
          </h2>
          {!loading[activeTab] && movies[activeTab].length > 0 && (
            <span className="text-xs text-[#484f58] bg-[#21262d] border border-[#30363d] px-2 py-0.5 rounded-full">
              {movies[activeTab].length} films
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      {loading[activeTab] ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`browse-skel-${i + 1}`} className="space-y-3 opacity-0 animate-fadeInUp" style={{ animationDelay: `${i * 0.04}s`, animationFillMode: 'forwards' }}>
              <div className="skeleton w-full aspect-[2/3] rounded-xl" />
              <div className="skeleton h-3 w-3/4 rounded" />
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="skeleton h-8 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : movies[activeTab].length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-center text-3xl mb-4">
            🎬
          </div>
          <h3 className="text-base font-semibold text-[#e6edf3] mb-2">
            No movies loaded
          </h3>
          <p className="text-sm text-[#484f58]">
            Could not connect to the movie catalog. Check your connection and try again.
          </p>
          <button
            onClick={() => {
              setLoaded((prev) => {
                const next = new Set(prev);
                next.delete(activeTab);
                return next;
              });
              loadTab(activeTab);
            }}
            className="mt-4 px-4 py-2 bg-[#2ea043] hover:bg-[#3dd68c] text-white text-sm font-medium rounded-xl transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      ) : (
        <MovieGrid
          movies={movies[activeTab]}
          collectionIds={collectionIds}
          onAdd={onAdd}
          onRemove={onRemove}
          onViewDetail={onViewDetail}
          context={activeTab}
        />
      )}
    </div>
  );
}