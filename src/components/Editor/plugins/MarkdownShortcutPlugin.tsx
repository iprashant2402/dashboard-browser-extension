import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, HeadingTagType } from '@lexical/rich-text';
import { $getSelection, $isRangeSelection, TextNode } from 'lexical';
import { $setBlocksType } from '@lexical/selection';

const HEADING_LEVEL_MAP = {
    '# ': 'h1',
    '## ': 'h2',
    '### ': 'h3',
    '#### ': 'h4',
    '##### ': 'h5',
};

const STRINGS_TO_CHECK = Object.keys(HEADING_LEVEL_MAP);

const evaluateHeadingLevel = (text: keyof typeof HEADING_LEVEL_MAP): HeadingTagType => {
    return HEADING_LEVEL_MAP[text] as HeadingTagType;
}

export function MarkdownShortcutPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeTransform = editor.registerNodeTransform(TextNode, (textNode) => {
      const textContent = textNode.getTextContent();
      
      // Check if text starts with # and space
      if (STRINGS_TO_CHECK.some((string) => textContent === string)) {
        // We need to run this in the next frame to avoid the offset error
        setTimeout(() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              // First set blocks type to heading
              $setBlocksType(selection, () => $createHeadingNode(evaluateHeadingLevel(textContent as keyof typeof HEADING_LEVEL_MAP)));
              
              // Then clear the # character if it exists
              const updatedSelection = $getSelection();
              if ($isRangeSelection(updatedSelection)) {
                const anchor = updatedSelection.anchor;
                if (anchor.offset > 0) {
                  textNode.setTextContent('');
                }
              }
            }
          });
        }, 0);
      }
    });

    return () => {
      removeTransform();
    };
  }, [editor]);

  return null;
} 