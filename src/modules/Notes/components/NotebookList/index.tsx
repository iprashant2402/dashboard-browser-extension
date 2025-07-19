import "./index.css";
import { getRandomQuote } from "../../../../utils/quotes";
import { useMemo } from "react";
import { Button } from "../../../../components/Button";
import { IoAddCircle } from "react-icons/io5";
import { usePageList } from "../../hooks/usePageList";
import { PageListItem } from "../PageListItem";

export const NotebookList = () => {
    const quote = useMemo(() => getRandomQuote(), []);
    const { state, actions } = usePageList();

    return (
        <>
            <div className="notebook-list">
            <div className="notebook-list-header">
                <div className="row jt-space-between ai-center">
                    <div>
                        <h1 className="notebook-list-title">Your <span>Pages</span></h1>
                        <p className="notebook-list-description">{quote}</p>
                    </div>
                    <div>
                        <Button
                            variant="clear"
                            icon={<IoAddCircle size={24} />}
                            onClick={actions.handleCreatePageSubmit}
                        />
                    </div>
                </div>
            </div>
                <div className="notebook-list-container">
            <div className="notebook-list-items">
                {state.pages?.map((page) => <PageListItem 
                    isActive={state.currentPageId === page.id}
                    key={page.id} 
                    page={page} 
                    handleClick={actions.handlePageClick}
                    handleRename={actions.handleRenamePage}
                    handleDelete={actions.handleDeletePage}
                />)}
            </div>
        </div>
            </div>
        </>
    )
}