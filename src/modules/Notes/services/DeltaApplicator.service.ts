/* eslint-disable @typescript-eslint/no-explicit-any */
import { EditorState } from "lexical";
import { localPageRepository } from "../repository/PageRepository";
import { SimpleChange, SimpleDelta } from "../types/SyncDeltas";

export class DeltaApplicator {

    // Main function to apply remote deltas
    async applyRemoteDeltas(pageId: string, deltas: SimpleDelta[]): Promise<void> {
      if (deltas.length === 0) return;

      // Sort deltas by version to apply in correct order
      const sortedDeltas = deltas.sort((a, b) => a.toVersion - b.toVersion);

      // Get current page data from IndexedDB
      const currentPage = await localPageRepository.getPage(pageId);
      if (!currentPage) {
        console.error(`Page ${pageId} not found in local storage`);
        return;
      }

      try {
        // Apply each delta sequentially
        let updatedContent = currentPage.content;
        let latestVersion = currentPage.version;

        for (const delta of sortedDeltas) {
          // Validate delta can be applied
          if (delta.fromVersion !== latestVersion) {
            console.warn(`Version mismatch: expected ${latestVersion}, got ${delta.fromVersion}`);
            // Skip this delta or handle conflict
            continue;
          }

          // Apply delta to content
          updatedContent = await this.applyDeltaToContent(updatedContent ?? null, delta.changes);
          latestVersion = delta.toVersion;
        }

        // Update the editor with new content
        await this.updateEditorContent(updatedContent);

        // Save updated content to IndexedDB
        await localPageRepository.updatePage(pageId, {
          ...currentPage,
          content: updatedContent,
          version: latestVersion,
          syncedAt: new Date().toISOString()
        });

        console.log(`Applied ${deltas.length} remote deltas to page ${pageId}`);

      } catch (error) {
        console.error(`Failed to apply remote deltas to page ${pageId}:`, error);
        throw error;
      }
    }

    // Apply delta changes to Lexical content
    private async applyDeltaToContent(currentContent: string | null, changes: SimpleChange[]): Promise<string> {
      const defaultEmptyContent = "{\"root\":{\"children\":[{\"children\":[],\"direction\":null,\"format\":\"\",\"indent\":0,\"type\":\"paragraph\",\"version\":1,\"textFormat\":0,\"textStyle\":\"\"}],\"direction\":null,\"format\":\"\",\"indent\":0,\"type\":\"root\",\"version\":1}}";

      // Clone content to avoid mutations
      let newContent = JSON.parse(JSON.stringify(currentContent ? currentContent : defaultEmptyContent)) as EditorState;

      // Apply each change
      for (const change of changes) {
        newContent = this.applyChangeToContent(newContent, change);
      }

      return JSON.stringify(newContent);
    }

    // Apply a single change to content
    private applyChangeToContent(content: EditorState, change: SimpleChange): EditorState {
      const { nodeId, operation, content: changeContent, position } = change;

      switch (operation) {
        case 'insert':
          return this.insertNodeInContent(content, nodeId, changeContent, position || 0);
        case 'update':
          return this.updateNodeInContent(content, nodeId, changeContent);
        case 'delete':
          return this.deleteNodeInContent(content, nodeId);
        case 'format':
          return this.formatNodeInContent(content, nodeId, changeContent);
        default:
          console.warn(`Unknown operation: ${operation}`);
          return content;
      }
    }

    // Insert node in content
    private insertNodeInContent(content: any, nodeId: string, nodeContent: any, position: number): any {
      if (!content.root || !content.root.children) {
        content.root = { children: [], type: 'root', direction: 'ltr', format: '', indent: 0, version: 1 };
      }

      // Create new node with the nodeId as key
      const newNode = { ...nodeContent, key: nodeId };

      // Insert at specified position
      const children = content.root.children;
      const insertPosition = Math.min(position, children.length);
      children.splice(insertPosition, 0, newNode);

      return content;
    }

    // Update existing node in content
    private updateNodeInContent(content: any, nodeId: string, nodeContent: any): any {
      const updateNodeRecursive = (node: any): any => {
        if (node.key === nodeId) {
          // Merge the update with existing node
          return { ...node, ...nodeContent, key: nodeId };
        }

        if (node.children && Array.isArray(node.children)) {
          return {
            ...node,
            children: node.children.map(updateNodeRecursive)
          };
        }

        return node;
      };

      return {
        ...content,
        root: updateNodeRecursive(content.root)
      };
    }

    // Delete node from content
    private deleteNodeInContent(content: any, nodeId: string): any {
      const deleteNodeRecursive = (node: any): any => {
        if (node.children && Array.isArray(node.children)) {
          return {
            ...node,
            children: node.children
              .filter((child: any) => child.key !== nodeId)
              .map(deleteNodeRecursive)
          };
        }
        return node;
      };

      return {
        ...content,
        root: deleteNodeRecursive(content.root)
      };
    }

    // Apply formatting to node
    private formatNodeInContent(content: any, nodeId: string, formatData: any): any {
      const formatNodeRecursive = (node: any): any => {
        if (node.key === nodeId) {
          // Apply formatting changes
          return { ...node, ...formatData };
        }

        if (node.children && Array.isArray(node.children)) {
          return {
            ...node,
            children: node.children.map(formatNodeRecursive)
          };
        }

        return node;
      };

      return {
        ...content,
        root: formatNodeRecursive(content.root)
      };
    }

    // Update the Lexical editor with new content
    private async updateEditorContent(newContent: any): Promise<void> {
      console.log('updateEditorContent', newContent);
    }
  }

  export const deltaApplicator = new DeltaApplicator();