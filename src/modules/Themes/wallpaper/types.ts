export interface UnsplashPhoto {
  id: string;
  width: number;
  height: number;
  color: string;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
  };
  description: string | null;
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

export interface WallpaperError extends Error {
  status?: number;
} 