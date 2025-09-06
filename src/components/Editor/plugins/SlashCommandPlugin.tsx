import { useEffect, useState, useCallback, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  TextNode,
  $getNodeByKey,
  $isTextNode
} from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createCodeNode } from '@lexical/code';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
import { $setBlocksType } from '@lexical/selection';
import { createPortal } from 'react-dom';
import './SlashCommandPlugin.css';
import { INSERT_IMAGE_COMMAND_SELECTED_EVENT } from './ImagePlugin';
import { AnalyticsTracker } from '../../../analytics/AnalyticsTracker';

export interface SlashCommand {
  key: string;
  title: string;
  description: string;
  icon: string;
  keywords: string[];
  onSelect: () => void;
}

const SlashCommandsList = () => {
  const [editor] = useLexicalComposerContext();

  const createSlashCommands = useCallback((): SlashCommand[] => {
    return [
      {
        key: 'paragraph',
        title: 'Text',
        description: 'Just start typing with plain text.',
        icon: '📝',
        keywords: ['text', 'paragraph', 'p'],
        onSelect: () => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createParagraphNode());
            }
          });
        }
      },
      {
        key: 'heading1',
        title: 'Heading 1',
        description: 'Big section heading.',
        icon: 'H1',
        keywords: ['h1', 'heading1', 'title', 'big'],
        onSelect: () => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode('h1'));
            }
          });
        }
      },
      {
        key: 'heading2',
        title: 'Heading 2',
        description: 'Medium section heading.',
        icon: 'H2',
        keywords: ['h2', 'heading2', 'subtitle'],
        onSelect: () => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode('h2'));
            }
          });
        }
      },
      {
        key: 'heading3',
        title: 'Heading 3',
        description: 'Small section heading.',
        icon: 'H3',
        keywords: ['h3', 'heading3', 'subheading'],
        onSelect: () => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode('h3'));
            }
          });
        }
      },
      {
        key: 'image',
        title: 'Image',
        description: 'Add an image.',
        icon: '📷',
        keywords: ['image', 'img', 'picture'],
        onSelect: () => {
          window.dispatchEvent(new CustomEvent(INSERT_IMAGE_COMMAND_SELECTED_EVENT));
        }
      },
      {
        key: 'quote',
        title: 'Quote',
        description: 'Capture a quote.',
        icon: '💬',
        keywords: ['quote', 'blockquote', 'cite'],
        onSelect: () => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createQuoteNode());
            }
          });
        }
      },
      {
        key: 'code',
        title: 'Code',
        description: 'Capture a code snippet.',
        icon: '💻',
        keywords: ['code', 'codeblock', 'snippet'],
        onSelect: () => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createCodeNode());
            }
          });
        }
      },
      {
        key: 'bullet-list',
        title: 'Bulleted List',
        description: 'Create a simple bulleted list.',
        icon: '•',
        keywords: ['ul', 'list', 'bullet', 'unordered'],
        onSelect: () => {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }
      },
      {
        key: 'numbered-list',
        title: 'Numbered List',
        description: 'Create a list with numbering.',
        icon: '1.',
        keywords: ['ol', 'list', 'numbered', 'ordered'],
        onSelect: () => {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }
      }
    ];
  }, [editor]);

  return createSlashCommands();
};

interface SlashCommandMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  searchTerm: string;
  selectedIndex: number;
  onSelect: (command: SlashCommand) => void;
  onSelectedIndexChange: (index: number) => void;
}

