import { Theme, THEME_DISPLAY_NAMES, THEMES } from "../../Tasks/types/Theme"
import "./PreferencesForm.css";
import { Toggle } from "../../../components/Toggle";
import { useUserPreferences } from "../hooks/useUserPreferences";
import { AuthMenuContent } from "../../Auth/components/AuthDialog/AuthMenuContent";
import { useAuth } from "../../Auth";
import { Button } from "../../../components/Button";
import { AnalyticsTracker } from "../../../analytics/AnalyticsTracker";
import { useMountEffect } from "../../../utils/useMountEffect";
import { WallpaperPicker } from "./WallpaperPicker/WallpaperPicker";

const DEFAULT_GLASS_WALLPAPER = "https://images.unsplash.com/photo-1756758006047-efc2f2b7d493?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export const PreferencesForm = () => {
    const { userPreferences, updatePreferences } = useUserPreferences();
    const { user, isAuthenticated, isLoggingOut, logout } = useAuth();

    useMountEffect(() => {
        AnalyticsTracker.track('Account center - PV', {
            isLoggedIn: isAuthenticated,
            theme: userPreferences.theme,
            editorToolbarEnabled: userPreferences.editorToolbarEnabled,
        });
    })

    const handleLogout = async () => {
        AnalyticsTracker.track('Logout - Click');
        try {
          await logout();
        } catch (error) {
          console.error('Logout error:', error);
        }
      };

    const handleGlassTheme = () => {
        const wallpaper = userPreferences.wallpaper;
        if (wallpaper) {
            updatePreferences({ wallpaper });
        } else {
            updatePreferences({ wallpaper: {
                url: DEFAULT_GLASS_WALLPAPER,
                author: 'Unsplash',
                authorUrl: 'https://unsplash.com',
                downloadLocation: 'https://unsplash.com',
            } });
        }
    };

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        AnalyticsTracker.track('Theme updated', {
            theme: event.target.value as Theme,
        });
        if (event.target.value === 'glass') handleGlassTheme();
        else updatePreferences({ theme: event.target.value as Theme });
    }

    const handleEditorToolbarChange = (checked: boolean) => {
        AnalyticsTracker.track('Editor toolbar toggle', {
            editorToolbarEnabled: checked,
        });
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
            {userPreferences.theme === 'glass' && (
                <div className="preferences-menu-item">
                    <label htmlFor="wallpaper-enabled">Choose wallpaper</label>
                    <WallpaperPicker />
                </div>
            )}
            <div className="preferences-menu-item">
                <label htmlFor="editor-toolbar-enabled">Show editor toolbar?</label>
                <Toggle id="editor-toolbar-enabled" checked={userPreferences.editorToolbarEnabled} onChange={handleEditorToolbarChange} />
            </div>
        </div>
    )
}