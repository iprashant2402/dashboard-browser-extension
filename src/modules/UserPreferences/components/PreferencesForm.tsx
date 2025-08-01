import { Theme, THEME_DISPLAY_NAMES, THEMES } from "../../Tasks/types/Theme"
import { useUserPreferences } from "./UserPreferencesProvider";
import "./PreferencesForm.css";
import { Toggle } from "../../../components/Toggle";

export const PreferencesForm = (props: { onClose: () => void }) => {
    const { userPreferences, updatePreferences } = useUserPreferences();

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        updatePreferences({ theme: event.target.value as Theme });
    }

    const handleQuickAccessPanelChange = (checked: boolean) => {
        updatePreferences({ quickAccessPanelEnabled: checked });
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
                <label htmlFor="quick-access-panel-enabled">Show quick access panel?</label>
                <Toggle id="quick-access-panel-enabled" checked={userPreferences.quickAccessPanelEnabled} onChange={handleQuickAccessPanelChange} />
            </div>
            <div className="preferences-menu-item">
                <label htmlFor="editor-toolbar-enabled">Show editor toolbar?</label>
                <Toggle id="editor-toolbar-enabled" checked={userPreferences.editorToolbarEnabled} onChange={handleEditorToolbarChange} />
            </div>
        </div>
    )
}