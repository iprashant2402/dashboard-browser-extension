/// <reference path="./types/global.d.ts" />
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './fonts.css'
import './index.css'
import App from './App.tsx'
import { localDB } from './utils/LocalDBStorage.ts'
import { ReactQueryProvider } from './providers/ReactQueryProvider.tsx'
import './modules/Themes/themeConfigs/ocean.css'
import './modules/Themes/themeConfigs/comfort.css'
import './modules/Themes/themeConfigs/midnightEmber.css'
import './modules/Themes/themeConfigs/northernLights.css'
import './modules/Themes/themeConfigs/goldenHour.css'
import './modules/Themes/themeConfigs/morningDew.css'
import './modules/Themes/themeConfigs/linus.css'
import './modules/Themes/themeConfigs/torvalds.css'
import './modules/Themes/themeConfigs/comfortLite.css'
import { UserPreferencesProvider } from './modules/UserPreferences/components/UserPreferencesProvider.tsx'
import { storage } from './utils/storage.ts'
import { THEMES } from './modules/Tasks/types/Theme.ts'
import { UserPreference } from './modules/UserPreferences/types/UserPreference.ts'

await localDB.init();

const userPreferences = storage.getItem<UserPreference>('userPreferences');
if (userPreferences?.theme) {
  document.body.classList.remove(...THEMES);
  document.body.classList.add(userPreferences.theme);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
        <UserPreferencesProvider>
          <App />
        </UserPreferencesProvider>
    </ReactQueryProvider>
  </StrictMode>,
)
