import { Theme, THEME_DISPLAY_NAMES, THEMES } from "../../Tasks/types/Theme";
import { useUserPreferences } from "./UserPreferencesProvider"
import "./PreferencesToolbar.css";
import { IoSettingsOutline } from "react-icons/io5";

export const PreferencesToolbar = () => {
    const { userPreferences, updatePreferences } = useUserPreferences();

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        updatePreferences({ theme: event.target.value as Theme });
    }

    return (
        <div className="preferences-toolbar">
            <label htmlFor="theme-select"><IoSettingsOutline size={14} /></label>
            <select id="theme-select" value={userPreferences.theme} onChange={handleThemeChange}>
                {THEMES.map((theme) => (
                    <option key={theme} value={theme}>{THEME_DISPLAY_NAMES[theme]}</option>
                ))}
            </select>
        </div>
    )
}