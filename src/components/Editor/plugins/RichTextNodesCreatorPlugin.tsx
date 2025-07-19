import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTextNode, $getRoot, $getSelection, $isNodeSelection, $isRangeSelection, LexicalNode } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { useCallback } from "react";
import { Button } from "../../Button";

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
        <Button onClick={handleConvertToHeading} variant="clear" label="H1" />
    )
}