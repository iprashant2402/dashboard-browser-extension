import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MobileNotesContextType {
  showEditor: boolean;
  setShowEditor: (show: boolean) => void;
  selectedPageId: string | null;
  setSelectedPageId: (id: string | null) => void;
  selectedPageTitle: string | null;
  setSelectedPageTitle: (title: string | null) => void;
}

const MobileNotesContext = createContext<MobileNotesContextType | undefined>(undefined);

export const useMobileNotes = () => {
  const context = useContext(MobileNotesContext);
  if (!context) {
    throw new Error('useMobileNotes must be used within a MobileNotesProvider');
  }
  return context;
};

interface MobileNotesProviderProps {
  children: ReactNode;
}

export const MobileNotesProvider: React.FC<MobileNotesProviderProps> = ({ children }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [selectedPageTitle, setSelectedPageTitle] = useState<string | null>(null);

  return (
    <MobileNotesContext.Provider
      value={{
        showEditor,
        setShowEditor,
        selectedPageId,
        setSelectedPageId,
        selectedPageTitle,
        setSelectedPageTitle,
      }}
    >
      {children}
    </MobileNotesContext.Provider>
  );
}; 