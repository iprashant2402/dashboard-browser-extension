import { UnsplashPhoto, UnsplashSearchResponse, WallpaperError } from './types';

const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/random';
const UNSPLASH_SEARCH_URL = 'https://api.unsplash.com/search/photos';
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_APP_UNSPLASH_API_ACCESS_KEY;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`) as WallpaperError;
    error.status = response.status;
    throw error;
  }
  return response.json();
};

export const getRandomWallpaper = async (): Promise<UnsplashPhoto> => {
    const response = await fetch(`${UNSPLASH_API_URL}`, {
        headers: {
            'Accept-Version': 'v1',
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
    });
    return handleResponse(response);
};

export const getRandomWallpapers = async (count: number = 10): Promise<UnsplashPhoto[]> => {
    const response = await fetch(`${UNSPLASH_API_URL}?count=${count}`, {
        headers: {
            'Accept-Version': 'v1',
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
    });
    return handleResponse(response);
};

export const getWallpaperByQuery = async (query: string, orientation: 'landscape' | 'portrait' | 'squarish' = 'landscape'): Promise<UnsplashPhoto> => {
    const response = await fetch(`${UNSPLASH_API_URL}?query=${encodeURIComponent(query)}&orientation=${orientation}`, {
        headers: {
            'Accept-Version': 'v1',
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
    });
    return handleResponse(response);
};

export const searchWallpapers = async (query: string, page: number = 1, perPage: number = 20): Promise<UnsplashSearchResponse> => {
    const response = await fetch(`${UNSPLASH_SEARCH_URL}?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&orientation=landscape`, {
        headers: {
            'Accept-Version': 'v1',
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
    });
    return handleResponse(response);
};