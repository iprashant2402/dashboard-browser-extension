import { getRandomWallpaper } from "../modules/Themes/wallpaper/api";
import { queryClient } from "./ApiManager";
import { getAverageRGB } from "./colors";

export const getColorsFromWallpaper = () => {
    const style = getComputedStyle(document.documentElement);
    const wallpaperUrl = style.getPropertyValue('--layout-bg-color');
    const wallpaper = new Image(200, 200);
    wallpaper.src = wallpaperUrl.replace('url(', '').replace(')', '').replace(/['"]/g, '');

    return new Promise((resolve) => {
        wallpaper.onload = () => {
            resolve(getAverageRGB(wallpaper));
        }
        wallpaper.onerror = () => {
            resolve({ r: 0, g: 0, b: 0 });
        }
    });
}

export const getWallpaper = async () => {
    const wallpaper = (await queryClient.getQueryData(['wallpaper'])) as { urls: { full: string } } | undefined;
    if (!wallpaper) {
        const randomWallpaper = await getRandomWallpaper();
        queryClient.setQueryData(['wallpaper'], randomWallpaper);
        return randomWallpaper?.urls.full;
    }
    return wallpaper?.urls.full;
}

export const setWallpaper = async (savedWallpaper?: string) => {
    const wallpaper = savedWallpaper || await getWallpaper();
    const rootElement = document.getElementById('root');
    if (rootElement) {
        rootElement.style.background = `url(${wallpaper})`;
        rootElement.style.backgroundSize = 'cover';
        rootElement.style.backgroundPosition = 'center';
        rootElement.style.backgroundRepeat = 'no-repeat';
        rootElement.style.backgroundAttachment = 'fixed';
    }
}

export const unsetWallpaper = () => {
    const rootElement = document.getElementById('root');
    if (rootElement) {
        rootElement.style.backgroundImage = '';
    }
}