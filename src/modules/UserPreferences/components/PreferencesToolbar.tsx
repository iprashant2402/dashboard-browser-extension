import "./PreferencesToolbar.css";
import { useState } from "react";
import { Dialog } from "../../../components/Dialog";
import { PreferencesForm } from "./PreferencesForm";
import { useAuth } from "../../Auth";
import { UserInfoCard } from "./UserInfoCard";

export const PreferencesToolbar = () => {
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
    const { user } = useAuth();

    const handleSettingsMenuOpen = () => {
        setIsSettingsMenuOpen(true);
    }

    const handleSettingsMenuClose = () => {
        setIsSettingsMenuOpen(false);
    }

    return (
        <>
        <div className="preferences-toolbar">
                <UserInfoCard user={user} onClick={handleSettingsMenuOpen} />
        </div>
        <Dialog
            isOpen={isSettingsMenuOpen}
            onClose={handleSettingsMenuClose}
            title="Your account"
        >
            <PreferencesForm />
        </Dialog>
        </>
    )
}