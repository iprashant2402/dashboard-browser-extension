import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { AutoSaveManager } from "../../../modules/Notes/services/AutoSave.service";
import { useEffect } from "react";

export function AutoSaveManagerPlugin(props: {
    autoSaveManager: AutoSaveManager;
}) {
    const { autoSaveManager } = props;
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        editor.registerUpdateListener(({ editorState, prevEditorState, dirtyLeaves }) => {
            autoSaveManager.scheduleAutoSave(editorState, prevEditorState, dirtyLeaves);
        });
    }, [autoSaveManager, editor]);

    return null;
}