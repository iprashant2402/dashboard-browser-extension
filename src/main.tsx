/// <reference path="./types/global.d.ts" />
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import App from './App.tsx'
import { localDB } from './utils/LocalDBStorage.ts'
import { ReactQueryProvider } from './providers/ReactQueryProvider.tsx'

// getColorsFromWallpaper().then((wallpaperColor) => {
//     const { r, g, b } = wallpaperColor as RGB;
//     document.documentElement.style.setProperty('--card-bg-color', `rgba(${r}, ${g}, ${b}, 0.5)`);
// });

await localDB.init();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
      <App />
    </ReactQueryProvider>
  </StrictMode>,
)
