import { useCallback, useState } from "react";
import { DEFAULT_USER_PREFERENCE, UserPreference } from "../types/UserPreference";
import { storage } from "../../../utils/storage";
import { Theme, THEMES } from "../../Themes/Theme";
import { USER_PREFERENCES_KEY } from "../../../utils/constants";
import { UserPreferencesContext } from "./UserPreferencesContext";
import { setWallpaper, unsetWallpaper } from "../../../utils/wallpaper";
import { useMountEffect } from "../../../utils/useMountEffect";

const loadInitialPreferences = () => {
    const preferences = storage.getItem<UserPreference>(USER_PREFERENCES_KEY);
    if (!preferences) {
        storage.setItem(USER_PREFERENCES_KEY, DEFAULT_USER_PREFERENCE);
    }
    return preferences ? preferences : DEFAULT_USER_PREFERENCE;
}

export const UserPreferencesProvider = ({ children }: { children: React.ReactNode }) => {
    const [userPreferences, setUserPreferences] = useState<UserPreference>(loadInitialPreferences());

    useMountEffect(() => {
        if (userPreferences.theme === 'glass') {
            setWallpaper(userPreferences.wallpaper?.url);
        } else {
            unsetWallpaper();
        }
    });

    const updateDOMTheme = useCallback((theme: Theme) => {
        document.body.classList.remove(...THEMES);
        document.body.classList.add(theme);
        if (theme === 'glass') {
            setWallpaper(userPreferences.wallpaper?.url);
        } else {
            unsetWallpaper();
        }
    }, [userPreferences.wallpaper]);

    const updatePreferences = useCallback((preferences: Partial<UserPreference>) => {
        const updatedPreferences = { ...userPreferences, ...preferences };
        if (preferences.wallpaper) updatedPreferences.theme = 'glass';
        storage.setItem(USER_PREFERENCES_KEY, updatedPreferences);
        setUserPreferences(updatedPreferences);
        // update DOM classes if theme is changed
        if (preferences.wallpaper) {
            setWallpaper(preferences.wallpaper.url);
            updateDOMTheme('glass');
        }
        if (preferences.theme) updateDOMTheme(preferences.theme)
    }, [userPreferences, updateDOMTheme]);

    return <UserPreferencesContext.Provider value={{ userPreferences, updatePreferences }}>
        {children}
    </UserPreferencesContext.Provider>
}