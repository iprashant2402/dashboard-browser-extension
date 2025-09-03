import { Theme, THEME_DISPLAY_NAMES, THEMES } from "../../Tasks/types/Theme"
import "./PreferencesForm.css";
import { Toggle } from "../../../components/Toggle";
import { useUserPreferences } from "../hooks/useUserPreferences";
import { AuthMenuContent } from "../../Auth/components/AuthDialog/AuthMenuContent";
import { useAuth } from "../../Auth";
import { Button } from "../../../components/Button";

export const PreferencesForm = () => {
    const { userPreferences, updatePreferences } = useUserPreferences();
    const { user, isAuthenticated, isLoggingOut, logout } = useAuth();

    const handleLogout = async () => {
        try {
          await logout();
        } catch (error) {
          console.error('Logout error:', error);
        }
      };

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        updatePreferences({ theme: event.target.value as Theme });
    }

    const handleEditorToolbarChange = (checked: boolean) => {
        updatePreferences({ editorToolbarEnabled: checked });
    }

    return (
        <div className="preferences-menu">
            {(!isAuthenticated || !user) ? <AuthMenuContent /> : (
                <>
                <div className="preferences-menu-title-row">
                    <h4>Signed in as</h4>
                </div>
                <div className="preferences-menu-item auth-menu-item">
                    <label>
                        {user.email}
                    </label>
                    <Button
                variant='clear' 
                label={isLoggingOut ? 'Signing out...' : 'Sign Out'}
                onClick={handleLogout}
                className='logout-button'
                disabled={isLoggingOut}
              />
                </div>
                </>
            )}
            <div className="preferences-menu-title-row">
                <h4>Preferences</h4>
            </div>
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