import { EditorState, LexicalNode, $getRoot, $isElementNode } from 'lexical';
import { SimpleChange, SimpleDelta } from '../types/SyncDeltas';

export class ChangeTracker {
  private pendingChanges: SimpleChange[] = [];
  private pageId: string;
  private currentVersion: number = 1;

  constructor(pageId: string, initialVersion: number = 1) {
    this.pageId = pageId;
    this.currentVersion = initialVersion;
  }

  // Track changes from Lexical editor
  trackChanges(
    editorState: EditorState, 
    prevEditorState: EditorState, 
    dirtyNodes: Set<string>
  ): SimpleChange[] {
    const changes: SimpleChange[] = [];
    
    // Process each dirty node within the editor state context
    editorState.read(() => {
      for (const nodeKey of dirtyNodes) {
        const currentNode = editorState._nodeMap.get(nodeKey);
        const prevNode = prevEditorState?._nodeMap.get(nodeKey);
        
        const change = this.detectNodeChange(currentNode, prevNode, nodeKey, editorState, prevEditorState);
        if (change) {
          changes.push(change);
        }
      }
    });
    
    // Add to pending changes
    this.pendingChanges.push(...changes);
    
    return changes;
  }

  private detectNodeChange(
    currentNode: LexicalNode | undefined, 
    prevNode: LexicalNode | undefined, 
    nodeKey: string,
    editorState: EditorState,
    prevEditorState: EditorState
  ): SimpleChange | null {
    if (!prevNode && currentNode) {
      // Node was inserted
      return {
        nodeId: nodeKey,
        operation: 'insert',
        content: this.serializeNode(currentNode),
        position: this.findNodePosition(currentNode),
        metadata: null,
      };
    } else if (prevNode && !currentNode) {
      // Node was deleted
      return {
        nodeId: nodeKey,
        operation: 'delete',
      };
    } else if (prevNode && currentNode && !this.nodesEqual(prevNode, currentNode, prevEditorState)) {
      // Node was updated
      return {
        nodeId: nodeKey,
        operation: 'update',
        content: this.serializeNode(currentNode),
        position: this.findNodePosition(currentNode)
      };
    }
    
    return null;
  }

  // Generate delta for sync
  generateDelta(): SimpleDelta | null {
    if (this.pendingChanges.length === 0) return null;

    const delta: SimpleDelta = {
      pageId: this.pageId,
      fromVersion: this.currentVersion,
      toVersion: this.currentVersion + 1,
      changes: [...this.pendingChanges],
      timestamp: Date.now()
    };

    return delta;
  }

  // Clear pending changes after successful sync
  clearPendingChanges(): void {
    this.pendingChanges = [];
    this.currentVersion++;
  }

  getPendingChangesCount(): number {
    return this.pendingChanges.length;
  }

  private serializeNode(node: LexicalNode): unknown {
    return node.exportJSON();
  }

  private findNodePosition(node: LexicalNode): number {
    // For a simple but effective position calculation, we can use the node's index within its parent
    // plus a accumulated offset based on all previous siblings' content
    
    let position = 0;
    const currentNode = node;
    const parent = currentNode.getParent();
    
    // If node has no parent, it's likely the root, return 0
    if (!parent) {
      return 0;
    }
    
    // Calculate position by going through all previous siblings and accumulating their length
    const siblings = parent.getChildren();
    const nodeIndex = siblings.indexOf(currentNode);
    
    for (let i = 0; i < nodeIndex; i++) {
      const sibling = siblings[i];
      
      // For element nodes, count their text content length
      if ($isElementNode(sibling)) {
        position += sibling.getTextContentSize();
      } else {
        // For text nodes and others, use their text content
        const textContent = sibling.getTextContent();
        position += textContent.length;
      }
    }
    
    // If the current node is nested, we need to add the parent's position as well
    if (parent !== $getRoot()) {
      position += this.findNodePosition(parent);
    }
    
    return position;
  }

  private nodesEqual(node1: LexicalNode, node2: LexicalNode, prevEditorState: EditorState): boolean {
    // Compare serialized versions of the nodes
    const serialized1 = this.serializeNode(node1);
    let serialized2: unknown;
    
    // Serialize the previous node within its editor state context
    prevEditorState.read(() => {
      serialized2 = this.serializeNode(node2);
    });
    
    return JSON.stringify(serialized1) === JSON.stringify(serialized2);
  }
}