import { FORMAT_TEXT_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export function KeyboardShortcutsPlugin(): null {
    const [editor] = useLexicalComposerContext();
  
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        const { ctrlKey, metaKey, shiftKey, key } = event;
        const isModifierPressed = ctrlKey || metaKey;
  
        // Handle Ctrl/Cmd+Shift+X for strikethrough
        if (isModifierPressed && shiftKey && key.toLowerCase() === 'x') {
          event.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
          return;
        }
      };
  
      return editor.registerRootListener((rootElement, prevRootElement) => {
        if (prevRootElement !== null) {
          prevRootElement.removeEventListener('keydown', handleKeyDown);
        }
        if (rootElement !== null) {
          rootElement.addEventListener('keydown', handleKeyDown);
        }
      });
    }, [editor]);
  
    return null;
  }