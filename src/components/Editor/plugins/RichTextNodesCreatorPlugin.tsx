import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTextNode, $getRoot, $getSelection, $isNodeSelection, $isRangeSelection, LexicalNode } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { useCallback } from "react";

export default function RichTextNodesCreatorPlugin() {
    const [editor] = useLexicalComposerContext();

    const handleConvertToHeading = useCallback(() => {
        editor.update(() => {
            const root = $getRoot();
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode());
            } else if($isNodeSelection(selection)){
                $setBlocksType(selection, () => $createHeadingNode());
            } else {
                root.append($createHeadingNode('h1').append($createTextNode('Heading') as LexicalNode));
            }
        })
    }, [editor]);

    return (
        <button onClick={handleConvertToHeading}>
            H1
        </button>
    )
}