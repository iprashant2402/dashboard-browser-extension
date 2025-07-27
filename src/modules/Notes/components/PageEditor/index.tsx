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
                placeholder={<div className="page-editor-placeholder">
                    <p>Jot down your thoughts or anything else...</p>
                    <p>You can use markdown to format your notes.</p>
                    <br />
                    <p>Helpful shortcuts:</p>
                    <br />
                        <span className="instruction"><span className="instruction-highlight">#</span> + <span className="instruction-highlight">space</span> to create a heading level 1</span><br />
                        <span className="instruction"><span className="instruction-highlight">##</span> + <span className="instruction-highlight">space</span> to create a heading level 2</span><br />
                        <span className="instruction"><span className="instruction-highlight">###</span> + <span className="instruction-highlight">space</span> to create a heading level 3</span><br />
                        <span className="instruction"><span className="instruction-highlight">-</span> + <span className="instruction-highlight">space</span> to create a list</span><br />
                        <span className="instruction"><span className="instruction-highlight">&gt;</span> + <span className="instruction-highlight">space</span> to create a quote</span><br />
                        <span className="instruction"><span className="instruction-highlight">cmd + B</span> to create a bold text</span><br />
                        <span className="instruction"><span className="instruction-highlight">cmd + I</span> to create an italic text</span><br />
                        <span className="instruction"><span className="instruction-highlight">cmd + U</span> to create an underline text</span><br />
                        <span className="instruction"><span className="instruction-highlight">`</span> to create inline code</span><br />
                        <span className="instruction"><span className="instruction-highlight">```</span> + <span className="instruction-highlight">space</span> to create a code snippet</span><br />
                        <span className="instruction"><span className="instruction-highlight">[](url)</span> to create a link</span><br />
                </div>}
            />}
        </div>
    )
}