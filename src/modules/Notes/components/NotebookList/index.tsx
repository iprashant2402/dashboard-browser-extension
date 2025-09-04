import "./index.css";
import { useContext, createContext, useMemo } from "react";
import { IoAddCircle, IoFileTray } from "react-icons/io5";
import { usePageList } from "../../hooks/usePageList";
import { PageListItem } from "../PageListItem";
import { PreferencesToolbar } from "../../../UserPreferences/components/PreferencesToolbar";
import { RESOURCES } from "../../utils/contants";
import { useNavigate } from "react-router";
import { Button } from "../../../../components/Button";

// Create a context to optionally receive mobile notes functionality
const MobileNotesOptionalContext = createContext<{
  setShowEditor?: (show: boolean) => void;
  setSelectedPageId?: (id: string | null) => void;
  setSelectedPageTitle?: (title: string | null) => void;
} | null>(null);

export const NotebookList = () => {
    const { state, actions } = usePageList();
    const navigate = useNavigate();
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

    const handleResourceClick = (resourceId: string) => {
        navigate(`/resource/${resourceId}`);
    };

    const isEmptyState = useMemo(() => {
        return state.pages && state.pages.length === 0;
    }, [state.pages]);

    return (
        <>
            <div className="notebook-list">
            <div className="notebook-list-container">
            <div className="notebook-list-section">
            <div className="notebook-list-container-title-header">
            <p className="notebook-list-container-title">Resources</p>
            </div>
            <div className="notebook-list-items">
                {RESOURCES.map((page, index) => <PageListItem 
                    isActive={state.currentPageId === page.id}
                    key={page.id}
                    order={index}
                    page={page} 
                    handleClick={handleResourceClick}
                />)}
            </div>
            </div>
            <div className="notebook-list-section full-height">
            <div className="notebook-list-container-title-header">
            <p className="notebook-list-container-title">Your pages</p>
            {!isEmptyState && <span className="add-page-button" onClick={actions.handleCreatePageSubmit}>
            <IoAddCircle size={18} color="var(--primary-color)" />
            </span>}
            </div>
            <div className="notebook-list-items">
                {isEmptyState && (
                    <div className="notebook-list-empty-state">
                        <IoFileTray size={48} color="var(--muted-text-color)" />
                        <div>
                        <p>No pages yet</p>
                        <Button className="empty-state-add-page-button" variant="clear" label="Create" icon={<IoAddCircle size={18} />} onClick={actions.handleCreatePageSubmit} />
                        </div>
                    </div>
                )}
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
            </div>
        </div>
        <div className="notebook-list-footer">
            <PreferencesToolbar />
        </div>
        </div>
        </>
    )
}

export { MobileNotesOptionalContext };