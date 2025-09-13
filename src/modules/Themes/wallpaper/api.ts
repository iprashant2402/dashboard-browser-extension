const UNSPLASH_API_URL = 'https://api.unsplash.com/photos/random';
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_APP_UNSPLASH_API_ACCESS_KEY;

export const getRandomWallpaper = async () => {
    const response = await fetch(`${UNSPLASH_API_URL}`, {
        headers: {
            'Accept-Version': 'v1',
            'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
    });
    const data = await response.json();
    return data;
};