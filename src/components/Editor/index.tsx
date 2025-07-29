import './index.css'
import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {MarkdownShortcutPlugin} from '@lexical/react/LexicalMarkdownShortcutPlugin';
import {InitialConfigType, LexicalComposer} from '@lexical/react/LexicalComposer';
import {ClickableLinkPlugin} from '@lexical/react/LexicalClickableLinkPlugin';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {ListPlugin} from '@lexical/react/LexicalListPlugin';
import {
  DOMConversionMap,
  DOMExportOutput,
  DOMExportOutputMap,
  EditorState,
  Klass,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  TextNode,
  KEY_ENTER_COMMAND,
  COMMAND_PRIORITY_HIGH,
} from 'lexical';
import EditorTheme from './editorTheme';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListNode } from '@lexical/list';
import { ListItemNode } from '@lexical/list';
import { $isListItemNode, $isListNode } from '@lexical/list';
import { useMemo, useRef, useEffect } from 'react';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { AutoLinkPlugin, createLinkMatcherWithRegExp } from '@lexical/react/LexicalAutoLinkPlugin';
import { EMAIL_REGEX, URL_REGEX } from '../../utils/helpers';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, $createParagraphNode } from 'lexical';


const MATCHERS = [
   createLinkMatcherWithRegExp(URL_REGEX, (text) => {
      return text;
   }),
   createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => {
      return `mailto:${text}`;
   }),
];

// Plugin to handle list exit functionality
function ListExitPlugin(): null {
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

export interface EditorProps {
  placeholder?: string | React.ReactNode;
  onChange: (content: string) => void;
  initialState?: string;
  onSave: (content: string) => void;
}

const DefaultPlaceholder = 'Type something here...'

function constructImportMap(): DOMConversionMap {
  const importMap: DOMConversionMap = {};

  // Wrap each node's importDOM with our custom converter
  [ParagraphNode, TextNode, HeadingNode, CodeNode, LinkNode, ListNode, ListItemNode, QuoteNode, AutoLinkNode].forEach(
    (node) => {
      const importFunction = node.importDOM?.();
      if (importFunction) {
        Object.keys(importFunction).forEach((key) => {
          importMap[key] = importFunction[key];
        });
      }
    },
  );

  return importMap;
}

const exportMap: DOMExportOutputMap = new Map<
  Klass<LexicalNode>,
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
  [
    TextNode,
    (editor, node) => {
      const element = document.createElement('span');
      element.textContent = node.getTextContent();
      return { element };
    },
  ],
]);


export const Editor = (props: EditorProps) => {
  const editorStateRef = useRef<EditorState | undefined>(undefined);

  const editorConfig: InitialConfigType = useMemo(() => {
    return {
      namespace: 'Scratchpad',
      editorState: props.initialState || undefined,
      nodes: [ParagraphNode, TextNode, HeadingNode, HorizontalRuleNode, CodeNode, LinkNode, ListNode, ListItemNode, QuoteNode, AutoLinkNode] as Array<Klass<LexicalNode>>,
      onError(error: Error) {
        throw error;
      },
      theme: EditorTheme,
      html: {
        export: exportMap,
        import: constructImportMap(),
      }
    };
  }, [props.initialState]);

  const onChange = (content: EditorState) => {
    editorStateRef.current = content;
    if (content) {
      props.onChange(JSON.stringify(content));
    }
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
      {/* <ToolbarPlugin /> */}
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                aria-placeholder={DefaultPlaceholder}
                placeholder={ !props.placeholder || typeof props.placeholder === 'string' ? (
                  <div className="editor-placeholder">{props.placeholder || DefaultPlaceholder}</div>
                ): (
                  <div>{props.placeholder}</div>
                )}
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <OnChangePlugin onChange={onChange} />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <LinkPlugin />
          <AutoLinkPlugin matchers={MATCHERS} />
          <ListPlugin />
          <ListExitPlugin />
          <MarkdownShortcutPlugin />
          <ClickableLinkPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}