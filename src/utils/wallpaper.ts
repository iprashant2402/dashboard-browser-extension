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