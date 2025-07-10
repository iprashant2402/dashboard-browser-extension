import { useEffect, useRef } from "react";
import { Editor } from "../../../../components/Editor";
import { usePageEditor } from "../../hooks/usePageEditor";

export const PageEditor = () => {
    const { state, actions } = usePageEditor();
    const nameRef = useRef<HTMLHeadingElement>(null);

    const onBlur = () => {
        if (!nameRef.current) return;
        const textContent = nameRef.current.textContent;
        if (textContent && textContent.length > 0) actions.handleOnSavePageTitle(textContent);
        else nameRef.current.innerText = state.page?.title || "Untitled";
    };

    return (
        <div>
            <h4 contentEditable={'plaintext-only'} onBlur={onBlur} ref={nameRef}>{state.page?.title || "Untitled"}</h4>
            {state.pageFetchStatus === "success" && <Editor 
                onChange={actions.handleOnSavePage}
                initialState={state.page?.content}
                onSave={actions.handleOnSavePage}
            />}
        </div>
    )
}