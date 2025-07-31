import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, KEY_ENTER_COMMAND, $createParagraphNode, COMMAND_PRIORITY_HIGH } from "lexical";
import { $isListItemNode, $isListNode } from '@lexical/list';
import { useEffect } from "react";

// Plugin to handle list exit functionality
export function ListExitPlugin(): null {
    const [editor] = useLexicalComposerContext();
  
    useEffect(() => {       
      return editor.registerCommand(
        KEY_ENTER_COMMAND,
        (event) => {
          const selection = $getSelection();
  
          if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
  
            // Check if we're in a list item
            if ($isListItemNode(anchorNode) || anchorNode.getParent() && $isListItemNode(anchorNode.getParent())) {
              const listItemNode = $isListItemNode(anchorNode) ? anchorNode : anchorNode.getParent();
  
              // Check if the list item is empty
              if (listItemNode && $isListItemNode(listItemNode)) {
                const textContent = listItemNode.getTextContent().trim();
  
                if (textContent === '') {
                  // If empty list item and Enter is pressed, exit the list
                  event?.preventDefault();
  
                  const listNode = listItemNode.getParent();
                  if (listNode && $isListNode(listNode)) {
                    // Remove the empty list item
                    listItemNode.remove();
  
                    // Create a new paragraph after the list
                    const newParagraph = $createParagraphNode();
                    listNode.insertAfter(newParagraph);
                    newParagraph.select();
  
                    return true;
                  }
                }
              }
            }
          }
  
          return false;
        },
        COMMAND_PRIORITY_HIGH
      );
    }, [editor]);
  
    return null;
  }