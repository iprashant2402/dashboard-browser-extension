import { DEFAULT_THEME, Theme } from "../../Themes/Theme";

export interface Wallpaper {
    url: string;
    author: string;
    authorUrl: string;
    downloadLocation: string;
}

export interface UserPreference {
    theme: Theme;
    editorToolbarEnabled: boolean;
    wallpaper?: Wallpaper;
}

export const DEFAULT_USER_PREFERENCE: UserPreference = {
    theme: DEFAULT_THEME,
    editorToolbarEnabled: true,
    wallpaper: undefined,
}