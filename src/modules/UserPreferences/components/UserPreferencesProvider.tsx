import { createContext, useCallback, useContext, useState } from "react";
import { DEFAULT_USER_PREFERENCE, UserPreference } from "../types/UserPreference";
import { storage } from "../../../utils/storage";
import { Theme, THEMES } from "../../Tasks/types/Theme";
import { USER_PREFERENCES_KEY } from "../../../utils/constants";

const UserPreferencesContext = createContext({
    userPreferences: DEFAULT_USER_PREFERENCE,
    updatePreferences: (_: Partial<UserPreference>) => {},
});

const loadInitialPreferences = () => {
    const preferences = storage.getItem<UserPreference>(USER_PREFERENCES_KEY);
    console.log('preferences', preferences);
    if (!preferences) {
        storage.setItem(USER_PREFERENCES_KEY, DEFAULT_USER_PREFERENCE);
    }
    return preferences ? preferences : DEFAULT_USER_PREFERENCE;
}

export const UserPreferencesProvider = ({ children }: { children: React.ReactNode }) => {
    const [userPreferences, setUserPreferences] = useState<UserPreference>(loadInitialPreferences());

    const updateDOMTheme = useCallback((theme: Theme) => {
        document.body.classList.remove(...THEMES);
        document.body.classList.add(theme);
    }, [userPreferences]);

    const updatePreferences = useCallback((preferences: Partial<UserPreference>) => {
        const updatedPreferences = { ...userPreferences, ...preferences };
        storage.setItem(USER_PREFERENCES_KEY, updatedPreferences);
        setUserPreferences(updatedPreferences);
        // update DOM classes if theme is changed
        if (preferences.theme) updateDOMTheme(preferences.theme)
    }, [userPreferences]);

    return <UserPreferencesContext.Provider value={{ userPreferences, updatePreferences }}>
        {children}
    </UserPreferencesContext.Provider>
}

export const useUserPreferences = () => {
    return useContext(UserPreferencesContext);
}