const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({
  isOpen,
  position,
  searchTerm,
  selectedIndex,
  onSelect,
  onSelectedIndexChange
}) => {
  const commands = SlashCommandsList();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    AnalyticsTracker.track('Command palette - Trigger');
  }, [isOpen])

  const filteredCommands = commands.filter(command => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      command.title.toLowerCase().includes(term) ||
      command.description.toLowerCase().includes(term) ||
      command.keywords.some(keyword => keyword.toLowerCase().includes(term))
    );
  });

  useEffect(() => {
    if (isOpen && menuRef.current) {
      const selectedElement = menuRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      ) as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [isOpen, selectedIndex]);

  if (!isOpen || filteredCommands.length === 0) {
    return null;
  }

  return createPortal(
    <div
      ref={menuRef}
      className="slash-command-menu"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        zIndex: 1000
      }}
    >
      <div className="slash-command-menu-header">
        <span className="slash-command-menu-title">Basic blocks</span>
        {searchTerm && (
          <span className="slash-command-search-term">
            "{searchTerm}"
          </span>
        )}
      </div>
      <div className="slash-command-menu-items">
        {filteredCommands.map((command, index) => (
          <div
            key={command.key}
            data-index={index}
            className={`slash-command-menu-item ${
              index === selectedIndex ? 'selected' : ''
            }`}
            onClick={() => onSelect(command)}
            onMouseEnter={() => onSelectedIndexChange(index)}
          >
            <div className="slash-command-icon">{command.icon}</div>
            <div className="slash-command-content">
              <div className="slash-command-title">{command.title}</div>
              <div className="slash-command-description">{command.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>,
    document.body
  );
};

export function SlashCommandPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [triggerNodeKey, setTriggerNodeKey] = useState<string | null>(null);
  const commands = SlashCommandsList();

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setSearchTerm('');
    setSelectedIndex(0);
    setTriggerNodeKey(null);
  }, []);

  const getFilteredCommands = useCallback(() => {
    if (!searchTerm) return commands;
    const term = searchTerm.toLowerCase();
    return commands.filter(command =>
      command.title.toLowerCase().includes(term) ||
      command.description.toLowerCase().includes(term) ||
      command.keywords.some(keyword => keyword.toLowerCase().includes(term))
    );
  }, [commands, searchTerm]);

  const selectCommand = useCallback((command: SlashCommand) => {
    AnalyticsTracker.track('Command palette - Command selected', {
      command_name: command.title,
      command_id: command.key,
    });
    editor.update(() => {
      if (triggerNodeKey) {
        const node = $getNodeByKey(triggerNodeKey);
        if ($isTextNode(node)) {
          // Remove the slash and search term
          const textContent = node.getTextContent();
          const slashIndex = textContent.lastIndexOf('/');
          if (slashIndex !== -1) {
            const beforeSlash = textContent.substring(0, slashIndex);
            const afterSearchTerm = textContent.substring(slashIndex + 1 + searchTerm.length);
            
            if (beforeSlash + afterSearchTerm) {
              node.setTextContent(beforeSlash + afterSearchTerm);
            } else {
              node.remove();
            }
          }
        }
      }
      
      // Execute the command
      command.onSelect();
    });
    
    closeMenu();
  }, [editor, triggerNodeKey, searchTerm, closeMenu]);

  const handleKeyCommand = useCallback((command: string) => {
    if (!isMenuOpen) return false;

    const filteredCommands = getFilteredCommands();

    switch (command) {
      case 'arrow-down':
        setSelectedIndex(prev => {
          const newIndex = prev < filteredCommands.length - 1 ? prev + 1 : 0;
          return newIndex;
        });
        return true;
      case 'arrow-up':
        setSelectedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : filteredCommands.length - 1;
          return newIndex;
        });
        return true;
      case 'enter':
        if (filteredCommands[selectedIndex]) {
          selectCommand(filteredCommands[selectedIndex]);
        }
        return true;
      case 'escape':
        closeMenu();
        return true;
      case 'tab':
        if (filteredCommands[selectedIndex]) {
          selectCommand(filteredCommands[selectedIndex]);
        }
        return true;
    }

    return false;
  }, [isMenuOpen, getFilteredCommands, selectedIndex, selectCommand, closeMenu]);

  const updateMenuPosition = useCallback(() => {
    // Only update position if menu is actually open
    if (!isMenuOpen) return;
    
    // Use requestAnimationFrame to ensure DOM is updated
    requestAnimationFrame(() => {
      const domSelection = window.getSelection();
      if (!domSelection || domSelection.rangeCount === 0) return;

      const range = domSelection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      // Get viewport dimensions
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Try to get actual menu dimensions if available
      const menuElement = document.querySelector('.slash-command-menu') as HTMLElement;
      const menuHeight = menuElement ? Math.min(menuElement.scrollHeight + 20, 300) : 300;
      const menuWidth = menuElement ? Math.min(menuElement.scrollWidth + 20, 400) : 300;
      const menuPadding = 8; // spacing from cursor
      
      // Calculate available space
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const spaceRight = viewportWidth - rect.left;
      
      // Determine vertical position
      let y = rect.bottom + menuPadding;
      if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
        // Not enough space below and more space above - position above cursor
        y = rect.top - menuHeight - menuPadding;
      }
      
      // Determine horizontal position
      let x = rect.left;
      if (spaceRight < menuWidth) {
        // Not enough space on right - align to right edge of viewport
        x = viewportWidth - menuWidth - 16; // 16px padding from edge
      }
      
      // Add scroll offset to handle scrolled content
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      setMenuPosition({
        x: x + scrollLeft,
        y: y + scrollTop
      });
    });
  }, [isMenuOpen]);

  const isAtStartOfLine = useCallback((node: TextNode, offset: number): boolean => {
    const textContent = node.getTextContent();
    const beforeCursor = textContent.substring(0, offset);
    
    // Check if there are only whitespace characters before the cursor in this node
    const trimmedBefore = beforeCursor.trim();
    if (trimmedBefore !== '' && !trimmedBefore.endsWith('/')) {
      return false;
    }

    // Check if this is the first node in the paragraph or if all previous content is whitespace
    const parent = node.getParent();
    if (!parent) return true;

         const siblings = parent.getChildren();
     const nodeIndex = siblings.findIndex(child => child === node);
    
    // Check all previous siblings
    for (let i = 0; i < nodeIndex; i++) {
      const sibling = siblings[i];
      if ($isTextNode(sibling)) {
        const siblingText = sibling.getTextContent().trim();
        if (siblingText !== '') {
          return false;
        }
      } else {
        // Non-text node means we're not at start of line
        return false;
      }
    }

    return true;
  }, []);

  useEffect(() => {
    const removeTransform = editor.registerNodeTransform(TextNode, (textNode) => {
      const textContent = textNode.getTextContent();
      const selection = $getSelection();
      
      if (!$isRangeSelection(selection)) return;

      const anchor = selection.anchor;
      if (anchor.getNode() !== textNode) return;

      const offset = anchor.offset;
            
      // Look for slash at current position or just before
      let slashIndex = -1;
      let searchQuery = '';
      
      // Check if we just typed a slash
      if (offset > 0 && textContent[offset - 1] === '/') {
        slashIndex = offset - 1;
      } else {
        // Look for slash earlier in the text
        const beforeCursor = textContent.substring(0, offset);
        slashIndex = beforeCursor.lastIndexOf('/');
        if (slashIndex !== -1) {
          searchQuery = beforeCursor.substring(slashIndex + 1);
        }
      }

              // Always check if menu should be open for this node
        if (isMenuOpen && triggerNodeKey === textNode.getKey()) {
          // Check if slash still exists and is at start of line
          if (slashIndex === -1 || !isAtStartOfLine(textNode, slashIndex)) {
            // Slash was removed or we're no longer at start of line
            closeMenu();
            return;
          }
          
          // Only update search term if it actually changed
          const newSearchTerm = searchQuery;
          if (newSearchTerm !== searchTerm) {
            setSearchTerm(newSearchTerm);
            setSelectedIndex(0);
            
            // Close menu if no matches
            const filteredCommands = commands.filter(command => {
              if (!newSearchTerm) return true;
              const term = newSearchTerm.toLowerCase();
              return (
                command.title.toLowerCase().includes(term) ||
                command.description.toLowerCase().includes(term) ||
                command.keywords.some(keyword => keyword.toLowerCase().includes(term))
              );
            });
            
            if (filteredCommands.length === 0) {
              closeMenu();
            }
          }
        } else if (slashIndex !== -1 && isAtStartOfLine(textNode, slashIndex) && !isMenuOpen && slashIndex === offset - 1) {
          // Just typed a slash - open menu
          setIsMenuOpen(true);
          setSearchTerm('');
          setSelectedIndex(0);
          setTriggerNodeKey(textNode.getKey());
          // Position will be updated by separate effect
        }
    });

    return () => {
      removeTransform();
    };
  }, [editor, isMenuOpen, triggerNodeKey, isAtStartOfLine, closeMenu, commands, searchTerm]);

    // Use direct DOM event listeners for more reliable keyboard handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isMenuOpen) return;
      
      let handled = false;
      
      switch (event.key) {
        case 'ArrowDown':
          handled = handleKeyCommand('arrow-down');
          break;
        case 'ArrowUp':
          handled = handleKeyCommand('arrow-up');
          break;
        case 'Enter':
          handled = handleKeyCommand('enter');
          break;
        case 'Escape':
          handled = handleKeyCommand('escape');
          break;
        case 'Tab':
          handled = handleKeyCommand('tab');
          break;
      }

      if (handled) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
      }
    };

    // Set up listener only once
    document.addEventListener('keydown', handleKeyDown, true);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isMenuOpen, handleKeyCommand]); // Removed editor dependency to prevent re-setup

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen, closeMenu]);

  // Update menu position when menu opens or changes
  useEffect(() => {
    if (isMenuOpen) {
      // Small delay to ensure menu is rendered before positioning
      setTimeout(updateMenuPosition, 0);
    }
  }, [isMenuOpen, searchTerm, updateMenuPosition]);

  // Additional safety check: close menu if we lose focus or text doesn't contain slash
  useEffect(() => {
    if (!isMenuOpen || !triggerNodeKey) return;

    const interval = setInterval(() => {
      editor.getEditorState().read(() => {
        const node = $getNodeByKey(triggerNodeKey);
        if (!node || !$isTextNode(node)) {
          closeMenu();
          return;
        }

        const textContent = node.getTextContent();
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || selection.anchor.getNode() !== node) {
          closeMenu();
          return;
        }

        const offset = selection.anchor.offset;
        const beforeCursor = textContent.substring(0, offset);
        const slashIndex = beforeCursor.lastIndexOf('/');
        
        if (slashIndex === -1 || !isAtStartOfLine(node, slashIndex)) {
          closeMenu();
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, [editor, isMenuOpen, triggerNodeKey, closeMenu, isAtStartOfLine]);

  return (
    <>
      <SlashCommandMenu
        isOpen={isMenuOpen}
        position={menuPosition}
        searchTerm={searchTerm}
        selectedIndex={selectedIndex}
        onSelect={selectCommand}
        onSelectedIndexChange={setSelectedIndex}
      />
    </>
  );
} 