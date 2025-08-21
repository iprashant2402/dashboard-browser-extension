import { EditorState } from 'lexical';
import { ChangeTracker } from './ChangeTracker.service';
import { SyncManager } from './SyncManager.service';
import { SyncQueue } from '../utils/sync';

export class AutoSaveManager {
  private saveTimeout: number | null = null;
  private readonly SAVE_DELAY = 2000; // 2 seconds
  private readonly MAX_PENDING_CHANGES = 10;
  
  private changeTracker: ChangeTracker;
  private syncManager: SyncManager;
  
  constructor(
    pageId: string, 
    syncManager: SyncManager,
  ) {
    this.changeTracker = new ChangeTracker(pageId);
    this.syncManager = syncManager;
  }

  // Called on every editor update
  scheduleAutoSave(
    editorState: EditorState, 
    prevEditorState: EditorState, 
    dirtyNodes: Set<string>
  ): void {
    // Track changes
    const changes = this.changeTracker.trackChanges(
      editorState, 
      prevEditorState, 
      dirtyNodes
    );

    console.log('changes', changes);

    if (changes.length === 0) return;

    // Clear existing timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Determine save delay based on change types
    const saveDelay = this.calculateSaveDelay();

    // Schedule save
    this.saveTimeout = setTimeout(async () => {
      await this.performAutoSave();
    }, saveDelay);

    // Force save if too many pending changes
    const pendingCount = this.changeTracker.getPendingChangesCount();
    if (pendingCount >= this.MAX_PENDING_CHANGES) {
      this.performAutoSave();
    }
  }

  private async performAutoSave(): Promise<void> {
    const isAuthenticated = !!localStorage.getItem('access_token');
    if (!isAuthenticated) return;
    try {      
      // 2. Generate and queue delta for cloud sync
      const delta = this.changeTracker.generateDelta();
      if (delta) {
        await SyncQueue.add(delta);

        console.log('Changes added to sync queue');
        
        // 3. Attempt cloud sync
        await this.syncManager.processSyncQueue();
        
        // 4. Clear pending changes on success
        this.changeTracker.clearPendingChanges();
      }
      
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }

  private calculateSaveDelay(): number {
    return this.SAVE_DELAY;
  }
}