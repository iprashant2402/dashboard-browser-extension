import { createContext } from "react";
import { DEFAULT_USER_PREFERENCE, UserPreference } from "../types/UserPreference";

export const UserPreferencesContext = createContext({
    userPreferences: DEFAULT_USER_PREFERENCE,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updatePreferences: (_: Partial<UserPreference>) => {},
});