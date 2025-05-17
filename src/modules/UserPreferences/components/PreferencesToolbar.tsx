import { Theme, THEME_DISPLAY_NAMES, THEMES } from "../../Tasks/types/Theme";
import { useUserPreferences } from "./UserPreferencesProvider"
import "./PreferencesToolbar.css";

export const PreferencesToolbar = () => {
    const { userPreferences, updatePreferences } = useUserPreferences();

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        updatePreferences({ theme: event.target.value as Theme });
    }

    return (
        <div className="preferences-toolbar">
            <select value={userPreferences.theme} onChange={handleThemeChange}>
                {THEMES.map((theme) => (
                    <option key={theme} value={theme}>{THEME_DISPLAY_NAMES[theme]}</option>
                ))}
            </select>
        </div>
    )
}