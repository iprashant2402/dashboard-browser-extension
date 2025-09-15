import { useQuery } from '@tanstack/react-query';
import { getRandomWallpapers, searchWallpapers } from './api';
import { UnsplashPhoto, UnsplashSearchResponse } from './types';

export const WALLPAPER_QUERY_KEYS = {
  randomWallpapers: ['wallpapers', 'random'] as const,
  searchWallpapers: (query: string, page: number) => ['wallpapers', 'search', query, page] as const,
};

export const useRandomWallpapers = (count: number = 10) => {
  return useQuery<UnsplashPhoto[], Error>({
    queryKey: [...WALLPAPER_QUERY_KEYS.randomWallpapers, count],
    queryFn: () => getRandomWallpapers(count),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useSearchWallpapers = (query: string, page: number = 1, enabled: boolean = true) => {
  return useQuery<UnsplashSearchResponse, Error>({
    queryKey: WALLPAPER_QUERY_KEYS.searchWallpapers(query, page),
    queryFn: () => searchWallpapers(query, page, 20),
    enabled: enabled && query.trim().length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}; 