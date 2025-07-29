import { createContext, useContext, useState } from "react";

const PrivacyCurtainContext = createContext<{
    isPrivacyCurtainEnabled: boolean;
    setIsPrivacyCurtainEnabled: (isPrivacyCurtainEnabled: boolean) => void;
}>({
    isPrivacyCurtainEnabled: false,
    setIsPrivacyCurtainEnabled: () => {},
});

const initializePrivacyCurtain = () => {
    const isPrivacyCurtainEnabled = localStorage.getItem('isPrivacyCurtainEnabled');
    if (isPrivacyCurtainEnabled) {
        return true;
    }
    return false;
}

export const PrivacyCurtainProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPrivacyCurtainEnabled, setIsPrivacyCurtainEnabled] = useState(initializePrivacyCurtain());

    return (
        <PrivacyCurtainContext.Provider value={{ isPrivacyCurtainEnabled, setIsPrivacyCurtainEnabled }}>
            {children}
        </PrivacyCurtainContext.Provider>
    )
}

export const usePrivacyCurtain = () => {
    return useContext(PrivacyCurtainContext);
}