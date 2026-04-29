export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  vote_average: number;
  vote_count?: number;
  release_date?: string;
  genre_ids?: number[];
  overview?: string;
  popularity?: number;
  original_language?: string;
  adult?: boolean;
}

export interface CollectionMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  genre_ids: number[];
  release_date: string;
}

export interface MovieDetails extends Movie {
  runtime?: number;
  budget?: number;
  revenue?: number;
  status?: string;
  tagline?: string;
  genres?: { id: number; name: string }[];
  production_companies?: { id: number; name: string; logo_path: string | null }[];
  credits?: {
    cast: CastMember[];
    crew: CrewMember[];
  };
  reviews?: {
    results: Review[];
  };
  videos?: {
    results: Video[];
  };
  keywords?: {
    keywords: Keyword[];
  };
  similar?: {
    results: Movie[];
  };
  release_dates?: {
    results: ReleaseDateEntry[];
  };
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  author_details: {
    rating: number | null;
    avatar_path: string | null;
  };
  created_at: string;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Keyword {
  id: number;
  name: string;
}

export interface ReleaseDateEntry {
  iso_3166_1: string;
  release_dates: {
    certification: string;
    release_date: string;
    type: number;
  }[];
}

export const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};