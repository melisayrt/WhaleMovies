'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  X,
  Star,
  Clock,
  Calendar,
  Globe,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Plus,
  Minus,
  Loader2,
  Film,
  Tag,
} from 'lucide-react';
import { Movie, MovieDetails, GENRE_MAP } from '@/types';
import { toast } from 'sonner';
import AppImage from '@/components/ui/AppImage';

const TMDB_API_KEY = '0b7f712ac44c8fc46b0b4a421108e7b3';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3/';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';

function getPosterUrl(path: string | null | undefined): string {
  if (!path) return '/assets/images/no_image.png';
  return `${TMDB_IMAGE_BASE}${path}`;
}

function getBackdropUrl(path: string | null | undefined): string {
  if (!path) return '';
  return `${TMDB_BACKDROP_BASE}${path}`;
}

// Backend integration point: replace with internal movie details API
async function fetchMovieDetails(id: number): Promise<MovieDetails | null> {
  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      append_to_response: 'credits,reviews,videos,keywords,similar,release_dates',
    });
    const res = await fetch(`${TMDB_BASE_URL}movie/${id}?${params}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function getDirector(details: MovieDetails): string {
  const crew = details.credits?.crew ?? [];
  const director = crew.find((c: { job: string; name: string }) => c.job === 'Director');
  return director?.name ?? 'Unknown';
}

function getCertification(details: MovieDetails): string {
  const results = details.release_dates?.results ?? [];
  const us = results.find((r: { iso_3166_1: string; release_dates: any[] }) => r.iso_3166_1 === 'US');
  if (us) {
    for (const rd of us.release_dates) {
      if (rd.certification) return rd.certification;
    }
  }
  return 'NR';
}

function getRatingColor(rating: number): string {
  if (rating >= 8) return 'text-[#2ea043]';
  if (rating >= 7) return 'text-yellow-400';
  if (rating >= 5) return 'text-orange-400';
  return 'text-red-400';
}

interface MovieDetailModalProps {
  movie: Movie;
  isInCollection: boolean;
  onAdd: (movie: Movie) => void;
  onRemove: (id: number) => void;
  onClose: () => void;
}

export default function MovieDetailModal({
  movie,
  isInCollection,
  onAdd,
  onRemove,
  onClose,
}: MovieDetailModalProps) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'cast' | 'reviews' | 'similar'>('overview');

  const loadDetails = useCallback(async () => {
    setLoading(true);
    const data = await fetchMovieDetails(movie.id);
    setDetails(data);
    setLoading(false);
  }, [movie.id]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleCollectionToggle = async () => {
    setActionLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    if (isInCollection) {
      onRemove(movie.id);
      toast.success(`Removed "${movie.title}" from your library`);
    } else {
      onAdd(details ?? movie);
      toast.success(`Added "${movie.title}" to your library 🎬`);
    }
    setActionLoading(false);
  };

  const cert = details ? getCertification(details) : '';
  const director = details ? getDirector(details) : '';
  const cast = details?.credits?.cast?.slice(0, 8) ?? [];
  const reviews = details?.reviews?.results?.slice(0, 3) ?? [];
  const trailers = details?.videos?.results?.filter((v) => v.type === 'Trailer' && v.site === 'YouTube').slice(0, 1) ?? [];
  const keywords = details?.keywords?.keywords?.slice(0, 8) ?? [];
  const similar = details?.similar?.results?.slice(0, 6) ?? [];
  const genres = details?.genres ?? (movie.genre_ids ?? []).map((id) => ({ id, name: GENRE_MAP[id] ?? 'Unknown' }));
  const backdropUrl = getBackdropUrl(details?.backdrop_path ?? movie.backdrop_path);

  const langMap: Record<string, string> = {
    en: 'English', es: 'Spanish', fr: 'French', de: 'German',
    ja: 'Japanese', ko: 'Korean', zh: 'Chinese', hi: 'Hindi', it: 'Italian',
  };
  const lang = langMap[details?.original_language ?? ''] ?? (details?.original_language ?? '—').toUpperCase();

  const MODAL_TABS = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'cast' as const, label: `Cast${cast.length ? ` (${cast.length})` : ''}` },
    { id: 'reviews' as const, label: `Reviews${reviews.length ? ` (${reviews.length})` : ''}` },
    { id: 'similar' as const, label: 'Similar' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label={`Movie details: ${movie.title}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-4xl xl:max-w-5xl max-h-[95vh] sm:max-h-[90vh] bg-[#161b22] border border-[#30363d] rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-scaleIn flex flex-col">
        {/* Hero backdrop */}
        <div className="relative h-48 sm:h-56 flex-shrink-0 bg-[#0d1117] overflow-hidden">
          {backdropUrl ? (
            <AppImage
              src={backdropUrl}
              alt={`${movie.title} backdrop scene`}
              fill
              sizes="(max-width: 1024px) 100vw, 80vw"
              className="object-cover opacity-60"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#21262d] to-[#0d1117]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#161b22] via-[#161b22]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all duration-200 z-10"
            aria-label="Close movie details"
          >
            <X size={18} />
          </button>

          {/* Rating badge */}
          {(details?.vote_average ?? movie.vote_average) > 0 && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm border border-white/20 rounded-xl">
              <Star size={13} className={getRatingColor(details?.vote_average ?? movie.vote_average)} fill="currentColor" />
              <span className={`text-sm font-bold font-tabular ${getRatingColor(details?.vote_average ?? movie.vote_average)}`}>
                {(details?.vote_average ?? movie.vote_average).toFixed(1)}
              </span>
              {details?.vote_count && (
                <span className="text-xs text-[#8b949e]">({details.vote_count.toLocaleString()})</span>
              )}
            </div>
          )}
        </div>

        {/* Content area — scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 sm:px-8 pb-8">
            {/* Header row: poster + title + actions */}
            <div className="flex gap-5 -mt-16 mb-6 relative z-10">
              {/* Poster thumbnail */}
              <div className="flex-shrink-0 w-24 sm:w-32 aspect-[2/3] rounded-xl overflow-hidden border-2 border-[#30363d] shadow-2xl bg-[#0d1117]">
                <AppImage
                  src={getPosterUrl(details?.poster_path ?? movie.poster_path)}
                  alt={`${movie.title} poster`}
                  width={128}
                  height={192}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Title block */}
              <div className="flex-1 pt-16 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-[#e6edf3] leading-tight mb-1 line-clamp-2">
                  {details?.title ?? movie.title}
                </h2>
                {details?.tagline && (
                  <p className="text-sm text-[#484f58] italic mb-2 line-clamp-1">{details.tagline}</p>
                )}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#8b949e] mb-3">
                  {cert && (
                    <span className="px-2 py-0.5 border border-[#30363d] rounded text-xs font-semibold text-[#8b949e]">
                      {cert}
                    </span>
                  )}
                  {movie.release_date && (
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {movie.release_date.slice(0, 4)}
                    </span>
                  )}
                  {details?.runtime && (
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {details.runtime} min
                    </span>
                  )}
                  {lang && (
                    <span className="flex items-center gap-1">
                      <Globe size={11} />
                      {lang}
                    </span>
                  )}
                </div>

                {/* Genre badges */}
                <div className="flex flex-wrap gap-1.5">
                  {genres.slice(0, 4).map((g: { id: number; name: string }) => (
                    <span
                      key={`genre-${g.id}`}
                      className="text-[11px] font-medium px-2.5 py-1 bg-[#21262d] border border-[#30363d] rounded-full text-[#8b949e]"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleCollectionToggle}
                disabled={actionLoading}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-60 shadow-lg ${
                  isInCollection
                    ? 'bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-300 shadow-red-500/10'
                    : 'bg-[#2ea043] hover:bg-[#3dd68c] text-white shadow-[#2ea043]/20'
                }`}
              >
                {actionLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isInCollection ? (
                  <Minus size={16} />
                ) : (
                  <Plus size={16} />
                )}
                {isInCollection ? 'Remove from Library' : 'Add to Library'}
              </button>

              {trailers.length > 0 && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailers[0].key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#21262d] hover:bg-[#2d333b] border border-[#30363d] hover:border-[#484f58] text-[#e6edf3] transition-all duration-200 active:scale-95"
                >
                  <Film size={16} className="text-red-400" />
                  Watch Trailer
                  <ExternalLink size={12} className="text-[#484f58]" />
                </a>
              )}
            </div>

            {/* Quick stats row */}
            {details && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {details.budget && details.budget > 0 && (
                  <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[#484f58] text-xs mb-1">
                      <DollarSign size={11} />
                      Budget
                    </div>
                    <div className="text-sm font-semibold text-[#e6edf3] font-tabular">
                      ${(details.budget / 1_000_000).toFixed(0)}M
                    </div>
                  </div>
                )}
                {details.revenue && details.revenue > 0 && (
                  <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[#484f58] text-xs mb-1">
                      <TrendingUp size={11} />
                      Box Office
                    </div>
                    <div className="text-sm font-semibold text-[#2ea043] font-tabular">
                      ${(details.revenue / 1_000_000).toFixed(0)}M
                    </div>
                  </div>
                )}
                {details.status && (
                  <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[#484f58] text-xs mb-1">
                      <Film size={11} />
                      Status
                    </div>
                    <div className="text-sm font-semibold text-[#e6edf3]">{details.status}</div>
                  </div>
                )}
                {director && (
                  <div className="bg-[#0d1117] border border-[#30363d] rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[#484f58] text-xs mb-1">
                      <Film size={11} />
                      Director
                    </div>
                    <div className="text-sm font-semibold text-[#e6edf3] truncate">{director}</div>
                  </div>
                )}
              </div>
            )}

            {/* Content tabs */}
            <div className="flex gap-1 bg-[#0d1117] border border-[#30363d] rounded-xl p-1 mb-6 w-fit">
              {MODAL_TABS.map((tab) => (
                <button
                  key={`modal-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-[#2ea043] text-white'
                      : 'text-[#8b949e] hover:text-[#e6edf3]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Loading state */}
            {loading && (
              <div className="space-y-3">
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-5/6 rounded" />
                <div className="skeleton h-4 w-4/6 rounded" />
                <div className="skeleton h-4 w-full rounded mt-4" />
                <div className="skeleton h-4 w-3/4 rounded" />
              </div>
            )}

            {/* Overview tab */}
            {!loading && activeTab === 'overview' && (
              <div className="space-y-5 animate-fadeIn">
                {/* Synopsis */}
                <div>
                  <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-3">
                    Synopsis
                  </h3>
                  <p className="text-sm text-[#c9d1d9] leading-relaxed">
                    {details?.overview ?? movie.overview ?? 'No synopsis available for this film.'}
                  </p>
                </div>

                {/* Production companies */}
                {details?.production_companies && details.production_companies.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-2">
                      Production
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {details.production_companies.slice(0, 4).map((co: { id: number; name: string }) => (
                        <span
                          key={`prod-${co.id}`}
                          className="text-xs px-3 py-1.5 bg-[#21262d] border border-[#30363d] rounded-full text-[#8b949e]"
                        >
                          {co.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Keywords */}
                {keywords.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#8b949e] uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Tag size={13} />
                      Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {keywords.map((kw) => (
                        <span
                          key={`kw-${kw.id}`}
                          className="text-xs px-2.5 py-1 bg-[#0d1117] border border-[#30363d] rounded-full text-[#484f58] hover:text-[#8b949e] hover:border-[#484f58] transition-colors cursor-default"
                        >
                          {kw.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cast tab */}
            {!loading && activeTab === 'cast' && (
              <div className="animate-fadeIn">
                {cast.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-sm text-[#484f58]">No cast information available for this film.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {cast.map((actor) => (
                      <div
                        key={`cast-${actor.id}`}
                        className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden hover:border-[#484f58] transition-colors duration-200"
                      >
                        <div className="aspect-[3/4] relative bg-[#21262d]">
                          <AppImage
                            src={actor.profile_path ? `${TMDB_IMAGE_BASE}${actor.profile_path}` : '/assets/images/no_image.png'}
                            alt={`${actor.name} profile photo`}
                            fill
                            sizes="(max-width: 640px) 50vw, 25vw"
                            className="object-cover object-top"
                          />
                        </div>
                        <div className="p-2.5">
                          <div className="text-xs font-semibold text-[#e6edf3] line-clamp-1">{actor.name}</div>
                          <div className="text-[11px] text-[#484f58] line-clamp-1 mt-0.5">{actor.character}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews tab */}
            {!loading && activeTab === 'reviews' && (
              <div className="space-y-4 animate-fadeIn">
                {reviews.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-sm text-[#484f58]">No audience reviews available yet.</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={`review-${review.id}`}
                      className="bg-[#0d1117] border border-[#30363d] rounded-xl p-5 border-l-4 border-l-[#2ea043]"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2ea043] to-[#3dd68c] flex items-center justify-center text-xs font-bold text-white">
                            {review.author.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[#e6edf3]">{review.author}</div>
                            <div className="text-xs text-[#484f58]">
                              {review.created_at ? new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                            </div>
                          </div>
                        </div>
                        {review.author_details?.rating && (
                          <div className="flex items-center gap-1 px-2.5 py-1 bg-[#2ea043]/10 border border-[#2ea043]/30 rounded-lg">
                            <Star size={11} className="text-[#2ea043]" fill="currentColor" />
                            <span className="text-xs font-bold text-[#2ea043] font-tabular">
                              {review.author_details.rating}/10
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-[#8b949e] leading-relaxed line-clamp-3">
                        {review.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Similar tab */}
            {!loading && activeTab === 'similar' && (
              <div className="animate-fadeIn">
                {similar.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-sm text-[#484f58]">No similar movies found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {similar.map((sim) => (
                      <div
                        key={`similar-${sim.id}`}
                        className="group cursor-pointer"
                        onClick={() => {
                          onClose();
                          setTimeout(() => {
                            // Backend integration point: navigate to similar movie detail
                          }, 100);
                        }}
                      >
                        <div className="aspect-[2/3] relative rounded-xl overflow-hidden bg-[#0d1117] border border-[#30363d] group-hover:border-[#2ea043]/50 transition-colors duration-200">
                          <AppImage
                            src={getPosterUrl(sim.poster_path)}
                            alt={`${sim.title} movie poster`}
                            fill
                            sizes="(max-width: 640px) 33vw, 16vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {sim.vote_average > 0 && (
                            <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 bg-black/70 rounded-md">
                              <Star size={9} className="text-yellow-400" fill="currentColor" />
                              <span className="text-[10px] font-bold text-white font-tabular">
                                {sim.vote_average.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] text-[#8b949e] mt-1.5 line-clamp-2 leading-tight group-hover:text-[#e6edf3] transition-colors">
                          {sim.title}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}