import { createContext, useContext, useEffect, useState } from "react";

const PrivacyCurtainContext = createContext<{
    isPrivacyCurtainEnabled: boolean;
    setIsPrivacyCurtainEnabled: (isPrivacyCurtainEnabled: boolean) => void;
}>({
    isPrivacyCurtainEnabled: false,
    setIsPrivacyCurtainEnabled: () => {},
});

const initializePrivacyCurtain = () => {
    const isPrivacyCurtainEnabled = localStorage.getItem('isPrivacyCurtainEnabled');
    if (isPrivacyCurtainEnabled && isPrivacyCurtainEnabled === 'true') {
        return true;
    }
    return false;
}

export const PrivacyCurtainProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPrivacyCurtainEnabled, setIsPrivacyCurtainEnabled] = useState(initializePrivacyCurtain());

    useEffect(() => {
        localStorage.setItem('isPrivacyCurtainEnabled', isPrivacyCurtainEnabled.toString());
    }, [isPrivacyCurtainEnabled]);

    return (
        <PrivacyCurtainContext.Provider value={{ isPrivacyCurtainEnabled, setIsPrivacyCurtainEnabled }}>
            {children}
        </PrivacyCurtainContext.Provider>
    )
}

export const usePrivacyCurtain = () => {
    return useContext(PrivacyCurtainContext);
}