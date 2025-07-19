import { Editor } from "../../../../components/Editor";
import { usePageEditor } from "../../hooks/usePageEditor";
import "./index.css";

export const PageEditor = () => {
    const { state, actions } = usePageEditor();

    return (
        <div className="page-editor">
            {state.pageFetchStatus === "success" && <Editor 
                onChange={actions.handleOnSavePage}
                initialState={state.page?.content}
                onSave={actions.handleOnSavePage}
            />}
        </div>
    )
}