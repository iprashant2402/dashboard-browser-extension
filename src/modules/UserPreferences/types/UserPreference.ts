import { DEFAULT_THEME, Theme } from "../../Tasks/types/Theme";

export interface UserPreference {
    theme: Theme;
}

export const DEFAULT_USER_PREFERENCE: UserPreference = {
    theme: DEFAULT_THEME,
}