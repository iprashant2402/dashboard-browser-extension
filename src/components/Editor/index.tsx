import './index.css'
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
  $isTextNode,
  DOMConversionMap,
  DOMExportOutput,
  DOMExportOutputMap,
  EditorState,
  isHTMLElement,
  Klass,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  TextNode,
} from 'lexical';
import EditorTheme from './editorTheme';
import {parseAllowedColor, parseAllowedFontSize} from './styleConfig';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListNode } from '@lexical/list';
import { ListItemNode } from '@lexical/list';
import { useMemo, useRef, useState } from 'react';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { AutoLinkPlugin, createLinkMatcherWithRegExp } from '@lexical/react/LexicalAutoLinkPlugin';
import { EMAIL_REGEX, URL_REGEX } from '../../utils/helpers';
import { KeyboardShortcutsPlugin } from './plugins/KeyboardShortcutPlugin';
import { ListExitPlugin } from './plugins/ListExitPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import { SlashCommandPlugin } from './plugins/SlashCommandPlugin';
import { ImageNode } from './nodes/ImageNode/ImageNode';
import ImagesPlugin from './plugins/ImagePlugin';
import { TaskBoardNode } from './nodes/TaskBoardNode/TaskBoardNode';
import TaskBoardPlugin from './nodes/TaskBoardNode/TaskBoardPlugin';


const MATCHERS = [
   createLinkMatcherWithRegExp(URL_REGEX, (text) => {
      return text;
   }),
   createLinkMatcherWithRegExp(EMAIL_REGEX, (text) => {
      return `mailto:${text}`;
   }),
];

export interface EditorProps {
  placeholder?: string | React.ReactNode;
  onChange: (content: string) => void;
  initialState?: string;
  onSave: (content: string) => void;
  showToolbar?: boolean;
  editable?: boolean;
}

const DefaultPlaceholder = 'Jot down your thoughts or anything else...';

const removeStylesExportDOM = (
  editor: LexicalEditor,
  target: LexicalNode,
): DOMExportOutput => {
  const output = target.exportDOM(editor);
  if (output && isHTMLElement(output.element)) {
    // Remove all inline styles and classes if the element is an HTMLElement
    // Children are checked as well since TextNode can be nested
    // in i, b, and strong tags.
    for (const el of [
      output.element,
      ...output.element.querySelectorAll('[style],[class],[dir="ltr"]'),
    ]) {
      el.removeAttribute('class');
      el.removeAttribute('style');
      if (el.getAttribute('dir') === 'ltr') {
        el.removeAttribute('dir');
      }
    }
  }
  return output;
};

const exportMap: DOMExportOutputMap = new Map<
  Klass<LexicalNode>,
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
  [ParagraphNode, removeStylesExportDOM],
  [TextNode, removeStylesExportDOM],
]);

const getExtraStyles = (element: HTMLElement): string => {
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = '';
  const fontSize = parseAllowedFontSize(element.style.fontSize);
  const backgroundColor = parseAllowedColor(element.style.backgroundColor);
  const color = parseAllowedColor(element.style.color);
  if (fontSize !== '' && fontSize !== '15px') {
    extraStyles += `font-size: ${fontSize};`;
  }
  if (backgroundColor !== '' && backgroundColor !== 'rgb(255, 255, 255)') {
    extraStyles += `background-color: ${backgroundColor};`;
  }
  if (color !== '' && color !== 'rgb(0, 0, 0)') {
    extraStyles += `color: ${color};`;
  }
  return extraStyles;
};

const constructImportMap = (): DOMConversionMap => {
    const importMap: DOMConversionMap = {};
  
    // Wrap all TextNode importers with a function that also imports
    // the custom styles implemented by the playground
    for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
      importMap[tag] = (importNode) => {
        const importer = fn(importNode);
        if (!importer) {
          return null;
        }
        return {
          ...importer,
          conversion: (element) => {
            const output = importer.conversion(element);
            if (
              output === null ||
              output.forChild === undefined ||
              output.after !== undefined ||
              output.node !== null
            ) {
              return output;
            }
            const extraStyles = getExtraStyles(element);
            if (extraStyles) {
              const {forChild} = output;
              return {
                ...output,
                forChild: (child, parent) => {
                  const textNode = forChild(child, parent);
                  if ($isTextNode(textNode)) {
                    textNode.setStyle(textNode.getStyle() + extraStyles);
                  }
                  return textNode;
                },
              };
            }
            return output;
          },
        };
      };
    }
  
    return importMap;
  };

export const Editor = ({showToolbar = true, editable = true, ...props}: EditorProps) => {
  const editorStateRef = useRef<EditorState | undefined>(undefined);
  const [isFocused, setIsFocused] = useState(false);

  const editorConfig: InitialConfigType = useMemo(() => {
    return {
      namespace: 'Scratchpad',
      editable: editable,
      editorState: props.initialState || undefined,
      nodes: [ParagraphNode, TextNode, HeadingNode, HorizontalRuleNode, CodeNode, LinkNode, ListNode, ListItemNode, QuoteNode, AutoLinkNode, ImageNode, TaskBoardNode] as Array<Klass<LexicalNode>>,
      onError(error: Error) {
        throw error;
      },
      theme: EditorTheme,
      html: {
        export: exportMap,
        import: constructImportMap(),
      }
    };
  }, [props.initialState, editable]);

  const onChange = (content: EditorState) => {
    editorStateRef.current = content;
    if (content) {
      props.onChange(JSON.stringify(content));
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        {showToolbar && <ToolbarPlugin visible={isFocused} />}
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
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ImagesPlugin captionsEnabled={true} />
          <TaskBoardPlugin />
          <OnChangePlugin onChange={onChange} ignoreSelectionChange={true} />
          <HistoryPlugin />
          <LinkPlugin />
          <AutoLinkPlugin matchers={MATCHERS} />
          <MarkdownShortcutPlugin />
          <ListPlugin />
          <ListExitPlugin />
          <KeyboardShortcutsPlugin />
          {isFocused && <SlashCommandPlugin />}
          <ClickableLinkPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}