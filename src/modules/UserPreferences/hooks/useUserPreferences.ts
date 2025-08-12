import { useContext } from "react";
import { UserPreferencesContext } from "../components/UserPreferencesContext";

export const useUserPreferences = () => {
    return useContext(UserPreferencesContext);
}