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
import './modules/Themes/themeConfigs/blackPaper.css'
import './modules/Themes/themeConfigs/whitePaper.css'
import './modules/Themes/themeConfigs/blackPaperLite.css'
import './modules/Themes/themeConfigs/whitePaperLite.css'
import './modules/Themes/themeConfigs/glass.css'
import { UserPreferencesProvider } from './modules/UserPreferences/components/UserPreferencesProvider.tsx'
import { storage } from './utils/storage.ts'
import { THEMES } from './modules/Tasks/types/Theme.ts'
import { UserPreference } from './modules/UserPreferences/types/UserPreference.ts'
import { ToastContainer } from './components/Toast/index.ts'
import { USER_PREFERENCES_KEY } from './utils/constants.ts'
import { AnalyticsTracker } from './analytics/AnalyticsTracker.ts'
import { getUserProfileLocalStorage } from './utils/helpers.ts'

localDB.init().then(() => {
  const userPreferences = storage.getItem<UserPreference>(USER_PREFERENCES_KEY);
if (userPreferences?.theme) {
  document.body.classList.remove(...THEMES);
  document.body.classList.add(userPreferences.theme);
}

AnalyticsTracker.init(getUserProfileLocalStorage());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactQueryProvider>
        <UserPreferencesProvider>
          <ToastContainer>
          <App />
          </ToastContainer>
        </UserPreferencesProvider>
    </ReactQueryProvider>
  </StrictMode>,
)
});
