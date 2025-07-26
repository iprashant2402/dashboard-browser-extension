import React from 'react';
import { IoArrowBack, IoList } from 'react-icons/io5';
import { NotebookList, MobileNotesOptionalContext } from '../../modules/Notes/components/NotebookList';
import { CommandCenter } from '../../views/CommandCenter';
import { EditorTabsProvider } from '../../modules/Notes/components/EditorTabsProvider';
import { Button } from '../Button';
import { MobileNotesProvider, useMobileNotes } from './MobileNotesContext';
import './index.css';

interface ResponsiveTabsProps {
  className?: string;
}

const MobileNotesView: React.FC = () => {
  const { showEditor, setShowEditor, setSelectedPageId, selectedPageTitle, setSelectedPageTitle } = useMobileNotes();

  return (
    <div className="mobile-notes-layout">
      {!showEditor ? (
        <div className="mobile-notes-list">
          <MobileNotesOptionalContext.Provider value={{ setShowEditor, setSelectedPageId, setSelectedPageTitle }}>
            <NotebookList />
          </MobileNotesOptionalContext.Provider>
        </div>
      ) : (
        <div className="mobile-notes-editor">
          <div className="mobile-editor-header">
            <Button
              variant="clear"
              icon={<IoArrowBack />}
              onClick={() => setShowEditor(false)}
              className="back-to-list-button"
            />
            <div className="page-title-container">
              <h3 className="page-title">{selectedPageTitle || "Untitled"}</h3>
            </div>
            <Button
              variant="clear"
              icon={<IoList />}
              label="Notes"
              onClick={() => setShowEditor(false)}
              className="notes-list-button"
            />
          </div>
          <div className="mobile-editor-content">
            <EditorTabsProvider>
              <CommandCenter />
            </EditorTabsProvider>
          </div>
        </div>
      )}
    </div>
  );
};

export const ResponsiveTabs: React.FC<ResponsiveTabsProps> = ({ className }) => {
  return (
    <MobileNotesProvider>
      <div className={`responsive-tabs ${className || ''}`}>
        <MobileNotesView />
      </div>
    </MobileNotesProvider>
  );
}; 