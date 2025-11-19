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
    wallpaper: {
        "url": "https://images.unsplash.com/photo-1727239122674-879c3157d491?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4MDQwOTh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NjM1MzE4NTF8&ixlib=rb-4.1.0&q=85",
        "author": "Bridger Tower",
        "authorUrl": "https://unsplash.com/@brijr",
        "downloadLocation": "https://api.unsplash.com/photos/Ah0bbyy85Yk/download?ixid=M3w4MDQwOTh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3NjM1MzE4NTF8"
    },
}