import { usePageList } from "../../modules/Notes/hooks/usePageList";
import "./index.css";
import { useMemo } from "react";
import { IoAddCircle, IoFileTray } from "react-icons/io5";
import { Button } from "../../components/Button";
import { PageListItem } from "../../modules/Notes/components/PageListItem";

export const MobileHomeView = () => {
    const { state, actions } = usePageList();
    // Try to get mobile context if available
    const handlePageClick = (pageId: string) => {
      // Call the original page click handler
      actions.handlePageClick(pageId);
    };

    const isEmptyState = useMemo(() => {
        return state.pages && state.pages.length === 0;
    }, [state.pages]);
    
    return <div className="mobile-home-view">
        <div className="mobile-home-view-header">
            <div className="text-container">
            <h1>Your pages</h1>
            <p>Ink it down or let it drown.</p>
            </div>
            <div className="mobile-home-view-header-actions">
            <IoAddCircle size={32} onClick={actions.handleCreatePageSubmit} color="var(--primary-color)" />
            </div>
        </div>
        <div className={`mobile-home-view-content ${isEmptyState ? 'empty-state' : ''}`}>
        {isEmptyState && (
                    <div className="mobile-home-view-empty-state" onClick={actions.handleCreatePageSubmit}>
                        <IoFileTray size={48} color="var(--muted-text-color)" />
                        <div>
                        <p>No pages yet</p>
                        <Button variant="primary" label="Create" icon={<IoAddCircle size={18} />} />
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
    </div>;
}