import { pagesSyncRepository } from '../api';
import { localPageRepository } from '../repository/PageRepository';
import { Page } from '../types/Page';
import { SimpleDelta, ConflictInfo, DeltasResponse } from '../types/SyncDeltas';
import { SyncQueue } from '../utils/sync';
import { deltaApplicator } from './DeltaApplicator.service';

export class SyncManager {
  private apiService = pagesSyncRepository;
  private syncInProgress = false;

  constructor() {
    // Start background sync
    this.startBackgroundSync();
  }

  // Process sync queue
  async processSyncQueue(): Promise<void> {
    console.info('Processing sync queue')
    const isAuthenticated = !!localStorage.getItem('access_token');
    if (!isAuthenticated) return;
    
    if (this.syncInProgress || !navigator.onLine) return;
    console.info('Processing sync queue:::Starting sync')
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
          conflict.pageId,
          conflict.clientVersion
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
      
      console.info('Conflict detected');
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
    console.info('Pulling remote changes')
    const isAuthenticated = !!localStorage.getItem('access_token');
    if (!isAuthenticated) return;
    console.info('Pulling remote changes:::user logged in')
    try {
      const pages = await localPageRepository.getPages();
      
      for (const page of pages) {
        const remoteDeltas = await this.apiService.getPageDeltas(
          page.id,
          page.version
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
    await deltaApplicator.applyRemoteDeltas(pageId, deltas);
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
}

export const syncManager = new SyncManager();