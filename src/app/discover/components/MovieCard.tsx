'use client';

import React, { useState } from 'react';
import { Movie, GENRE_MAP } from '../../../types';
import { toast } from 'sonner';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/Icon';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Poster URL'sini hazırla (boşsa fallback AppImage halleder)
function getPosterUrl(path: string | null | undefined): string {
  if (!path) return '/assets/images/no_image.png';
  return `${TMDB_IMAGE_BASE}${path}`;
}

function getRatingColor(rating: number): string {
  if (rating >= 8) return 'text-[#2ea043] bg-[#2ea043]/10 border-[#2ea043]/30';
  if (rating >= 7) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
  if (rating >= 5) return 'text-orange-400 bg-orange-400/10 border-orange-400/30';
  return 'text-red-400 bg-red-400/10 border-red-400/30';
}

interface MovieCardProps {
  movie: Movie;
  isInCollection: boolean;
  onAdd: (movie: Movie) => void;
  onRemove: (id: number) => void;
  onViewDetail: (movie: Movie) => void;
}

export default function MovieCard({
  movie,
  isInCollection,
  onAdd,
  onRemove,
  onViewDetail,
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—';
  const rating = movie.vote_average ?? 0;
  const ratingColor = getRatingColor(rating);
  const primaryGenre = movie.genre_ids?.[0];
  const genreLabel = primaryGenre ? GENRE_MAP[primaryGenre] : null;

  const posterUrl = getPosterUrl(movie.poster_path);

  const handleCollectionToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActionLoading(true);
    await new Promise((r) => setTimeout(r, 200));
    if (isInCollection) {
      onRemove(movie.id);
      toast.success(`Removed "${movie.title}" from your library`, { duration: 2500 });
    } else {
      onAdd(movie);
      toast.success(`Added "${movie.title}" to your library 🎬`, { duration: 2500 });
    }
    setIsActionLoading(false);
  };

  const handleViewDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetail(movie);
  };

  return (
    <div
      className="group relative flex flex-col bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden cursor-pointer transition-all duration-250 hover:border-[#2ea043]/50 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetail(movie)}
    >
      {/* Poster Alanı - AppImage fill modunda */}
      <div className="relative aspect-[2/3] overflow-hidden bg-[#0d1117]">
        <AppImage
          src={posterUrl}
          alt={`${movie.title} movie poster`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
          fallbackSrc="/assets/images/no_image.png"
        />

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-250 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Rating Badge - solid yıldız ikonu */}
        <div className={`absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-bold font-tabular ${ratingColor} backdrop-blur-sm`}>
          <Icon name="StarIcon" variant="solid" size={10} className="fill-current" />
          {rating.toFixed(1)}
        </div>

        {/* Koleksiyon işareti */}
        {isInCollection && (
          <div className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-[#2ea043] flex items-center justify-center shadow-lg">
            <span className="text-white text-[10px] font-bold">✓</span>
          </div>
        )}

        {/* Hover butonları */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-3 flex gap-2 transition-all duration-250 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <button
            onClick={handleViewDetail}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20 rounded-xl text-white text-xs font-semibold transition-all duration-200 active:scale-95"
          >
            <Icon name="EyeIcon" size={13} />
            Details
          </button>
          <button
            onClick={handleCollectionToggle}
            disabled={isActionLoading}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 backdrop-blur-sm border rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 disabled:opacity-60 ${
              isInCollection
                ? 'bg-red-500/20 hover:bg-red-500/30 border-red-500/40 text-red-300'
                : 'bg-[#2ea043]/20 hover:bg-[#2ea043]/30 border-[#2ea043]/40 text-[#3dd68c]'
            }`}
          >
            <Icon name={isInCollection ? 'MinusIcon' : 'PlusIcon'} size={13} />
            {isInCollection ? 'Remove' : 'Save'}
          </button>
        </div>
      </div>

      {/* Kart alt bilgi */}
      <div className="p-3 flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-[#e6edf3] line-clamp-1 leading-tight">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[#484f58] text-xs">
            <Icon name="CalendarIcon" size={10} />
            <span className="font-tabular">{year}</span>
          </div>
          {genreLabel && (
            <span className="text-[10px] font-medium text-[#8b949e] bg-[#21262d] px-2 py-0.5 rounded-full border border-[#30363d]">
              {genreLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}