import { DEFAULT_THEME, Theme } from "../../Tasks/types/Theme";

export interface UserPreference {
    theme: Theme;
    editorToolbarEnabled: boolean;
}

export const DEFAULT_USER_PREFERENCE: UserPreference = {
    theme: DEFAULT_THEME,
    editorToolbarEnabled: true,
}