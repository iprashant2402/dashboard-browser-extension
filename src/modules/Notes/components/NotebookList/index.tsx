import "./index.css";
import { useContext, createContext } from "react";
import { IoAddCircle } from "react-icons/io5";
import { usePageList } from "../../hooks/usePageList";
import { PageListItem } from "../PageListItem";
import { PreferencesToolbar } from "../../../UserPreferences/components/PreferencesToolbar";

// Create a context to optionally receive mobile notes functionality
const MobileNotesOptionalContext = createContext<{
  setShowEditor?: (show: boolean) => void;
  setSelectedPageId?: (id: string | null) => void;
  setSelectedPageTitle?: (title: string | null) => void;
} | null>(null);

export const NotebookList = () => {
    const { state, actions } = usePageList();
    
    // Try to get mobile context if available
    const mobileContext = useContext(MobileNotesOptionalContext);

    const handlePageClick = (pageId: string) => {
      // Call the original page click handler
      actions.handlePageClick(pageId);
      
      // If in mobile context, switch to editor view
      if (mobileContext?.setShowEditor && mobileContext?.setSelectedPageId && mobileContext?.setSelectedPageTitle) {
        // Find the page title
        const page = state.pages?.find(p => p.id === pageId);
        const pageTitle = page?.title || "Untitled";
        
        mobileContext.setSelectedPageId(pageId);
        mobileContext.setSelectedPageTitle(pageTitle);
        mobileContext.setShowEditor(true);
      }
    };

    return (
        <>
            <div className="notebook-list">
                <div className="notebook-list-container">
            <div className="notebook-list-container-title-header">
            <p className="notebook-list-container-title">Your pages</p>
            <span className="add-page-button" onClick={actions.handleCreatePageSubmit}>
            <IoAddCircle size={14} color="var(--muted-text-color)" />
            </span>
            </div>
            <div className="notebook-list-items">
                {state.pages?.map((page, index) => <PageListItem 
                    isActive={state.currentPageId === page.id}
                    key={page.id}
                    order={index}
                    page={page} 
                    handleClick={handlePageClick}
                    handleRename={actions.handleRenamePage}
                    handleDelete={actions.handleDeletePage}
                />)}
            </div>
            <div className="notebook-list-footer">
            <PreferencesToolbar />
            </div>
        </div>
            </div>
        </>
    )
}

export { MobileNotesOptionalContext };