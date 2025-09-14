const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/random';
const UNSPLASH_SEARCH_URL = 'https://api.unsplash.com/search/photos';
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_APP_UNSPLASH_API_ACCESS_KEY;

export const getRandomWallpaper = async (): Promise<{ urls: { full: string } }> => {
    const response = await fetch(`${UNSPLASH_API_URL}`, {
        headers: {
            'Accept-Version': 'v1',
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
    });
    const data = await response.json();
    return data;
};

export const getWallpaperByQuery = async (query: string, orientation: 'landscape' | 'portrait' | 'squarish' = 'landscape') => {
    const response = await fetch(`${UNSPLASH_API_URL}?query=${encodeURIComponent(query)}&orientation=${orientation}`, {
        headers: {
            'Accept-Version': 'v1',
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
    });
    const data = await response.json();
    return data;
};

export const searchWallpapers = async (query: string, page: number = 1, perPage: number = 20) => {
    const response = await fetch(`${UNSPLASH_SEARCH_URL}?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}&orientation=landscape`, {
        headers: {
            'Accept-Version': 'v1',
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
    });
    const data = await response.json();
    return data;
};