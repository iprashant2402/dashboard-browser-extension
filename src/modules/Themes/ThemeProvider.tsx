import { createContext, useCallback, useContext, useState } from "react";
import { DEFAULT_THEME, Theme, THEMES } from "../Tasks/types/Theme";

const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: (_: Theme) => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

    const toggleTheme = useCallback((theme: Theme) => {
        document.body.classList.remove(...THEMES);
        document.body.classList.add(theme);
        setTheme(theme);
    }, [theme]);

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
    </ThemeContext.Provider>
}

export const useTheme = () => {
    return useContext(ThemeContext);
}