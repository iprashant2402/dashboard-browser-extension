import { Theme, THEME_DISPLAY_NAMES, THEMES } from "../../Tasks/types/Theme"
import "./PreferencesForm.css";
import { Toggle } from "../../../components/Toggle";
import { useUserPreferences } from "../hooks/useUserPreferences";

export const PreferencesForm = () => {
    const { userPreferences, updatePreferences } = useUserPreferences();

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        updatePreferences({ theme: event.target.value as Theme });
    }

    const handleEditorToolbarChange = (checked: boolean) => {
        updatePreferences({ editorToolbarEnabled: checked });
    }

    return (
        <div className="preferences-menu">
            <div className="preferences-menu-item">
            <label htmlFor="theme-select">Choose theme</label>
            <select className="preferences-menu-select" id="theme-select" value={userPreferences.theme} onChange={handleThemeChange}>
                {THEMES.map((theme) => (
                    <option key={theme} value={theme}>{THEME_DISPLAY_NAMES[theme]}</option>
                ))}
            </select>
            </div>
            <div className="preferences-menu-item">
                <label htmlFor="editor-toolbar-enabled">Show editor toolbar?</label>
                <Toggle id="editor-toolbar-enabled" checked={userPreferences.editorToolbarEnabled} onChange={handleEditorToolbarChange} />
            </div>
        </div>
    )
}