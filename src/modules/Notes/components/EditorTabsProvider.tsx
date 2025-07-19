import { createContext, useCallback, useContext, useState } from "react";

export interface EditorTab {
    id: string;
    title: string;
}

const EditorTabsContext = createContext({
    tabs: [] as EditorTab[],
    addTab: (_: EditorTab) => {},
    removeTab: (_: string) => {},
});

export const EditorTabsProvider = ({ children }: { children: React.ReactNode }) => {
    const [tabs, setTabs] = useState<EditorTab[]>([]);

    const addTab = useCallback((tab: EditorTab) => {
        setTabs([...tabs, tab]);
    }, [tabs]);

    const removeTab = useCallback((id: string) => {
        setTabs(tabs.filter((tab) => tab.id !== id));
    }, [tabs]);

    return <EditorTabsContext.Provider value={{ tabs, addTab, removeTab }}>{children}</EditorTabsContext.Provider>;
}

export const useEditorTabs = () => {
    return useContext(EditorTabsContext);
}