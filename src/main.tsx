/// <reference path="./types/global.d.ts" />
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import App from './App.tsx'
import { localDB } from './utils/LocalDBStorage.ts'
import { ReactQueryProvider } from './providers/ReactQueryProvider.tsx'
import { ThemeProvider } from './modules/Themes/ThemeProvider.tsx'
import './modules/Themes/themeConfigs/ocean.css'
import './modules/Themes/themeConfigs/comfort.css'
import './modules/Themes/themeConfigs/midnightEmber.css'
import './modules/Themes/themeConfigs/northernLights.css'
import './modules/Themes/themeConfigs/goldenHour.css'
import './modules/Themes/themeConfigs/morningDew.css'

// getColorsFromWallpaper().then((wallpaperColor) => {
//     const { r, g, b } = wallpaperColor as RGB;
//     document.documentElement.style.setProperty('--card-bg-color', `rgba(${r}, ${g}, ${b}, 0.5)`);
// });

await localDB.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ReactQueryProvider>
  </StrictMode>,
)
