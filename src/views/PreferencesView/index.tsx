import { PreferencesForm } from "../../modules/UserPreferences/components/PreferencesForm";
import "./index.css";

export const PreferencesView = () => {
    return <div className="preferences-view">
        <div className="preferences-view-header">
            <h1>Your account</h1>
            <p>Manage your account and preferences</p>
        </div>
        <PreferencesForm />
    </div>;
}