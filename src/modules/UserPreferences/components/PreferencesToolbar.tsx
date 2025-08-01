import { Theme, THEME_DISPLAY_NAMES, THEMES } from "../../Tasks/types/Theme";
import { useUserPreferences } from "./UserPreferencesProvider"
import "./PreferencesToolbar.css";
import { IoSettingsOutline } from "react-icons/io5";
import { useState } from "react";
import { Dialog } from "../../../components/Dialog";
import { Button } from "../../../components/Button";
import { PreferencesForm } from "./PreferencesForm";

export const PreferencesToolbar = () => {
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

    const handleSettingsMenuOpen = () => {
        setIsSettingsMenuOpen(true);
    }

    const handleSettingsMenuClose = () => {
        setIsSettingsMenuOpen(false);
    }

    return (
        <>
        <div className="preferences-toolbar">
            <Button variant="clear" icon={<IoSettingsOutline size={16} />} onClick={handleSettingsMenuOpen} />
        </div>
        <Dialog
            isOpen={isSettingsMenuOpen}
            onClose={handleSettingsMenuClose}
            title="Settings"
        >
            <PreferencesForm onClose={handleSettingsMenuClose} />
        </Dialog>
        </>
    )
}