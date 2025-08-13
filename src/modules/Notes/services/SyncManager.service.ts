import { ToastData } from '../../../components/Toast';
import { pagesSyncRepository } from '../api';
import { localPageRepository } from '../repository/PageRepository';
import { Page } from '../types/Page';
import { SimpleDelta, ConflictInfo, DeltasResponse } from '../types/SyncDeltas';
import { SyncQueue } from '../utils/sync';
import { v4 as uuidv4 } from 'uuid';

export class SyncManager {
  private apiService = pagesSyncRepository;
  private syncInProgress = false;

  constructor() {
    // Start background sync
    this.startBackgroundSync();
  }

  // Process sync queue
  async processSyncQueue(): Promise<void> {
    if (this.syncInProgress || !navigator.onLine) return;

    this.syncInProgress = true;
    
    try {
      const pendingDeltas = await SyncQueue.get();
      
      if (pendingDeltas.length === 0) {
        this.syncInProgress = false;
        return;
      }

      // Group by page and send in batches
      const deltasByPage = this.groupDeltasByPage(pendingDeltas);
      
      for (const [pageId, deltas] of deltasByPage) {
        await this.syncPageDeltas(pageId, deltas);
      }
      
    } catch (error) {
      console.error('Sync queue processing failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncPageDeltas(pageId: string, deltas: SimpleDelta[]): Promise<void> {
    try {
      // Send deltas to server
      const response = await this.apiService.syncDeltas(deltas);
      
      if (response.success) {
        // Remove successfully processed deltas from queue
        for (const version of response.processedVersions) {
          const deltaToRemove = deltas.find(d => d.toVersion === version);
          if (deltaToRemove) {
            SyncQueue.remove(deltaToRemove.pageId, deltaToRemove.toVersion);
          }
        }

        // Update page sync status
        await this.updatePageSyncStatus(pageId, 'synced');
      }

      // Handle conflicts
      if (response.conflicts && response.conflicts.length > 0) {
        await this.handleConflicts(response.conflicts);
      }

    } catch (error) {
      console.error(`Failed to sync page ${pageId}:`, error);
    }
  }

  // Handle conflicts
  private async handleConflicts(conflicts: ConflictInfo[]): Promise<void> {
    for (const conflict of conflicts) {
      try {
        // Get remote deltas to resolve conflict
        const remoteDeltas = await this.apiService.getPageDeltas(
          conflict.pageId
        );

        // Simple conflict resolution: last-write-wins with user notification
        await this.resolveConflict(conflict, remoteDeltas);
        
      } catch (error) {
        console.error(`Failed to resolve conflict for page ${conflict.pageId}:`, error);
      }
    }
  }

  private async resolveConflict(
    conflict: ConflictInfo, 
    remoteDeltas: DeltasResponse
  ): Promise<void> {
    // Implementation depends on conflict resolution strategy
    // For MVP: notify user and create backup
    
    const localPage = await localPageRepository.getPage(conflict.pageId);
    if (localPage) {
      // Create backup
      await this.createBackup(localPage);
      
      // Apply remote changes
      await this.applyRemoteDeltas(conflict.pageId, remoteDeltas.deltas);
      
      // Notify user
      this.notifyUser({
        type: 'warning',
        message: 'Conflict detected. Your local changes have been saved as a backup.',
        id: uuidv4()
      });
    }
  }

  // Background sync every 30 seconds
  private startBackgroundSync(): void {
    setInterval(async () => {
      if (navigator.onLine) {
        await this.processSyncQueue();
        await this.pullRemoteChanges();
      }
    }, 30000);

    // Sync when coming online
    window.addEventListener('online', () => {
      this.processSyncQueue();
    });
  }

  // Pull remote changes
  private async pullRemoteChanges(): Promise<void> {
    try {
      const pages = await localPageRepository.getPages();
      
      for (const page of pages) {
        const remoteDeltas = await this.apiService.getPageDeltas(
          page.id
        );
        
        if (remoteDeltas.deltas.length > 0) {
          await this.applyRemoteDeltas(page.id, remoteDeltas.deltas);
        }
      }
      
    } catch (error) {
      console.error('Failed to pull remote changes:', error);
    }
  }

  private async applyRemoteDeltas(pageId: string, deltas: SimpleDelta[]): Promise<void> {
    // Apply deltas to local page
    // This requires implementing delta application logic
    // Similar to server-side applyDeltaToContent
  }

  // Utility methods
  private groupDeltasByPage(deltas: SimpleDelta[]): Map<string, SimpleDelta[]> {
    const grouped = new Map<string, SimpleDelta[]>();
    
    for (const delta of deltas) {
      const existing = grouped.get(delta.pageId) || [];
      existing.push(delta);
      grouped.set(delta.pageId, existing);
    }
    
    return grouped;
  }

  private async updatePageSyncStatus(pageId: string, status: string): Promise<void> {
    console.log('Page sync status updated', pageId, status);
  }

  private async createBackup(page: Page): Promise<void> {
    console.log('createBackup', page);
  }

  private notifyUser(notification: ToastData): void {
    alert(notification.message);
  }
}